import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Record, RecordSchema } from './schemas/record.schema';
import { User, UserSchema } from 'src/users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Record.name,
        schema: RecordSchema
      },
      { 
        name: User.name,
        schema: UserSchema
      },
    ])
  ],
  controllers: [RecordController],
  providers: [RecordService]
})
export class RecordModule {}
