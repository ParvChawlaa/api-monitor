import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsObject, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<ApiLogs>;

@Schema()
export class ApiLogs {
  @Prop({ required: true })
  @IsString()
  apiId: string;

  @Prop({ type: Object, required: false })
  @IsObject()
  logs: Record<string, any>; /// Accepts a JSON object
}

export const ApiLogsSchema = SchemaFactory.createForClass(ApiLogs);
