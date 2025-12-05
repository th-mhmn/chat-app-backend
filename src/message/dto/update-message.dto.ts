import { IsArray, IsOptional } from 'class-validator';
import { MediaType } from 'src/_cores/globals/classes';

export class UpdateMessageDto {
  @IsOptional()
  text: string;
  @IsOptional()
  @IsArray()
  mediaFiles: MediaType[];
}
