import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { MediaType } from 'src/_cores/globals/class';
import { type UserDocument } from 'src/user/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

export class MediaTypeWithUrl extends MediaType {
  @Expose()
  @Transform(
    ({ obj }) =>
      `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/${obj.resource_type}/upload/v${obj.version}/${obj.display_name}`,
  )
  url: string;
}

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;
  @Prop({ default: '#fff' })
  backgroundColor: string;
  @Prop()
  content: string;
  @Prop({ default: [] })
  mediaFiles: MediaType[];
  @Prop({ default: {} })
  reactionsCount: Map<IReaction, number>;
  @Prop({ enum: ['public', 'private', 'friends'], default: 'public' })
  visibility: IVisibility;
}

export const PostSchema = SchemaFactory.createForClass(Post);
