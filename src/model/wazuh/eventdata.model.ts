export class Eventdata {
    subjectLogonID?:    string;
    targetUserName?:    string;
    subjectUserSid?:    string;
    subjectDomainName?: string;
    targetSid?:         string;
    subjectUserName?:   string;

    // de rule.id 92650
    serviceType?: string;
    accountName?: string;
    imagePath?:   string;
    startType?:   string;
    serviceName?: string;

    // de rule.id 92657
    subjectLogonId?:            string;
    impersonationLevel?:        string;
    ipAddress?:                 string;
    authenticationPackageName?: string;
    workstationName?:           string;
    lmPackageName?:             string;
    targetLogonId?:             string;
    logonProcessName?:          string;
    logonGuid?:                 string;
    keyLength?:                 string;
    processId?:                 string;
    ipPort?:                    string;
    targetDomainName?:          string;
    targetUserSid?:             string;
    logonType?:                 string;


}