// import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { Expose, Type } from "class-transformer";
import { Hit } from "./hit.model";
import { Total } from "./total.model";

// @JsonObject()
export class Hits {
    total?:    Total;
    // @Expose({ name: "max_score" })
    maxScore?: number;
    @Type(() => Hit)
    hits?:     Hit[];
}
