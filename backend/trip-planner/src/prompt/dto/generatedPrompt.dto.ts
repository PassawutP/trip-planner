// trip-plan.dto.ts
import { IsArray, IsDate, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

class LocationDto {
  @IsString()
  location: string;

  @IsString()
  detail: string;

  @IsNumber()
  sequence: number;

  @IsNumber()
  dateNo: number;

  @IsDate()
  startDateTime: Date;

  @IsDate()
  endDateTime: Date;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  entryCost: string;

  @IsString()
  timeTravelToNextLocation: string;
}

class HotelDto {
  @IsString()
  hotelName: string;

  @IsString()
  hotelAddress: string;

  @IsNumber()
  price: number;

  @IsString()
  imageUrl: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  rating: number;

  @IsString()
  description: string;
}

export class TripPlanDto {
  @IsArray()
  locations: LocationDto[];

  @IsArray()
  hotels: HotelDto[];
}

export class ConfirmTripPlanDto{

    locations: LocationDto[];

    hotel?: HotelDto; 
}
