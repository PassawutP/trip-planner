import { Body, Controller, Param, Post } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { ConfirmTripPlanDto, TripPlanDto } from './dto/generatedPrompt.dto';
import { MessageDto } from './dto/message.dto';
import { RecordService } from 'src/record/record.service';
import { RecordDto } from 'src/record/model/record.model';

@Controller('prompt')
export class PromptController {
    constructor(
        private readonly promptService: PromptService
    ) {}

    @Post('generate')
    async sendPrompt(@Body() messageDto: MessageDto): Promise<TripPlanDto>{
        return this.promptService.generateTripPlan(messageDto);
    }

    // Remake Prompt

}

