const severytyValues: Record<string, string> = {
    "0": "not classified",
    "1": "information",
    "2": "warning",
    "3": "average",
    "4": "high",
    "5": "disaster",
};

export class Alert {
    id?: string;
    description?: string;
    hostName?: string;
    severity?: string;
    clock?: string;
    acknowledged?: string;
    userid?: string;
}	