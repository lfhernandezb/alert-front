export class Agent {
    name?: string;
    id?:   string;
    ip?:   string;
    os?:   string;
    status?: string;
    version?: string;
    lastKeepAlive?: string;
    lastAgentConfig?: string;
    lastWazuhConfig?: string;
    lastCollectorConfig?: string;
    lastBeat?: string;
    manager?: string;
    cluster?: string;
}