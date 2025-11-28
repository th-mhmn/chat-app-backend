import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MediaType } from 'src/_cores/globals/class';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
