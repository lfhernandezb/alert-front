// To parse this data:
//
//   import { Convert, DataOffice365 } from "./file";
//
//   const dataOffice365 = Convert.toDataOffice365(json);

import { Expose, Type } from "class-transformer";

export class FileData {
    // @Expose({ name: 'FilePath' })
    filePath?:      string;
    // @Expose({ name: 'SHA256' })
    sha256?:        string;
    // @Expose({ name: 'FileName' })
    fileName?:      string;
    // @Expose({ name: 'MalwareFamily' })
    malwareFamily?: string;
    // @Expose({ name: 'DocumentId' })
    documentId?:    string;
    // @Expose({ name: 'FileVerdict' })
    fileVerdict?:   string;
    // @Expose({ name: 'FileSize' })
    fileSize?:      string;
}

// de rule-id 91700
export class AppAccessContext {
    ClientAppId?:   string;
    ClientAppName?: string;
    CorrelationId?: string;
}

export class Office365 {
    // @Expose({ name: 'LastModifiedBy' })
    lastModifiedBy?:   string;
    // @Expose({ name: 'LastModifiedDate' })
    lastModifiedDate?: Date;
    // @Expose({ name: 'DetectionMethod' })
    detectionMethod?:  string;
    // @Expose({ name: 'UserKey' })
    userKey?:          string;
    // @Expose({ name: 'Operation' })
    operation?:        string;
    // @Expose({ name: 'OrganizationId' })
    organizationId?:   string;
    // @Expose({ name: 'EventDeepLink' })
    eventDeepLink?:    string;
    // @Expose({ name: 'SourceWorkload' })
    sourceWorkload?:   string;
    // @Expose({ name: 'Workload' })
    workload?:         string;
    // @Expose({ name: 'RecordType' })
    recordType?:       string;
    // @Expose({ name: 'Version' })
    version?:          string;
    // @Expose({ name: 'UserId' })
    userId?:           string;
    // @Expose({ name: 'DetectionDate' })
    detectionDate?:    Date;
    // @Expose({ name: 'CreationTime' })
    creationTime?:     Date;
    // @Expose({ name: 'Id' })
    id?:               string;
    // @Expose({ name: 'Subscription' })
    subscription?:     string;
    // @Expose({ name: 'UserType' })
    userType?:         string;
    @Type(() => FileData)
    // @Expose({ name: 'FileData' })
    fileData?:         FileData;

    // de rule.id 91700
    Site?:                        string;
    ListBaseType?:                string;
    VirusVendor?:                 string;
    Platform?:                    string;
    UserKey?:                     string;
    ItemType?:                    string;
    IsManagedDevice?:             string;
    DeviceDisplayName?:           string;
    Operation?:                   string;
    OrganizationId?:              string;
    RecordType?:                  string;
    ListId?:                      string;
    Version?:                     string;
    WebId?:                       string;
    VirusInfo?:                   string;
    UserAgent?:                   string;
    CorrelationId?:               string;
    Subscription?:                string;
    ListItemUniqueId?:            string;
    AuthenticationType?:          string;
    EventSignature?:              string;
    SourceFileName?:              string;
    ApplicationDisplayName?:      string;
    ObjectId?:                    string;
    SiteUrl?:                     string;
    @Type(() => AppAccessContext)
    AppAccessContext?:            AppAccessContext;
    ClientIP?:                    string;
    ListServerTemplate?:          string;
    SourceFileExtension?:         string;
    Workload?:                    string;
    SourceRelativeUrl?:           string;
    EventSource?:                 string;
    HighPriorityMediaProcessing?: string;
    UserId?:                      string;
    CreationTime?:                Date;
    Id?:                          string;
    GeoLocation?:                 string;
    ApplicationId?:               string;
    UserType?:                    string;

}

export class DataOffice365 {
    integration?: string;
    @Type(() => Office365)
    office365?:   Office365;
}
