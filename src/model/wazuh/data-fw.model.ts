import { Expose } from "class-transformer";

export class DataFw {
    date?:              Date;
    @Expose({ name: 'dst_country_code' })
    dstCountryCode?:    string;
    timezone?:          string;
    @Expose({ name: 'ips_policy_id' })
    ipsPolicyId?:       string;
    @Expose({ name: 'dst_ip' })
    dstIP?:             string;
    @Expose({ name: 'sent_bytes' })
    sentBytes?:         string;
    duration?:          string;
    @Expose({ name: 'src_ip' })
    srcIP?:             string;
    protocol?:          string;
    @Expose({ name: 'device_name' })
    deviceName?:        string;
    @Expose({ name: 'log_type' })
    logType?:           string;
    @Expose({ name: 'application_risk' })
    applicationRisk?:   string;
    @Expose({ name: 'src_country_code' })
    srcCountryCode?:    string;
    @Expose({ name: 'tran_dst_port' })
    tranDstPort?:       string;
    @Expose({ name: 'recv_pkts' })
    recvPkts?:          string;
    @Expose({ name: 'appfilter_policy_id' })
    appfilterPolicyId?: string;
    @Expose({ name: 'fw_rule_id' })
    fwRuleId?:          string;
    @Expose({ name: 'log_id' })
    logId?:             string;
    @Expose({ name: 'sophos_fw_status_msg' })
    sophosFwStatusMsg?: string;
    @Expose({ name: 'sent_pkts' })
    sentPkts?:          string;
    @Expose({ name: 'log_component' })
    logComponent?:      string;
    appresolvedby?:     string;
    @Expose({ name: 'device_id' })
    deviceId?:          string;
    @Expose({ name: 'hb_health' })
    hbHealth?:          string;
    @Expose({ name: 'log_subtype' })
    logSubtype?:        string;
    message?:           string;
    priority?:          string;
    @Expose({ name: 'src_port' })
    srcPort?:           string;
    @Expose({ name: 'policy_type' })
    policyType?:        string;
    @Expose({ name: 'tran_src_port' })
    tranSrcPort?:       string;
    @Expose({ name: 'recv_bytes' })
    recvBytes?:         string;
    th?:                string;
    @Expose({ name: 'dst_port' })
    dstPort?:           string;
    name?:              string;
    time?:              string;
    device?:            string;
}