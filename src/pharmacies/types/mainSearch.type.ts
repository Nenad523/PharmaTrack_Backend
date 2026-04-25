export type AvailabilitySource = 'exception' | 'duty' | 'working_hours' | null;

export type SearchDose = {
    doseId: number;
    strength: string;
    lastUpdated?: string;
}

export type MainSearch = {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    distance?: number | null;
    isOpenNow: boolean;
    isOnDuty: boolean;
    openUntil: string | null;
    availabilitySource: AvailabilitySource;
    doses: SearchDose[];
}

export type PharmacySearchRow = {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    distance?: number | null;
}

export type PharmacyAvailabilityRow = {
    pharmacyId: number;
    dutyEnd: string | null;
    hasClosedExceptionToday: boolean;
    activeExceptionClose: string | null;
    workingHoursClose: string | null;
}

export type PharmacyDoseRow = {
    pharmacyId: number;
    doseId: number;
    strength: string;
    lastUpdated?: string;
}
