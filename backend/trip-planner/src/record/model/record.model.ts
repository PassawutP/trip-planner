import { ConfirmTripPlanDto } from "src/prompt/dto/generatedPrompt.dto";

export class RecordDto{
    title: string;
  
    region: string;
  
    budget: number;
  
    startDate: Date;
  
    endDate: Date;
  
    preference: string[]| null;

    prompt: ConfirmTripPlanDto;
}