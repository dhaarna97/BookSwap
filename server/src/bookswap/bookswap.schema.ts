import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { BookCondition, Status } from './bookswap.enum';
import { IsOptional } from 'class-validator';

export type BookswapDocument = Bookswap & Document;

const RequestSchema = new MongooseSchema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: Object.values(Status), default: Status.PENDING },
  createdAt: { type: Date, default: Date.now }
});

@Schema({ timestamps: true })
export class Bookswap {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ type: String, enum: BookCondition, required: true })
  condition: BookCondition;

  @Prop()
  @IsOptional()
  image?: string; 

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId; 

  @Prop({ type: [RequestSchema], default: [] })
  requests: Array<{
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    status: Status;
    createdAt: Date;
  }>;

  @Prop({ default: 0 })
  totalRequests: number;
}

export const BookswapSchema = SchemaFactory.createForClass(Bookswap);
