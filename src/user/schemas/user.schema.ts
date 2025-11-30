import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MediaType } from 'src/_cores/globals/classes';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;
  @Prop()
  bio?: string;
  @Prop()
  avatar?: MediaType;
  @Prop()
  coverPhoto?: MediaType;
  @Prop()
  email: string;
  @Prop()
  name: string;
  @Prop()
  birthDate?: Date;
  @Prop()
  phoneNumber?: string;
  @Prop()
  password: string;
  @Prop({ default: 'user' })
  role: 'user' | 'admin';
  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
