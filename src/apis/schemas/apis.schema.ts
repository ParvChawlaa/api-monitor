import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsObject } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<ApiInfo>;

@Schema()
export class ApiInfo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  apiName: string;

  @Prop({ required: true })
  apiLink: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  callFrequency: number;

  @Prop({ required: true })
  status: boolean;

  @Prop({ type: Object, required: false })
  header: Record<string, any>;

  @Prop({ type: Object, required: false })
  body: Record<string, any>; /// Accepts a JSON object
}

export const ApiInfoSchema = SchemaFactory.createForClass(ApiInfo);
