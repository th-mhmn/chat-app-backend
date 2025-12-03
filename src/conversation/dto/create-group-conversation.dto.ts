import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { MediaType } from 'src/_cores/globals/classes';

export class CreateGroupConversationDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  participantIds: string[];
  @IsOptional()
  groupAvatar: MediaType;
  @IsNotEmpty()
  groupName: string;
}
