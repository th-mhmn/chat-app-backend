import { IsIn, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { REACTION_TYPES } from 'src/_cores/globals/constants';

export class AddReactionDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  postId: string;

  @IsIn(REACTION_TYPES)
  @IsNotEmpty()
  type: IReaction;
}
