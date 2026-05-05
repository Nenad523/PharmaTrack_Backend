/* eslint-disable prettier/prettier */
import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DatabaseService } from '../database/database.service';
import { ResultSetHeader } from 'mysql2/promise';

@Controller('api/v1/upload')
export class CloudinaryController {
  constructor(
    private cloudinaryService: CloudinaryService,
    private db: DatabaseService
  ) {}

  @ApiOperation({ summary: 'Upload slike lijeka na Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        medicationName: { type: 'string', example: 'Paracetamol' }
      }
    }
  })
  @Post('/medication-image')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        callback(new BadRequestException('Samo JPG, PNG i WebP fajlovi su dozvoljeni'), false);
        return;
      }
      callback(null, true);
    }
  }))
  async uploadMedicationImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('medicationName') medicationName: string
  ) {
    if (!file) {
      throw new BadRequestException('Fajl nije proslijeđen');
    }

    if (!medicationName) {
      throw new BadRequestException('Naziv lijeka je obavezan');
    }

    // Pronađi lijek po nazivu
    const medications = await this.db.query<any[]>(
      'SELECT id FROM Medication WHERE name = ? AND isActive = 1',
      [medicationName]
    )

    if (medications.length === 0) {
      throw new BadRequestException(`Lijek "${medicationName}" nije pronađen u bazi`);
    }

    const medicationId = medications[0].id;

    // Upload na Cloudinary
    const url = await this.cloudinaryService.uploadImage(file);

    // Ažuriraj img_url u bazi
    await this.db.query<ResultSetHeader>(
      'UPDATE Medication SET img_url = ? WHERE id = ?',
      [url, medicationId]
    )

    return {
      medicationId,
      medicationName,
      imageUrl: url
    }
  }
}