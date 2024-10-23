import { Module } from '@nestjs/common';
import { PromptController } from './prompt.controller';
import { PromptService } from './prompt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Record, RecordSchema } from 'src/record/schemas/record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Record.name,
        schema: RecordSchema
      }
    ])
  ],
  controllers: [PromptController],
  providers: [PromptService]
})
export class PromptModule {}
