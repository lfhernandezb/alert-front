// To parse this data:
//
//   import { Convert, Request } from "./file";
//
//   const request = Convert.toRequest(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
/*
export class Request {
    private query: Query;

    constructor() {
        this.query = new Query();
    }

    public getQuery(): Query {
        return this.query;
    }

    public setQuery(query: Query): void {
        this.query = query;
    }

}

export class Query {
    private bool: Bool;

    constructor() {
        this.bool = new Bool();
    }

    public getBool(): Bool {
        return this.bool;
    }

    public setBool(bool: Bool): void {
        this.bool = bool;
    }
}

export class Bool {
    private must: Must[];

    constructor() {
        this.must = [];
    }

    public getMust(): Must[] {
        return this.must;
    }

    public setMust(must: Must[]): void {
        this.must = must;
    }
}

export class Must {
    private match: Match;

    constructor() {
        this.match = new Match();
    }

    public getMatch(): Match {
        return this.match;
    }

    public setMatch(match: Match): void {
        this.match = match;
    }
}

export class Match {
    private id: string;

    constructor() {
        this.id = "";
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }
}
*/

// To parse this data:
//
//   import { Convert, Request } from "./file";
//
//   const request = Convert.toRequest(json);

export interface Request {
    query?: Query;
}

export interface Query {
    bool?: Bool;
}

export interface Bool {
    must?: Must[];
}

export interface Must {
    match?: Match;
}

export interface Match {
    id?: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toRequest(json: string): Request {
        return JSON.parse(json);
    }

    public static requestToJson(value: Request): string {
        return JSON.stringify(value);
    }
}
