export type Advertisement =
    'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'STARTUP';

export class Link {
    companyId: String;
    edition: String;
    created: Date;
    token: String;
    valid: boolean;
    advertisementKind: Advertisement;
    participationDays: number;
}
