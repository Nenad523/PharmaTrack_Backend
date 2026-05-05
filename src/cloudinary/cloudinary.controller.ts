/* eslint-disable prettier/prettier */
import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@Controller('api/v1/upload')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @ApiOperation({ summary: 'Upload slike na Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('/image')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 5 * 1024 * 1024  // maksimalno 5MB
    },
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        callback(new BadRequestException('Samo JPG, PNG i WebP fajlovi su dozvoljeni'), false);
        return;
      }
      callback(null, true);
    }
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Fajl nije proslijeđen');
    }

    const url = await this.cloudinaryService.uploadImage(file);
    return { url };
  }
}