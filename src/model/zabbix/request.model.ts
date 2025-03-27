export class Params {
    output?:                string | string[];
    selectAcknowledges?:    string;
    selectTags?:            string;
    selectSuppressionData?: string;
    recent?:                string;
    sortfield?:             string[];
    sortorder?:             string;
    eventids?:              string;
    triggerids?:            string[];
    acknowledged?:          string;
}

export class PollRequest {
    jsonrpc?: string;
    method?:  string;
    params?:  Params;
    id?:      number;
}