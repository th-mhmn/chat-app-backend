import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type UserDocument = HydratedDocument<User>;
export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;
  @Prop({ default: '#fff' })
  backgroundColor: string;
  @Prop()
  content: string;
  @Prop()
  mediaUrls?: string[];
  @Prop({ enum: ['public', 'private', 'friends'], default: 'public' })
  visibility: IVisibility;
}

export const PostSchema = SchemaFactory.createForClass(Post);
