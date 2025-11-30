import { Expose, Transform } from 'class-transformer';
import { ConvertObjectId } from 'src/_cores/decorators/convert-object-id.decorator';
import { transformMediaUrl } from 'src/_cores/globals/functions';

export class ResponseUserDto {
  @Expose()
  @ConvertObjectId()
  _id: string;
  @Expose()
  username: string;
  @Expose()
  bio: string;
  @Expose()
  birthDate: Date;
  @Expose()
  phoneNumber: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  @Transform(({ obj }) => transformMediaUrl(obj.avatar))
  avatarUrl: string;
  @Expose()
  role: string;
  @Expose()
  isActive: boolean;
}
