import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { MediaType } from 'src/_cores/globals/classes';

export class SendMessageDto {
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsArray()
  mediaFiles: MediaType[];
}
