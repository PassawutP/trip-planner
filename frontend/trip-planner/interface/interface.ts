export default interface Records {
    _id: string,
    title: string,
    region: string,
    startDate: string,
    endDate: string,
    preference: string[] | null,
    user: string,
    prompt: Location[]
}

export default interface Location {
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

export default interface MessageDto {
    region: string;
    budget: string;
    tripStart: string;
    tripEnd: string;
    peopleNo: string;
    preferences: string[] | null;
}
