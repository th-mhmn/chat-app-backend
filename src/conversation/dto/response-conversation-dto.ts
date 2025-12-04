import { Expose, Transform } from 'class-transformer';
import { ConvertObjectId } from 'src/_cores/decorators/convert-object-id.decorator';
import { transformMediaUrl } from 'src/_cores/globals/functions';

export class ResponseConversationDto {
  @Expose()
  @ConvertObjectId()
  id: string;

  @Expose()
  isGroup: boolean;

  @Expose()
  @Transform(({ obj }) => obj?.groupOwner?._id)
  groupOwnerId: string;

  @Expose()
  @Transform(({ obj }) => obj?.groupOwner?.name)
  groupOwnerName: string;

  @Expose()
  @Transform(({ obj }) => obj?.groupOwner?.email)
  groupOwnerEmail: string;

  @Expose()
  groupName: string;

  @Expose()
  @Transform(({ obj }) => transformMediaUrl(obj.groupAvatar))
  groupAvatarUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
