/**
 * PANDAVAS NER Logistics Intelligence Platform
 * Core TypeScript Definitions & Domain Models
 */

export type UserRole =
  | 'GOVERNMENT_ADMIN'      // 1. Government / NER Administrator
  | 'DISTRICT_AUTHORITY'     // 2. District Authority
  | 'FIELD_OFFICER'          // 3. Field Officer
  | 'TRANSPORT_MANAGER'      // 4. Logistics / Transport Manager
  | 'DRIVER'                 // 5. Driver
  | 'EMERGENCY_OFFICER'      // 6. Emergency / Disaster Response Officer
  | 'SYSTEM_ADMIN';          // 7. System Administrator

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  role: UserRole;
  districtId?: string;
  districtName?: string;
  state?: string;
  avatarUrl?: string;
  organization?: string;
  createdAt: string;
}

export type RoadStatus = 'ACCESSIBLE' | 'CAUTION' | 'BLOCKED' | 'UNKNOWN';

export interface RoadCoordinate {
  lat: number;
  lng: number;
}

export interface Road {
  id: string;
  code: string; // e.g., 'NH-27', 'NH-6', 'NH-10'
  name: string;
  districtId: string;
  districtName: string;
  state: string; // Assam, Meghalaya, etc.
  status: RoadStatus;
  coordinates: RoadCoordinate[];
  lengthKm: number;
  lastUpdated: string;
  activeIncidentsCount: number;
  estimatedDelayMinutes: number;
  recommendedAlternateRoadId?: string;
  weatherCondition: string;
  riskScore: number; // 0 - 100
  elevationGradient: string; // 'High Mountain', 'River Valley', 'Foothills'
}

export type IncidentType =
  | 'Road Blockage'
  | 'Landslide'
  | 'Flood'
  | 'Road Damage'
  | 'Bridge Damage'
  | 'Traffic'
  | 'Accident'
  | 'Weather Hazard'
  | 'Other';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus =
  | 'Reported'
  | 'Pending Verification'
  | 'Verified'
  | 'Rejected'
  | 'Resolved';

export interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  roadId: string;
  roadName: string;
  districtId: string;
  districtName: string;
  state: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  photoUrl?: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  createdAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  isOfflineSubmitted?: boolean;
}

export type VehicleStatus = 'IDLE' | 'ASSIGNED' | 'IN_TRANSIT' | 'MAINTENANCE';

export interface Vehicle {
  id: string;
  registrationNo: string;
  type: 'Heavy Truck 10T' | 'Medium Truck 5T' | 'Refrigerated Pharma Van' | '4x4 Rescue Supply Van' | 'Emergency Fuel Tanker';
  driverId?: string;
  driverName?: string;
  status: VehicleStatus;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  heading: number;
  fuelLevelPercent: number;
  lastPing: string;
  currentDeliveryId?: string;
}

export type DeliveryPriority = 'NORMAL' | 'HIGH' | 'CRITICAL_SOS';

export type DeliveryStatus =
  | 'Created'
  | 'Assigned'
  | 'Picked Up'
  | 'In Transit'
  | 'Delayed'
  | 'Delivered'
  | 'Cancelled';

export interface Delivery {
  id: string;
  trackingCode: string;
  commodity: string;
  priority: DeliveryPriority;
  origin: string;
  originCoords: RoadCoordinate;
  destination: string;
  destinationCoords: RoadCoordinate;
  vehicleId?: string;
  vehicleRegNo?: string;
  driverId?: string;
  driverName?: string;
  status: DeliveryStatus;
  eta: string;
  distanceKm: number;
  currentRouteId: string;
  alternateRouteId?: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  assignedDistrict: string;
}

export interface RouteOption {
  id: string;
  name: string;
  waypoints: RoadCoordinate[];
  distanceKm: number;
  durationMinutes: number;
  riskScore: number; // 0 - 100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  isRecommended: boolean;
  blockedPointsAvoided: number;
  reason: string;
}

export interface WeatherObservation {
  id: string;
  districtId: string;
  districtName: string;
  state: string;
  tempC: number;
  rainfallMm: number;
  windKmh: number;
  visibilityKm: number;
  condition: 'Heavy Rain' | 'Monsoon Downpour' | 'Dense Fog' | 'Scattered Clouds' | 'Clear Sky' | 'Thunderstorm';
  alertIssued: boolean;
  updatedAt: string;
}

export interface RiskPrediction {
  districtId: string;
  districtName: string;
  roadCode: string;
  riskScore: number; // 0 - 100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedArea: string;
  reason: string;
  recommendedAction: string;
  generatedAt: string;
  factors: {
    rainfallWeight: number;
    elevationHazard: number;
    activeBlockages: number;
  };
}

export interface Alert {
  id: string;
  severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  roadId?: string;
  districtId?: string;
  timestamp: string;
  read: boolean;
  targetRoles: UserRole[];
}

export interface District {
  id: string;
  name: string;
  state: string;
  headquarters: string;
  centerLat: number;
  centerLng: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  activeIncidents: number;
  accessibleRoadsRatio: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'INCIDENT_CREATE' | 'DELIVERY_STATUS_UPDATE' | 'GPS_TELEMETRY';
  payload: any;
  createdAt: number;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED' | 'COMPLETED';
  errorMessage?: string;
}
