/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";

@Catch() // ← hvata SVE greške, bez argumenta znači sve tipove
export class GlobalExceptionFilter implements ExceptionFilter {

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

    // Pošalji JSON odgovor klijentu
    response.status(status).json({
      success: false,
      error: {
        code: status,
        message
      }
    })
  }
}