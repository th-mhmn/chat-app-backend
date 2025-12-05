import { Expose, Transform, Type } from 'class-transformer';
import { ConvertObjectId } from 'src/_cores/decorators/convert-object-id.decorator';
import { transformMediaUrl } from 'src/_cores/globals/functions';

class SeenByDto {
  @Expose()
  @Transform(({ obj }) => obj?._id)
  seenById: string;
  @Expose()
  @Transform(({ obj }) => obj?.name)
  seenByName: string;
  @Expose()
  @Transform(({ obj }) => transformMediaUrl(obj?.avatar))
  seenByAvatarUrl: string;
}

export class ResponseMessageDto {
  @Expose()
  @ConvertObjectId()
  _id: string;
  @Expose()
  @ConvertObjectId()
  conversation: string;
  @Expose()
  @Transform(({ obj }) => obj?.sender?._id)
  senderId: string;
  @Expose()
  @Transform(({ obj }) => obj?.sender?.name)
  senderName: string;
  @Expose()
  @Transform(({ obj }) => transformMediaUrl(obj.sender?.avatar))
  senderAvatarUrl: string;
  @Expose()
  text: string;
  @Expose()
  @Transform(({ obj }) => console.log(obj?.mediaFiles))
  mediaFiles: string[];
  @Expose()
  isDeleted: boolean;
  @Expose()
  @Type(() => SeenByDto)
  seenBy: SeenByDto;

  @Expose()
  isSeen: boolean;

  @Expose()
  isEdited: boolean;

  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
