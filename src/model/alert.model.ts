export interface Alert {
    id: number;
    severity: string;
    timestamp: Date;
    affectedEntityIp: string;
    description: string;
}