// import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { Expose, Type } from "class-transformer";
import { Source } from "./source.model";

// @JsonObject()
export class Hit {
    // @Expose({ name: "_index" })
    index?:  string;
    // @Expose({ name: "_id" })
    id?:     string;
    // @Expose({ name: "_score" })
    score?:  number;
    // @Expose({ name: "_source" })
    @Type(() => Source)
    source?: Source;
}