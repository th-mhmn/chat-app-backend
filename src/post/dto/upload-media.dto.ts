import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UploadMediaDto {
  @IsNumber()
  version: number;

  @IsString()
  @IsNotEmpty()
  display_name: string;

  @IsString()
  @IsNotEmpty()
  format: string;

  @IsString()
  @IsNotEmpty()
  resource_type: string;
}
