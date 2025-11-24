import { Expose } from 'class-transformer';
import { ConvertObjectId } from 'src/_cores/decorators/convert-object-id.decorator';

export class ResponseUserDto {
  @Expose()
  @ConvertObjectId()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  role: string;
}
