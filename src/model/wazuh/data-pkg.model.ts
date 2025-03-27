import { Expose } from "class-transformer";

export class DataPkg {
    @Expose({ name: 'dpkg_status' })
    dpkgStatus?: string;
    package?:     string;
    arch?:        string;
    version?:     string;

}