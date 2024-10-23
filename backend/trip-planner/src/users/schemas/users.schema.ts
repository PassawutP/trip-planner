import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Record } from "src/record/schemas/record.schema";


@Schema()
export class User{

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    username: string;

    @Prop({ default: null })
    avatarUrl?: string;

    @Prop({ default: 5 })
    quota: number;

    @Prop({ default: null })
    preferences: String[];

    // Record
    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Record'})
    // records?: Record[];
}

export const UserSchema = SchemaFactory.createForClass(User);