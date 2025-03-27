import { Type } from "class-transformer";
import { Eventdata } from "./eventdata.model";
import { System } from "./system.model";

export class Win {
    @Type(() => Eventdata)
    eventdata?: Eventdata;
    @Type(() => System)
    system?:    System;
}
