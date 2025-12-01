import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MediaType } from 'src/_cores/globals/classes';
import { type MessageDocument } from 'src/message/schemas/message.schema';
import { UserDocument } from 'src/user/schemas/user.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  participants: UserDocument[];

  @Prop({ default: false })
  iSGroup: boolean;

  @Prop()
  groupAvatar?: MediaType;

  @Prop()
  groupName?: string;

  @Prop()
  lastMessage?: MessageDocument;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
