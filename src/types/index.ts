export type UserRole =
  | 'incident_commander'
  | 'epidemiologist'
  | 'veterinary_officer'
  | 'environmental_officer'
  | 'researcher_observer';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  stateJurisdiction: string; // 'National' or specific Nigerian State
  facility: string;
  agency: string;
}

export type DiseaseCategory =
  | 'Viral Hemorrhagic Fever'
  | 'Respiratory Zoonosis'
  | 'Bacterial Zoonosis'
  | 'Arboviral Disease'
  | 'Parasitic / Protozoan'
  | 'Poxvirus';

export type LabConfirmationStatus = 'confirmed' | 'pending' | 'suspected' | 'inconclusive';

export type InvestigationStatus = 'triaged' | 'field_dispatched' | 'sample_in_transit' | 'sequenced' | 'closed';

export interface ZoonoticReport {
  id: string;
  diseaseCategory: DiseaseCategory;
  diseaseName: string;
  animalSpecies: string;
  animalCases: number;
  humanCases: number;
  humanDeaths: number;
  state: string;
  lga: string;
  locationDetails: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  labStatus: LabConfirmationStatus;
  labMethod: string; // 'RT-PCR', 'ELISA Serology', 'Illumina NextSeq', 'Rapid Antigen'
  reportingDate: string;
  onsetDate: string;
  investigationStatus: InvestigationStatus;
  source: 'Veterinary Clinic' | 'Hospital Sentinel' | 'Abattoir Surveillance' | 'Community Health Worker' | 'Wildlife Ranger';
  riskScore: number; // 1-100
  notes: string;
  reportedBy: string;
  reportedByEmail: string;
  createdAt: string;
  updatedAt: string;
}

export type EnvironmentalIndicatorType =
  | 'water_quality'
  | 'flooding'
  | 'sanitation'
  | 'waste_management'
  | 'contamination'
  | 'climatic';

export type SeverityLevel = 'nominal' | 'moderate' | 'elevated' | 'critical';

export interface EnvironmentalReport {
  id: string;
  indicatorType: EnvironmentalIndicatorType;
  state: string;
  lga: string;
  locationDetails: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  waterColiformCount?: number; // CFU/100mL (WHO safe: 0)
  waterTurbidity?: number; // NTU
  waterPh?: number;
  floodInundationLevel?: 'None' | 'Minor Stagnation' | 'Severe River Overflow' | 'Catastrophic Submersion';
  displacedCount?: number;
  stagnantWaterRisk?: 'Low' | 'Moderate' | 'High' | 'Critical';
  openDefecationRisk?: 'Low' | 'Moderate' | 'High' | 'Severe';
  abattoirWasteDisposal?: 'Regulated Incineration' | 'Septic Lagoon' | 'Direct Watercourse Discharge' | 'Uncontrolled Open Dump';
  pesticideRunoff?: 'Negligible' | 'Detected' | 'Heavy Agricultural Runoff';
  temperatureC: number;
  rainfallMm: number;
  humidityPercent: number;
  severity: SeverityLevel;
  reportingDate: string;
  source: string;
  notes: string;
  reportedBy: string;
  reportedByEmail: string;
  createdAt: string;
  updatedAt: string;
}

export type VectorType = 'mosquito' | 'tick' | 'sandfly' | 'blackfly' | 'tsetse';

export interface VectorReport {
  id: string;
  vectorType: VectorType;
  species: string;
  state: string;
  lga: string;
  collectionSiteType: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  collectionDate: string;
  larvalIndexBreteau: number; // Positive containers per 100 houses (Threshold >50)
  adultTrapCatchPerNight: number;
  pathogenDetected: string;
  insecticideResistance: 'susceptible' | 'pyrethroid_resistant' | 'organophosphate_resistant' | 'dual_resistant';
  interventionsApplied: string[];
  notes: string;
  reportedBy: string;
  reportedByEmail: string;
  createdAt: string;
  updatedAt: string;
}

export type InvestigationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type IncidentLifecycle =
  | 'alert_raised'
  | 'rapid_response_dispatched'
  | 'lab_confirmation'
  | 'one_health_containment'
  | 'resolved';

export interface FieldObservation {
  id: string;
  date: string;
  officerName: string;
  role: string;
  notes: string;
  category: 'clinical' | 'veterinary' | 'environmental' | 'community';
}

export interface DocumentedIntervention {
  id: string;
  date: string;
  type: string;
  details: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface Investigation {
  id: string;
  investigationNumber: string;
  title: string;
  diseaseOrThreat: string;
  state: string;
  lga: string;
  priority: InvestigationPriority;
  status: IncidentLifecycle;
  teamLead: string;
  assignedOfficers: string[];
  triggerSignalType: string;
  confirmedCases: number;
  contactsTraced: number;
  ringsVaccinated: number;
  fieldObservations: FieldObservation[];
  interventionsDocumented: DocumentedIntervention[];
  finalReportBrief?: string;
  createdBy: string;
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: 'zoonotic' | 'environmental' | 'vector' | 'investigation' | 'auth' | 'ai_synthesis';
  entityId: string;
  performedBy: string;
  performedByEmail: string;
  userRole: UserRole;
  details: string;
  createdAt: string;
}

export interface NigeriaStateInfo {
  name: string;
  code: string;
  capital: string;
  zone: 'North Central' | 'North East' | 'North West' | 'South East' | 'South South' | 'South West';
  coordinates: {
    lat: number;
    lng: number;
  };
  svgPathCoord: { x: number; y: number }; // Relative map coordinate for custom map canvas
  lgas: string[];
}
