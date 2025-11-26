import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class RemoveReactionDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  postId: string;
}
