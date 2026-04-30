import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  declare user: Types.ObjectId;

  @Prop()
  declare deviceName: string;

  @Prop()
  declare ip: string;

  @Prop()
  declare accessTokenExp: number;

  @Prop()
  declare refreshTokenExp: number;

  @Prop()
  declare refreshToken: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
