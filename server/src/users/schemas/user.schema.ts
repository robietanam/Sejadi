import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  declare email: string;

  @Prop({ required: true })
  declare password: string;

  @Prop({ type: [String], default: [] })
  declare devices: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
