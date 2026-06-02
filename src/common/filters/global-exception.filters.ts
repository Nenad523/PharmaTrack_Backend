/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger} from "@nestjs/common";

@Catch() // ← hvata SVE greške
export class GlobalExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // host je kontekst trenutnog zahtjeva
    // switchToHttp() znači radimo sa HTTP zahtjevima
    const ctx = host.switchToHttp()

    // response je HTTP odgovor koji ćemo poslati klijentu
    const response = ctx.getResponse()

    // Provjeravamo da li je greška HttpException
    // (NotFoundException, BadRequestException itd.)
    // ili neka neočekivana greška (greška baze, null pointer itd.)
    const status = exception instanceof HttpException
      ? exception.getStatus()  // uzmi status iz HttpException (404, 400...)
      : HttpStatus.INTERNAL_SERVER_ERROR  // ili stavi 500

    let message: string | string[] = 'Došlo je do greške. Pokušajte ponovo.'

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse()

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        message = exceptionResponse.message as string | string[]
      } else {
        message = exception.message
      }
    }

    if (status >= 500) {
      this.logger.error(
        `Unhandled exception — HTTP ${status}: ${Array.isArray(message) ? message.join(', ') : message}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `HTTP ${status}: ${Array.isArray(message) ? message.join(', ') : message}`,
      );
    }

    if (response.headersSent) return;

    response.status(status).json({
      success: false,
      error: {
        code: status,
        message
      }
    })
  }
}