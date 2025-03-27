import { Type } from "class-transformer";
import { Win } from "./win.model";

export class DataWin {
    @Type(() => Win)
    win?: Win;
}