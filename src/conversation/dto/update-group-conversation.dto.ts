import { IsOptional, IsString } from 'class-validator';
import { MediaType } from 'src/_cores/globals/classes';

export class UpdateGroupConversationDto {
  @IsOptional()
  @IsString()
  groupName: string;

  @IsOptional()
  groupAvatar: MediaType;
}
