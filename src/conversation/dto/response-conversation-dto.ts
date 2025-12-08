import { Expose, Transform, Type } from 'class-transformer';
import { ConvertObjectId } from 'src/_cores/decorators/convert-object-id.decorator';
import { transformMediaUrl } from 'src/_cores/globals/functions';

export class ParticipantDto {
  @Expose()
  @ConvertObjectId()
  _id: string;
  @Expose()
  email: string;
  @Expose()
  name: string;
  @Expose()
  @Transform(({ obj }) => transformMediaUrl(obj.avatar))
  avatarUrl: string;
}
export class ResponseConversationDto {
  @Expose()
  @ConvertObjectId()
  id: string;

  @Expose()
  isGroup: boolean;

  @Expose()
  @Type(() => ParticipantDto)
  participants: ParticipantDto[];

  @Expose()
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
  @Transform(({ obj }) => obj?.lastMessage?.text)
  lastMessage: string;

  @Expose()
  @ConvertObjectId()
  @Transform(({ obj }) => obj?.lastMessage?.sender?._id)
  lastMessageSenderId: string;

  @Expose()
  @Transform(({ obj }) => obj?.lastMessage?.sender?.name)
  lastMessageSenderName: string;

  @Expose()
  lastMessageAt: string;

  @Expose()
  isLastMessageSeen: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
