import { Body, Controller, Post } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { ConfirmTripPlanDto } from './dto/generatedPrompt.dto';
import { MessageDto } from './dto/message.dto';

@Controller('prompt')
export class PromptController {
    constructor(private readonly promptService: PromptService) {}

    @Post('generate')
    async sendPrompt(@Body() messageDto: MessageDto): Promise<any>{
        return this.promptService.generateTripPlan(messageDto);
    }

    // Remake Prompt


    // Submit Prompt
    @Post('save')
    async savePrompt(@Body() confirmTripPlanDto: ConfirmTripPlanDto){
        return ;
    }
}

