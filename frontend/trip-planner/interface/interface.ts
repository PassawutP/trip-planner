// Old version

export interface Records {
    _id: string,
    title: string,
    region: string,
    startDate: string,
    endDate: string,
    preference: string[] | null,
    user: string,
    prompt: Location[]
}

export interface Location {
    location: string,
    detail: string,
    sequence: number,
    dateNo: number,
    startDateTime: string,
    endDateTime: string,
    latitude: number,
    longtitude: number,
    entryCost: string,
    timeTravelToNextLocation: string
}

// New Version

export interface MessageDto {
    region: string;
    budget: string;
    tripStart: string;
    tripEnd: string;
    peopleNo: string;
    preferences: string[] | null;
}

export interface JwtPayload {
    sub: string;
    name: string;
    username: string;
    email: string;
    iat: number;
    exp: number;
}

export interface TripPlanDtoWithDetails{
    details: MessageDto;

    locations: LocationDto[];

    hotels: HotelDto[];
}

export interface TripPlanDto {
    locations: LocationDto[];

    hotels: HotelDto[];
}

export interface ConfirmTripPlanDto{

    locations: LocationDto[];

    hotel: HotelDto | null; 
}


export interface LocationDto {
    location: string;

    detail: string;

    sequence: number;

    dateNo: number;

    startDateTime: Date;

    endDateTime: Date;

    latitude: number;

    longitude: number;

    entryCost: string;

    timeTravelToNextLocation: string;
}
  
export interface HotelDto {
    hotelName: string;

    hotelAddress: string;

    price: number;

    imageUrl: string;

    latitude: number;

    longitude: number;

    rating: number;

    description: string;
}

export interface RecordDto{

    title: string;
  
    region: string;
  
    budget: number;
  
    startDate: Date;
  
    endDate: Date;
  
    preference: string[]| null;

    prompt: ConfirmTripPlanDto;
}