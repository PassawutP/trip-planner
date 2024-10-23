
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { Record, RecordSchema } from 'src/record/schemas/record.schema';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: User.name,
        schema: UserSchema
      },
      {
        name: Record.name,
        schema: RecordSchema
      }
    ])
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
