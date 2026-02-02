import { Location } from './location.model';
import { IncidentType } from './enums/incident-type.enum';
import { IncidentSubtype } from './enums/incident-subtype.enum';
import { IncidentStatus } from './enums/incident-status.enum';

export interface Incident {
  id?: number;
  type: IncidentType;
  subtype?: IncidentSubtype;
  status?: IncidentStatus;
  description: string;
  descriptionEn?: string; 
  location: Location;
  imagePath?: string;
  createdAt?: string; 
}