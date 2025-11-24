import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { type UserDocument } from 'src/user/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;
  @Prop({ default: '#fff' })
  backgroundColor: string;
  @Prop()
  content: string;
  @Prop({ default: [] })
  mediaUrls: IMediaType[];
  @Prop({ enum: ['public', 'private', 'friends'], default: 'public' })
  visibility: IVisibility;
}

export const PostSchema = SchemaFactory.createForClass(Post);
