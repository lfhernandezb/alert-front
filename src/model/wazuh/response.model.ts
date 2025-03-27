// To parse this data:
//
//   import { Convert, Response } from "./file";
//
//   const response = Convert.toResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
import { Expose, Transform, Exclude, Type } from 'class-transformer';
// import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { Shards } from "./shards.model";
import { Hits } from "./hits.model";

// @JsonObject()
export class Response {
    // @JsonProperty({ name: "took" })
    took?:     number;
    // @JsonProperty({ name: "timed_out" })
    @Expose({ name: "timed_out" })
    timedOut?: boolean;
    // @JsonProperty({ name: "_shards", type: Shards })
    @Expose({ name: "_shards" })
    shards?:   Shards;
    // @JsonProperty({ name: "hits" })
    @Type(() => Hits)
    hits?:     Hits;
}
/*
// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toResponse(json: string): Response {
        return cast(JSON.parse(json), r("Response"));
    }

    public static responseToJson(value: Response): string {
        return JSON.stringify(uncast(value, r("Response")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Response": o([
        { json: "took", js: "took", typ: 0 },
        { json: "timed_out", js: "timedOut", typ: true },
        { json: "_shards", js: "shards", typ: r("Shards") },
        { json: "hits", js: "hits", typ: r("Hits") },
    ], false),
    "Hits": o([
        { json: "total", js: "total", typ: r("Total") },
        { json: "max_score", js: "maxScore", typ: 3.14 },
        { json: "hits", js: "hits", typ: a(r("Hit")) },
    ], false),
    "Hit": o([
        { json: "_index", js: "index", typ: "" },
        { json: "_id", js: "id", typ: "" },
        { json: "_score", js: "score", typ: 3.14 },
        { json: "_source", js: "source", typ: r("Source") },
    ], false),
    "Source": o([
        { json: "agent", js: "agent", typ: r("Agent") },
        { json: "manager", js: "manager", typ: r("Decoder") },
        { json: "data", js: "data", typ: r("string") },
        { json: "rule", js: "rule", typ: r("Rule") },
        { json: "decoder", js: "decoder", typ: r("Decoder") },
        { json: "full_log", js: "fullLog", typ: "" },
        { json: "input", js: "input", typ: r("Input") },
        { json: "@timestamp", js: "timestamp", typ: Date },
        { json: "location", js: "location", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "timestamp", js: "sourceTimestamp", typ: "" },
    ], false),
    "Agent": o([
        { json: "name", js: "name", typ: "" },
        { json: "id", js: "id", typ: "" },
    ], false),
    "Data": o([
        { json: "date", js: "date", typ: Date },
        { json: "dst_country_code", js: "dstCountryCode", typ: "" },
        { json: "timezone", js: "timezone", typ: "" },
        { json: "in_interface", js: "inInterface", typ: "" },
        { json: "ips_policy_id", js: "ipsPolicyID", typ: "" },
        { json: "dst_ip", js: "dstIP", typ: "" },
        { json: "sent_bytes", js: "sentBytes", typ: "" },
        { json: "srczonetype", js: "srczonetype", typ: "" },
        { json: "duration", js: "duration", typ: "" },
        { json: "src_ip", js: "srcIP", typ: "" },
        { json: "tran_src_ip", js: "tranSrcIP", typ: "" },
        { json: "protocol", js: "protocol", typ: "" },
        { json: "device_name", js: "deviceName", typ: "" },
        { json: "log_type", js: "logType", typ: "" },
        { json: "application_risk", js: "applicationRisk", typ: "" },
        { json: "src_country_code", js: "srcCountryCode", typ: "" },
        { json: "tran_dst_port", js: "tranDstPort", typ: "" },
        { json: "recv_pkts", js: "recvPkts", typ: "" },
        { json: "dstzonetype", js: "dstzonetype", typ: "" },
        { json: "appfilter_policy_id", js: "appfilterPolicyID", typ: "" },
        { json: "iap", js: "iap", typ: "" },
        { json: "out_interface", js: "outInterface", typ: "" },
        { json: "fw_rule_id", js: "fwRuleID", typ: "" },
        { json: "log_id", js: "logID", typ: "" },
        { json: "src_mac", js: "srcMAC", typ: "" },
        { json: "sophos_fw_status_msg", js: "sophosFwStatusMsg", typ: "" },
        { json: "sent_pkts", js: "sentPkts", typ: "" },
        { json: "log_component", js: "logComponent", typ: "" },
        { json: "appresolvedby", js: "appresolvedby", typ: "" },
        { json: "device_id", js: "deviceID", typ: "" },
        { json: "hb_health", js: "hbHealth", typ: "" },
        { json: "log_subtype", js: "logSubtype", typ: "" },
        { json: "connevent", js: "connevent", typ: "" },
        { json: "priority", js: "priority", typ: "" },
        { json: "src_port", js: "srcPort", typ: "" },
        { json: "srczone", js: "srczone", typ: "" },
        { json: "policy_type", js: "policyType", typ: "" },
        { json: "tran_src_port", js: "tranSrcPort", typ: "" },
        { json: "recv_bytes", js: "recvBytes", typ: "" },
        { json: "th", js: "th", typ: "" },
        { json: "connid", js: "connid", typ: "" },
        { json: "dst_port", js: "dstPort", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "dstzone", js: "dstzone", typ: "" },
        { json: "time", js: "time", typ: "" },
        { json: "device", js: "device", typ: "" },
    ], false),
    "Win": o([
        { json: "eventdata", js: "eventdata", typ: r("Eventdata") },
        { json: "system", js: "system", typ: r("System") },
    ], false),
    "Eventdata": o([
        { json: "subjectLogonId", js: "subjectLogonID", typ: "" },
        { json: "targetUserName", js: "targetUserName", typ: "" },
        { json: "subjectUserSid", js: "subjectUserSid", typ: "" },
        { json: "subjectDomainName", js: "subjectDomainName", typ: "" },
        { json: "targetSid", js: "targetSid", typ: "" },
        { json: "subjectUserName", js: "subjectUserName", typ: "" },
    ], false),
    "System": o([
        { json: "eventID", js: "eventID", typ: "" },
        { json: "keywords", js: "keywords", typ: "" },
        { json: "providerGuid", js: "providerGUID", typ: "" },
        { json: "level", js: "level", typ: "" },
        { json: "channel", js: "channel", typ: "" },
        { json: "opcode", js: "opcode", typ: "" },
        { json: "message", js: "message", typ: "" },
        { json: "version", js: "version", typ: "" },
        { json: "systemTime", js: "systemTime", typ: Date },
        { json: "eventRecordID", js: "eventRecordID", typ: "" },
        { json: "threadID", js: "threadID", typ: "" },
        { json: "computer", js: "computer", typ: "" },
        { json: "task", js: "task", typ: "" },
        { json: "processID", js: "processID", typ: "" },
        { json: "severityValue", js: "severityValue", typ: "" },
        { json: "providerName", js: "providerName", typ: "" },
    ], false),
    "Decoder": o([
        { json: "name", js: "name", typ: "" },
    ], false),
    "Input": o([
        { json: "type", js: "type", typ: "" },
    ], false),
    "Rule": o([
        { json: "firedtimes", js: "firedtimes", typ: 0 },
        { json: "mail", js: "mail", typ: true },
        { json: "level", js: "level", typ: 0 },
        { json: "description", js: "description", typ: "" },
        { json: "groups", js: "groups", typ: a("") },
        { json: "id", js: "id", typ: "" },
    ], false),
    "Total": o([
        { json: "value", js: "value", typ: 0 },
        { json: "relation", js: "relation", typ: "" },
    ], false),
    "Shards": o([
        { json: "total", js: "total", typ: 0 },
        { json: "successful", js: "successful", typ: 0 },
        { json: "skipped", js: "skipped", typ: 0 },
        { json: "failed", js: "failed", typ: 0 },
    ], false),
};
*/
