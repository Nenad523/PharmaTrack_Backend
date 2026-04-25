export type SearchDose = {
    doseId: number;
    strength: string;
    quantity: number;
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

export type PharmacyDoseRow = {
    pharmacyId: number;
    doseId: number;
    strength: string;
    quantity: number;
    lastUpdated?: string;
}
