import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { TripPlanDto } from './dto/generatedPrompt.dto';


@Injectable()
export class PromptService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log(process.env.GEMINI_API_KEY);
    this.genAI = new GoogleGenerativeAI(apiKey);

    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  // Generate New Trip Plan
  async generateTripPlan(userInput: MessageDto): Promise<any> {
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    };
    const chatSession = this.model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate a trip plan with these factors included: This trip is in the region of Kyoto, the budget is 20,000 Baht, the trip start when the airplane lands at 2023-12-18T6:00:00 and 2023-12-18T6:00:00 is the airplane takeoff (Necessary to get to the airplane on time), there 4 people traveling in this trip and the trip want to focus on the activities which involve photography and culture. Output the trip plan in this JSON format for each activity with its locations and multiple hotels which are optimised for the factors mentioned.\n{\nlocations:\n{\nlocation: string;\ndetail: string;\nsequence: number;\ndateNo: number;\nstartDateTime: Date;\nendDateTime: Date;\nlatitude: Float;\nlongitude: Float;\nentryCost: string;\ntimeTravelToNextLocation: string\n},\nhotels:\n{\nhotelName: string;\nhotelAddress: string;\nprice: number;\nimageUrl: string;\nlatitude: Float;\nlongitude: Float;\nrating: number;\ndescription: string;\n},\n}"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\"locations\": [{\"location\": \"Kyoto Station\", \"detail\": \"Arrive at Kyoto Station. Take a taxi to your hotel.\", \"sequence\": 1, \"dateNo\": 1, \"startDateTime\": \"2023-12-18T06:00:00\", \"endDateTime\": \"2023-12-18T07:00:00\", \"latitude\": 34.9851, \"longitude\": 135.7596, \"entryCost\": \"Free\", \"timeTravelToNextLocation\": \"15 minutes\"}, {\"location\": \"Fushimi Inari Shrine\", \"detail\": \"Explore the iconic thousand red torii gates of Fushimi Inari Shrine, capturing stunning photos of its mystical atmosphere.\", \"sequence\": 2, \"dateNo\": 1, \"startDateTime\": \"2023-12-18T07:15:00\", \"endDateTime\": \"2023-12-18T12:00:00\", \"latitude\": 34.9671, \"longitude\": 135.7687, \"entryCost\": \"Free\", \"timeTravelToNextLocation\": \"45 minutes\"}, {\"location\": \"Gion District\", \"detail\": \"Stroll through the traditional Gion District, known for its geisha houses and wooden architecture. Capture the essence of Kyoto with your camera.\", \"sequence\": 3, \"dateNo\": 1, \"startDateTime\": \"2023-12-18T12:45:00\", \"endDateTime\": \"2023-12-18T16:00:00\", \"latitude\": 34.9747, \"longitude\": 135.7684, \"entryCost\": \"Free\", \"timeTravelToNextLocation\": \"15 minutes\"}, {\"location\": \"Kiyomizu-dera Temple\", \"detail\": \"Visit the UNESCO World Heritage Kiyomizu-dera Temple, renowned for its stunning wooden architecture and panoramic views. Capture the beauty of its intricate details.\", \"sequence\": 4, \"dateNo\": 1, \"startDateTime\": \"2023-12-18T16:15:00\", \"endDateTime\": \"2023-12-18T19:00:00\", \"latitude\": 34.9793, \"longitude\": 135.7726, \"entryCost\": \"400 Yen\", \"timeTravelToNextLocation\": \"30 minutes\"}, {\"location\": \"Arashiyama Bamboo Grove\", \"detail\": \"Wander through the serene Arashiyama Bamboo Grove, capturing ethereal photos of the towering bamboo stalks. Enjoy the tranquility of this natural wonder.\", \"sequence\": 5, \"dateNo\": 2, \"startDateTime\": \"2023-12-19T09:00:00\", \"endDateTime\": \"2023-12-19T12:00:00\", \"latitude\": 35.0324, \"longitude\": 135.6772, \"entryCost\": \"Free\", \"timeTravelToNextLocation\": \"15 minutes\"}, {\"location\": \"Toji Temple\", \"detail\": \"Explore the impressive Toji Temple, a UNESCO World Heritage site featuring a towering five-story pagoda. Capture its grandeur from different angles.\", \"sequence\": 6, \"dateNo\": 2, \"startDateTime\": \"2023-12-19T12:15:00\", \"endDateTime\": \"2023-12-19T15:00:00\", \"latitude\": 34.9561, \"longitude\": 135.7614, \"entryCost\": \"Free\", \"timeTravelToNextLocation\": \"30 minutes\"}, {\"location\": \"Nijo Castle\", \"detail\": \"Visit Nijo Castle, a magnificent example of Edo-era architecture. Capture the intricate details of its gardens and buildings.\", \"sequence\": 7, \"dateNo\": 2, \"startDateTime\": \"2023-12-19T15:30:00\", \"endDateTime\": \"2023-12-19T18:00:00\", \"latitude\": 35.0134, \"longitude\": 135.7553, \"entryCost\": \"600 Yen\", \"timeTravelToNextLocation\": \"0 minutes\"}], \"hotels\": [{\"hotelName\": \"The Ritz-Carlton, Kyoto\", \"hotelAddress\": \"100-1, Kamitoba-cho, Nishikyo-ku, Kyoto, Japan\", \"price\": 400, \"imageUrl\": \"https://www.ritzcarlton.com/en/hotels/japan/kyoto/images/hotel-gallery/exterior-2.jpg\", \"latitude\": 35.0134, \"longitude\": 135.7553, \"rating\": 4.8, \"description\": \"Luxurious hotel offering stunning city views, fine dining, and impeccable service.\"}, {\"hotelName\": \"Four Seasons Hotel Kyoto\", \"hotelAddress\": \"Higashiyama Ward, Kyoto, Japan\", \"price\": 350, \"imageUrl\": \"https://www.fourseasons.com/kyoto/images/gallery/hotel/exterior_views/four-seasons-hotel-kyoto-exterior-3.jpg\", \"latitude\": 34.9747, \"longitude\": 135.7684, \"rating\": 4.7, \"description\": \"Elegant hotel with a tranquil atmosphere, featuring traditional Japanese gardens and exceptional dining options.\"}, {\"hotelName\": \"Park Hyatt Kyoto\", \"hotelAddress\": \"394 Kamitoba-cho, Nishikyo-ku, Kyoto, Japan\", \"price\": 300, \"imageUrl\": \"https://www.hyatt.com/en-US/hotel/japan/kyoto/park-hyatt-kyoto/photos\", \"latitude\": 35.0134, \"longitude\": 135.7553, \"rating\": 4.6, \"description\": \"Modern hotel with panoramic city views, comfortable accommodations, and a rooftop bar.\"}, {\"hotelName\": \"Kyoto Mandarin Oriental\", \"hotelAddress\": \"946-1, Sanjo-dori, Kawaramachi, Nakagyo-ku, Kyoto, Japan\", \"price\": 250, \"imageUrl\": \"https://www.mandarinoriental.com/kyoto/luxury-hotel-kyoto/en/gallery/hotel-exterior\", \"latitude\": 34.9851, \"longitude\": 135.7596, \"rating\": 4.5, \"description\": \"Sophisticated hotel with a prime location, offering elegant rooms, dining options, and a spa.\"}]}\n\n```"},
          ],
        },
      ],
    });
    const GENERATIVE_PROMPT = "Generate a trip plan with these factors included: This trip is in the region of {region}, the budget is {budget} Baht, the trip start when the airplane lands at {startDate} and {endDate} is the airplane takeoff (Necessary to get to the airplane on time), there {peopleNo} people traveling in this trip and the trip want to focus on the activities which involve {preferences}. Output the trip plan in this JSON format for each activity with its locations and hotels according to each region which are optimise for the factors mentioned.{locations:{location: string;detail: string;sequence: number;dateNo: number;startDateTime: Date;endDateTime: Date;latitude: Float;longtitude: Float;entryCost: string;timeTravelToNextLocation: string},hotels:{hotelName: string;hotelAddress: string;price: number;imageUrl: string;latitude: Float;longtitude: Float;rating: number;description: string;},}"
    let userPreferences;
    if (userInput.preferences){
      if (userInput.preferences.length == 1){
        userPreferences = userInput.preferences
      }
      else{
        userPreferences = userInput.preferences.join(" AND ");
      }
    }
    else{
      userPreferences = "No User Preference";
    }
    const FINAL_GENERATIVE_PROMPT = GENERATIVE_PROMPT
    .replace('{region}', userInput.region)
    .replace('{budget}', userInput.budget)
    .replace('{startDate}', userInput.tripStart)
    .replace('{endDate}', userInput.tripEnd)
    .replace('{peopleNo}', userInput.peopleNo)
    .replace('{preferences}', userPreferences);

    const result = await chatSession.sendMessage(FINAL_GENERATIVE_PROMPT);
    try {
      const tripPlanData = JSON.parse(result.response.text());

      const tripPlan: TripPlanDto = new TripPlanDto();
      tripPlan.locations = tripPlanData.locations;
      tripPlan.hotels = tripPlanData.hotels;
  
      return tripPlan;
    } catch (error) {
      console.error('Failed to parse response:', error);
      throw new Error('Unable to generate trip plan');
    }
  }
  


    // Remake Prompt


    // Submit Prompt

    
}
