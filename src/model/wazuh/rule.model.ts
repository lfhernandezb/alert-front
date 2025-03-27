import { Expose, Type } from "class-transformer";
import { Mitre } from "./mitre.model";

export class Rule {
    firedtimes?:  number;
    mail?:        boolean;
    level?:       number;
    description?: string;
    groups?:      string[];
    id?:          string;
    @Expose({ name: 'pci_dss' })
    pciDss?:     string[];
    tsc?:         string[];
    @Type(() => Mitre)
    mitre?:       Mitre;
    nist_800_53?: string[];
    gdpr?:        string[];
}
