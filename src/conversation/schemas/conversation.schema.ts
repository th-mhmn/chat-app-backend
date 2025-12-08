import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MediaType } from 'src/_cores/globals/classes';
import { type MessageDocument } from 'src/message/schemas/message.schema';
import { type UserDocument } from 'src/user/schemas/user.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  participants: UserDocument[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  groupOwner?: UserDocument;

  @Prop({ default: false })
  isGroup: boolean;

  @Prop()
  groupAvatar?: MediaType;

  @Prop()
  groupName?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  lastMessage?: MessageDocument;

  @Prop({ default: null })
  lastMessageAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
