import { Expose, Transform, Type } from 'class-transformer';
import { MediaTypeWithUrl, PostDocument } from '../schemas/post.schema';
import { ConvertObjectId } from 'src/_cores/decorators/convert-object-id.decorator';

export class ResponsePostDto {
  @Expose()
  @ConvertObjectId()
  _id: string;

  @Expose()
  backgroundColor: string;

  @Expose()
  content: string;

  @Expose()
  @Type(() => MediaTypeWithUrl)
  mediaFiles: MediaTypeWithUrl[];

  @Expose()
  visibility: IVisibility;

  @Expose()
  @Transform(({ obj }) => obj.reactionsCount)
  reactionsCount: Map<IReaction, number>;

  @Expose()
  @Transform(({ obj }: { obj: PostDocument }) => obj.author._id)
  authorId: string;

  @Expose()
  @Transform(({ obj }: { obj: PostDocument }) => obj.author.name)
  authorName: string;

  @Expose()
  @Transform(({ obj }: { obj: PostDocument }) => obj.author.email)
  authorEmail: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
