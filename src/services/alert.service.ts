import { Alert } from "../model/alert.model";

export function getAlerts(): Alert[] {
    return [
        {
            id: 1,
            description: "PostgreSQL not available",
            severity: "High",
            affectedEntityIp: "ubuntutest",
            timestamp: new Date()
        },
        {
            id: 2,
            description: "Office 365: Quarantine events.",
            severity: "Warning",
            affectedEntityIp: "nbk-lhernandez",
            timestamp: new Date()
        },
        {
            id: 3,
            description: "A user account was locked out.",
            severity: "Warning",
            affectedEntityIp: "nbk-jdoe",
            timestamp: new Date()
        },
    ];
}