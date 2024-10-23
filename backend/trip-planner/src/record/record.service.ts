import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Record } from './schemas/record.schema';
import mongoose, { Model, Types } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import { RecordDto } from './model/record.model';
import { ConfirmTripPlanDto } from 'src/prompt/dto/generatedPrompt.dto';

@Injectable()
export class RecordService {

    constructor(@InjectModel(Record.name) private recordModel: Model<Record>,
                @InjectModel(User.name) private userModel: Model<User>){}

    // Get
    async getAllRecord(userId: string) : Promise<Record[]>{
      const userObjectId = new Types.ObjectId(userId);
      return this.recordModel.find({user : userObjectId}).exec();
    }
    // Post
    async postRecord(userId: string, recordDto: RecordDto): Promise<Record> {
        const user = await this.userModel.findById(userId);
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        const createdRecord = new this.recordModel({
          ...recordDto,
          user: user._id,
        });
      
        return createdRecord.save();
      }
    // Delete
    async deleteRecord(recordId: string): Promise<void>{
        const record = await this.recordModel.findById(recordId);
        if (!record) {
            throw new NotFoundException('Record not found');
        }

        const recordObjectId = new Types.ObjectId(recordId);
        await this.recordModel.deleteOne({ _id: recordObjectId });
    }
}
