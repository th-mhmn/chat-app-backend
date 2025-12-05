import { IsArray, IsMongoId } from 'class-validator';

export class RemoveParticipantsDto {
  @IsArray()
  @IsMongoId({ each: true })
  participantsIds: string[];
}
