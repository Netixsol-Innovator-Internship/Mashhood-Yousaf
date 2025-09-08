// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorater';
import { UserRole } from '../users/schemas/user.schema';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images')
  // @UseInterceptors(FilesInterceptor('files', 10))
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB max file size per file
      },
    }),
  )
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res,
  ) {
    try {
      if (!files || files.length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'No files uploaded',
        });
      }

      const results = await this.uploadService.uploadMultipleImages(files);
      return res.status(HttpStatus.OK).json(results);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Delete('images/:publicId')
  async deleteImage(@Param('publicId') publicId: string, @Res() res) {
    try {
      const result = await this.uploadService.deleteImage(publicId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }
}
