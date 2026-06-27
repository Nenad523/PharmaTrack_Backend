export type AvailabilitySource = 'exception' | 'duty' | 'working_hours' | null;

export type SearchDose = {
    doseId: number;
    strength: string;
    lastUpdated?: string;
    is_refundable: boolean;
};

export type MainSearch = {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
    is_state: boolean;
    distance?: number | null;
    isOpenNow: boolean;
    isOnDuty: boolean;
    openUntil: string | null;
    availabilitySource: AvailabilitySource;
    doses: SearchDose[];
};

export type PharmacySearchRow = {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
    is_state: boolean;
    distance?: number | null;
};

export type PharmacyAvailabilityRow = {
    pharmacyId: number;
    dutyEnd: string | null;
    hasClosedExceptionToday: boolean;
    activeExceptionClose: string | null;
    workingHoursClose: string | null;
    isOpenAllDay: boolean;
};

export type PharmacyDetailRow = {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
    is_state: boolean;
    img_url: string | null;
    dutyStart: string | null;
    dutyEnd: string | null;
};

export type PharmacyDoseRow = {
    pharmacyId: number;
    doseId: number;
    strength: string;
    lastUpdated?: string;
    is_refundable: boolean;
};
