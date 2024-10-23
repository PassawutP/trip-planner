
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, HydratedDocument, Types } from 'mongoose';
import { ConfirmTripPlanDto } from 'src/prompt/dto/generatedPrompt.dto';
import { User } from 'src/users/schemas/users.schema';

export type CatDocument = HydratedDocument<Record>;

@Schema()
export class Record extends Document{
  @Prop()
  title: string;

  @Prop()
  region: string;

  @Prop()
  budget: number;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ default: null })
  preference: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop()
  prompt: ConfirmTripPlanDto;
}

export const RecordSchema = SchemaFactory.createForClass(Record);