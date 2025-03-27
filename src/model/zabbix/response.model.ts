import { Expose, Type } from "class-transformer";

export class TagElement {
    tag?:   string;
    value?: string;
}

export class URL {
    url?:  string;
    name?: string;
}

export class Result {
    eventid?:          string;
    source?:           string;
    object?:           string;
    objectid?:         string;
    clock?:            string;
    ns?:               string;
    r_eventid?:        string;
    r_clock?:          string;
    r_ns?:             string;
    correlationid?:    string;
    userid?:           string;
    name?:             string;
    acknowledged?:     string;
    severity?:         string;
    cause_eventid?:    string;
    opdata?:           string;
    acknowledges?:     any[];
    suppression_data?: any[];
    suppressed?:       string;
    @Type(() => URL)
    urls?:             URL[];
    @Type(() => TagElement)
    tags?:             TagElement[];

    // host
    hostid?:           string;
}

export class PollResponse {
    jsonrpc?: string;
    @Type(() => Result)
    result?:  Result[];
    id?:      number;
}