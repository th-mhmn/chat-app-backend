import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('image')
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadFile(file);
    const { version, display_name, format, resource_type, public_id } = result;
    return {
      message: 'Upload Successful',
      data: {
        public_id,
        version,
        display_name,
        format,
        resource_type,
      },
    };
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    const result = await this.cloudinaryService.uploadMultipleFiles(files);
    return {
      message: 'Upload Successful',
      data: result.map((res) => {
        const { version, display_name, format, resource_type, public_id } = res;

        return {
          public_id,
          version,
          display_name,
          format,
          resource_type,
        };
      }),
    };
  }
}
