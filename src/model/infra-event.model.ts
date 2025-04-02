interface severity {
    id: number;
    name: string;
}

export const zabbixSeverities: severity[] = [
    { id: 0, name: 'Baja' },
    { id: 1, name: 'Baja' },
     { id: 2, name: 'Media' },
    { id: 3, name: 'Media' },
    { id: 4, name: 'Alta' },
    { id: 5, name: 'Crítica' },
  ]

export const wazuSeverities: severity[] = [
    { id: 0, name: 'Baja' },
    { id: 1, name: 'Baja' },
    { id: 2, name: 'Baja' },
    { id: 3, name: 'Baja' },
    { id: 4, name: 'Baja' },
    { id: 5, name: 'Baja' },
    { id: 6, name: 'Baja' },
    { id: 7, name: 'Media' },
    { id: 8, name: 'Media' },
    { id: 9, name: 'Media' },
    { id: 10, name: 'Media' },
    { id: 11, name: 'Media' },
    { id: 12, name: 'Alta' },
    { id: 13, name: 'Alta' },
    { id: 14, name: 'Alta' },
    { id: 15, name: 'Crítica' },
    { id: 16, name: 'Crítica' },
  ]

// Define the Equipment model
class Equipment {
  public id?: number;
  public name?: string;
  public type?: string;
  public ip?: string;
  public hostname?: string;
  public os?: string;
  public os_version?: string;
}

// Define the InfraEvent model
class InfraEvent {
  public id?: number;
  public origin?: string;
  public eventid?: string;
  public equipmentId?: number; // Foreign key
  public description?: string;
  public status?: string;
  public acknowledged?: boolean;
  public severity?: string;
  public timestamp?: Date;
  public detail?: string;
  public equipment?: Equipment; // Relationship with Equipment
}

export { InfraEvent, Equipment };