import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RecordService } from './record.service';
import { Record } from './schemas/record.schema';
import { RecordDto } from './model/record.model';

@Controller('record')
export class RecordController {

    constructor (private readonly recordService: RecordService){}
    
    // Get
    @Get('/get/:id')
    async getRecord(@Param('id') id) : Promise<Record[]> {
        return this.recordService.getAllRecord(id);
    }
    // Post
    @Post('/post/:id')
    async postRecord(@Param('id') id, @Body() recordDto: RecordDto): Promise<Record>{
        return this.recordService.postRecord(id, recordDto);
    }

    // Delete
    @Delete('/delete/:id')
    async deleteRecord(@Param('id') id): Promise<void>{
        return this.recordService.deleteRecord(id);
    }
}
