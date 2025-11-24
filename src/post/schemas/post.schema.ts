import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;
  @Prop()
  content: string;
  @Prop()
  mediaUrls?: string[];
  @Prop({ enum: ['public', 'private', 'friends'], default: 'public' })
  visibility: IVisibility;
}

export const PostSchema = SchemaFactory.createForClass(Post);
