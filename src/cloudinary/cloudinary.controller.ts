/* eslint-disable prettier/prettier */
import { Controller, Post, Delete, Param, UseInterceptors, UploadedFile, BadRequestException, Body } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Upload slike apoteke na Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        pharmacyId: { type: 'string', example: '1' }
      }
    }
  })
  @Post('/pharmacy-image')
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
  async uploadPharmacyImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('pharmacyId') pharmacyId: string
  ) {
    if (!file) throw new BadRequestException('Fajl nije proslijeđen');
    if (!pharmacyId) throw new BadRequestException('ID apoteke je obavezan');

    const id = parseInt(pharmacyId, 10);
    if (isNaN(id)) throw new BadRequestException('Neispravan ID apoteke');

    const pharmacies = await this.db.query<any[]>(
      'SELECT id FROM Pharmacy WHERE id = ? AND isActive = 1',
      [id]
    );
    if (pharmacies.length === 0) throw new BadRequestException(`Apoteka sa ID-em ${id} nije pronađena`);

    const url = await this.cloudinaryService.uploadImage(file);

    await this.db.query(
      'UPDATE Pharmacy SET img_url = ? WHERE id = ?',
      [url, id]
    );

    return { pharmacyId: id, imageUrl: url };
  }

  @ApiOperation({ summary: 'Brisanje slike lijeka' })
  @Delete('/medication-image/:id')
  async removeMedicationImage(@Param('id') idParam: string) {
    const id = parseInt(idParam, 10);
    if (isNaN(id)) throw new BadRequestException('Neispravan ID lijeka');

    const rows = await this.db.query<any[]>(
      'SELECT id FROM Medication WHERE id = ? AND isActive = 1',
      [id]
    );
    if (rows.length === 0) throw new BadRequestException(`Lijek sa ID-em ${id} nije pronađen`);

    await this.db.query('UPDATE Medication SET img_url = NULL WHERE id = ?', [id]);
    return { success: true };
  }

  @ApiOperation({ summary: 'Brisanje slike apoteke' })
  @Delete('/pharmacy-image/:id')
  async removePharmacyImage(@Param('id') idParam: string) {
    const id = parseInt(idParam, 10);
    if (isNaN(id)) throw new BadRequestException('Neispravan ID apoteke');

    const rows = await this.db.query<any[]>(
      'SELECT id FROM Pharmacy WHERE id = ? AND isActive = 1',
      [id]
    );
    if (rows.length === 0) throw new BadRequestException(`Apoteka sa ID-em ${id} nije pronađena`);

    await this.db.query('UPDATE Pharmacy SET img_url = NULL WHERE id = ?', [id]);
    return { success: true };
  }
}