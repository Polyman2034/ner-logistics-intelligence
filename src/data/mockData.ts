/**
 * RouteMind NER Logistics Intelligence Platform
 * Realistic North Eastern Region Seed Data & Domain State
 */

import {
  User,
  District,
  Road,
  Incident,
  Vehicle,
  Delivery,
  WeatherObservation,
  Alert,
  AuditLog,
  RiskPrediction
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-gov-01',
    name: 'Dr. Mukul Hazarika',
    email: 'mukul.hazarika@ner-logistics.gov.in',
    phone: '+91 94350 12845',
    username: 'admin_mukul',
    role: 'GOVERNMENT_ADMIN',
    organization: 'North Eastern Council (NEC) Logistics Cell',
    state: 'Assam',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10T08:00:00Z'
  },
  {
    id: 'usr-dist-02',
    name: 'Pema Khandu (Deputy Commissioner)',
    email: 'dc.tawang@arunachal.gov.in',
    phone: '+91 94360 44912',
    username: 'dc_tawang',
    role: 'DISTRICT_AUTHORITY',
    districtId: 'dist-tawang',
    districtName: 'Tawang District',
    state: 'Arunachal Pradesh',
    organization: 'District Administration Tawang',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-15T09:30:00Z'
  },
  {
    id: 'usr-field-03',
    name: 'Tsering Dorjee',
    email: 'tsering.field@pwd.arunachal.gov.in',
    phone: '+91 98621 55301',
    username: 'officer_tsering',
    role: 'FIELD_OFFICER',
    districtId: 'dist-tawang',
    districtName: 'Tawang District',
    state: 'Arunachal Pradesh',
    organization: 'Border Roads Organisation (BRO) Task Force 42',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-01T11:00:00Z'
  },
  {
    id: 'usr-trans-04',
    name: 'Anupama Sengupta',
    email: 'anupama@assamfreight-corridor.in',
    phone: '+91 98540 88219',
    username: 'logistics_anupama',
    role: 'TRANSPORT_MANAGER',
    organization: 'NER Essential Supplies & Freight Consortium',
    state: 'Assam',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-05T10:15:00Z'
  },
  {
    id: 'usr-driver-05',
    name: 'Lalremruata Fanai',
    email: 'lalrem.driver@nerlogistics.org',
    phone: '+91 97741 33209',
    username: 'driver_lalrem',
    role: 'DRIVER',
    districtId: 'dist-aizawl',
    districtName: 'Aizawl District',
    state: 'Mizoram',
    organization: 'All Northeast Hill Transport Syndicate',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-12T14:40:00Z'
  },
  {
    id: 'usr-emg-06',
    name: 'Col. Ranjit Singha',
    email: 'ranjit.ndrf@disaster-response.gov.in',
    phone: '+91 94355 90123',
    username: 'commander_ranjit',
    role: 'EMERGENCY_OFFICER',
    organization: 'NDRF 1st Battalion Patgaon Guwahati',
    state: 'Assam',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-05T07:20:00Z'
  },
  {
    id: 'usr-sys-07',
    name: 'Devika Baruah',
    email: 'sysadmin@RouteMind-ner.nic.in',
    phone: '+91 98640 11984',
    username: 'sys_devika',
    role: 'SYSTEM_ADMIN',
    organization: 'RouteMind Core Infrastructure Operations',
    state: 'Assam',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const INITIAL_DISTRICTS: District[] = [
  {
    id: 'dist-kamrup',
    name: 'Kamrup Metropolitan (Guwahati)',
    state: 'Assam',
    headquarters: 'Guwahati',
    centerLat: 26.1445,
    centerLng: 91.7362,
    riskLevel: 'Low',
    activeIncidents: 1,
    accessibleRoadsRatio: 0.94
  },
  {
    id: 'dist-tawang',
    name: 'Tawang',
    state: 'Arunachal Pradesh',
    headquarters: 'Tawang',
    centerLat: 27.5861,
    centerLng: 91.8687,
    riskLevel: 'High',
    activeIncidents: 3,
    accessibleRoadsRatio: 0.62
  },
  {
    id: 'dist-east-khasi',
    name: 'East Khasi Hills (Shillong)',
    state: 'Meghalaya',
    headquarters: 'Shillong',
    centerLat: 25.5788,
    centerLng: 91.8933,
    riskLevel: 'Medium',
    activeIncidents: 2,
    accessibleRoadsRatio: 0.81
  },
  {
    id: 'dist-imphal-west',
    name: 'Imphal West',
    state: 'Manipur',
    headquarters: 'Imphal',
    centerLat: 24.8170,
    centerLng: 93.9368,
    riskLevel: 'High',
    activeIncidents: 2,
    accessibleRoadsRatio: 0.70
  },
  {
    id: 'dist-aizawl',
    name: 'Aizawl',
    state: 'Mizoram',
    headquarters: 'Aizawl',
    centerLat: 23.7271,
    centerLng: 92.7176,
    riskLevel: 'Medium',
    activeIncidents: 1,
    accessibleRoadsRatio: 0.78
  },
  {
    id: 'dist-kohima',
    name: 'Kohima',
    state: 'Nagaland',
    headquarters: 'Kohima',
    centerLat: 25.6751,
    centerLng: 94.1086,
    riskLevel: 'High',
    activeIncidents: 2,
    accessibleRoadsRatio: 0.68
  },
  {
    id: 'dist-west-tripura',
    name: 'West Tripura (Agartala)',
    state: 'Tripura',
    headquarters: 'Agartala',
    centerLat: 23.8315,
    centerLng: 91.2868,
    riskLevel: 'Low',
    activeIncidents: 0,
    accessibleRoadsRatio: 0.95
  },
  {
    id: 'dist-east-sikkim',
    name: 'East Sikkim (Gangtok)',
    state: 'Sikkim',
    headquarters: 'Gangtok',
    centerLat: 27.3314,
    centerLng: 88.6138,
    riskLevel: 'Critical',
    activeIncidents: 4,
    accessibleRoadsRatio: 0.54
  },
  {
    id: 'dist-cachar',
    name: 'Cachar (Silchar)',
    state: 'Assam',
    headquarters: 'Silchar',
    centerLat: 24.8333,
    centerLng: 92.7789,
    riskLevel: 'Medium',
    activeIncidents: 1,
    accessibleRoadsRatio: 0.85
  }
];

export const INITIAL_ROADS: Road[] = [
  {
    id: 'road-nh-27',
    code: 'NH-27',
    name: 'East-West Highway (Bongaigaon - Guwahati - Nagaon)',
    districtId: 'dist-kamrup',
    districtName: 'Kamrup Metropolitan',
    state: 'Assam',
    status: 'ACCESSIBLE',
    coordinates: [
      { lat: 26.501, lng: 90.543 },
      { lat: 26.312, lng: 91.121 },
      { lat: 26.144, lng: 91.736 },
      { lat: 26.345, lng: 92.684 }
    ],
    lengthKm: 188,
    lastUpdated: '12 mins ago',
    activeIncidentsCount: 0,
    estimatedDelayMinutes: 0,
    weatherCondition: 'Scattered Clouds, 27°C',
    riskScore: 18,
    elevationGradient: 'River Valley'
  },
  {
    id: 'road-nh-6',
    code: 'NH-6',
    name: 'Guwahati - Shillong - Silchar Corridor',
    districtId: 'dist-east-khasi',
    districtName: 'East Khasi Hills',
    state: 'Meghalaya',
    status: 'CAUTION',
    coordinates: [
      { lat: 26.144, lng: 91.736 },
      { lat: 25.890, lng: 91.820 },
      { lat: 25.578, lng: 91.893 },
      { lat: 25.210, lng: 92.340 },
      { lat: 24.833, lng: 92.778 }
    ],
    lengthKm: 215,
    lastUpdated: '8 mins ago',
    activeIncidentsCount: 1,
    estimatedDelayMinutes: 45,
    weatherCondition: 'Monsoon Downpour, 19°C',
    riskScore: 58,
    elevationGradient: 'High Mountain'
  },
  {
    id: 'road-nh-13',
    code: 'NH-13',
    name: 'Trans-Arunachal Highway (Bhalukpong - Bomdila - Sela - Tawang)',
    districtId: 'dist-tawang',
    districtName: 'Tawang',
    state: 'Arunachal Pradesh',
    status: 'BLOCKED',
    coordinates: [
      { lat: 26.998, lng: 92.641 },
      { lat: 27.264, lng: 92.420 },
      { lat: 27.502, lng: 92.100 },
      { lat: 27.586, lng: 91.868 }
    ],
    lengthKm: 174,
    lastUpdated: '4 mins ago',
    activeIncidentsCount: 2,
    estimatedDelayMinutes: 240,
    recommendedAlternateRoadId: 'road-sh-tawang-alt',
    weatherCondition: 'Heavy Sleet & Dense Fog, 4°C',
    riskScore: 88,
    elevationGradient: 'High Mountain'
  },
  {
    id: 'road-nh-29',
    code: 'NH-29',
    name: 'Dimapur - Kohima - Maram Highway',
    districtId: 'dist-kohima',
    districtName: 'Kohima',
    state: 'Nagaland',
    status: 'CAUTION',
    coordinates: [
      { lat: 25.906, lng: 93.727 },
      { lat: 25.750, lng: 93.920 },
      { lat: 25.675, lng: 94.108 }
    ],
    lengthKm: 74,
    lastUpdated: '22 mins ago',
    activeIncidentsCount: 1,
    estimatedDelayMinutes: 60,
    weatherCondition: 'Intermittent Rain, 18°C',
    riskScore: 62,
    elevationGradient: 'High Mountain'
  },
  {
    id: 'road-nh-10',
    code: 'NH-10',
    name: 'Sevoke - Teesta - Rangpo - Gangtok Lifeline',
    districtId: 'dist-east-sikkim',
    districtName: 'East Sikkim',
    state: 'Sikkim',
    status: 'BLOCKED',
    coordinates: [
      { lat: 26.882, lng: 88.471 },
      { lat: 27.050, lng: 88.490 },
      { lat: 27.180, lng: 88.530 },
      { lat: 27.331, lng: 88.613 }
    ],
    lengthKm: 98,
    lastUpdated: '2 mins ago',
    activeIncidentsCount: 3,
    estimatedDelayMinutes: 360,
    recommendedAlternateRoadId: 'road-lava-alt',
    weatherCondition: 'Cloudburst & River Overflow, 14°C',
    riskScore: 94,
    elevationGradient: 'River Valley & Cliff'
  },
  {
    id: 'road-nh-306',
    code: 'NH-306',
    name: 'Silchar (Assam) - Vairengte - Kolasib - Aizawl Arterial',
    districtId: 'dist-aizawl',
    districtName: 'Aizawl',
    state: 'Mizoram',
    status: 'ACCESSIBLE',
    coordinates: [
      { lat: 24.833, lng: 92.778 },
      { lat: 24.490, lng: 92.760 },
      { lat: 24.220, lng: 92.680 },
      { lat: 23.727, lng: 92.717 }
    ],
    lengthKm: 130,
    lastUpdated: '15 mins ago',
    activeIncidentsCount: 0,
    estimatedDelayMinutes: 10,
    weatherCondition: 'Light Mist, 22°C',
    riskScore: 28,
    elevationGradient: 'Foothills'
  },
  {
    id: 'road-nh-37',
    code: 'NH-37',
    name: 'Jiribam - Noney - Imphal Lifeline Highway',
    districtId: 'dist-imphal-west',
    districtName: 'Imphal West',
    state: 'Manipur',
    status: 'CAUTION',
    coordinates: [
      { lat: 24.800, lng: 93.120 },
      { lat: 24.780, lng: 93.510 },
      { lat: 24.817, lng: 93.936 }
    ],
    lengthKm: 220,
    lastUpdated: '30 mins ago',
    activeIncidentsCount: 1,
    estimatedDelayMinutes: 80,
    weatherCondition: 'Dense Fog, 21°C',
    riskScore: 54,
    elevationGradient: 'High Mountain'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    type: 'Landslide',
    title: 'Major Sela Pass Ridge Rockslide Blockage',
    description: 'A 60-meter debris slide triggered by heavy overnight sleet has completely blocked both lanes near Sela Tunnel West Portal. Military clearing teams and BRO excavators deployed.',
    latitude: 27.502,
    longitude: 92.100,
    roadId: 'road-nh-13',
    roadName: 'NH-13 Trans-Arunachal Highway',
    districtId: 'dist-tawang',
    districtName: 'Tawang',
    state: 'Arunachal Pradesh',
    severity: 'CRITICAL',
    status: 'Verified',
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80',
    reporterId: 'usr-field-03',
    reporterName: 'Tsering Dorjee',
    reporterRole: 'FIELD_OFFICER',
    createdAt: '2025-02-28T04:15:00Z',
    verifiedBy: 'Pema Khandu (Deputy Commissioner)',
    verifiedAt: '2025-02-28T05:00:00Z'
  },
  {
    id: 'inc-002',
    type: 'Flood',
    title: 'Teesta River Inundation at 29th Mile',
    description: 'Teesta river swollen over roadway at 29th Mile NH-10. Road surface submerged under 1.4 meters of rushing water. Traffic halted from Melli checkpost.',
    latitude: 27.050,
    longitude: 88.490,
    roadId: 'road-nh-10',
    roadName: 'NH-10 Sevoke - Gangtok Lifeline',
    districtId: 'dist-east-sikkim',
    districtName: 'East Sikkim',
    state: 'Sikkim',
    severity: 'CRITICAL',
    status: 'Verified',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    reporterId: 'usr-emg-06',
    reporterName: 'Col. Ranjit Singha',
    reporterRole: 'EMERGENCY_OFFICER',
    createdAt: '2025-02-28T06:30:00Z',
    verifiedBy: 'State Disaster Management Sikkim',
    verifiedAt: '2025-02-28T06:45:00Z'
  },
  {
    id: 'inc-003',
    type: 'Bridge Damage',
    title: 'Mudslide Scour on Byrnihat Culvert Bridge',
    description: 'Continuous torrential rains have caused structural foundation scour on Left Abutment of Bridge #14 near Byrnihat. Heavy 10T trucks diverted; single light vehicle lane allowed under caution.',
    latitude: 25.890,
    longitude: 91.820,
    roadId: 'road-nh-6',
    roadName: 'NH-6 Guwahati - Shillong Corridor',
    districtId: 'dist-east-khasi',
    districtName: 'East Khasi Hills',
    state: 'Meghalaya',
    severity: 'HIGH',
    status: 'Verified',
    photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80',
    reporterId: 'usr-gov-01',
    reporterName: 'Dr. Mukul Hazarika',
    reporterRole: 'GOVERNMENT_ADMIN',
    createdAt: '2025-02-28T07:10:00Z',
    verifiedBy: 'Meghalaya PWD NH-Division',
    verifiedAt: '2025-02-28T07:35:00Z'
  },
  {
    id: 'inc-004',
    type: 'Road Damage',
    title: 'Pothole Trench & Subsidence near Pagla Pahar',
    description: 'Slumping soil bank has created a 15-meter road depression on NH-29 near Pagla Pahar. Speed restriction 10 km/h enforced by Nagaland Traffic Police.',
    latitude: 25.750,
    longitude: 93.920,
    roadId: 'road-nh-29',
    roadName: 'NH-29 Dimapur - Kohima Highway',
    districtId: 'dist-kohima',
    districtName: 'Kohima',
    state: 'Nagaland',
    severity: 'MEDIUM',
    status: 'Pending Verification',
    photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80',
    reporterId: 'usr-driver-05',
    reporterName: 'Lalremruata Fanai',
    reporterRole: 'DRIVER',
    createdAt: '2025-02-28T08:05:00Z'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-01',
    registrationNo: 'AS-01-GC-4481',
    type: 'Refrigerated Pharma Van',
    driverId: 'usr-driver-05',
    driverName: 'Lalremruata Fanai',
    status: 'IN_TRANSIT',
    currentLat: 26.144,
    currentLng: 91.736,
    speedKmh: 42,
    heading: 175,
    fuelLevelPercent: 78,
    lastPing: 'Just now',
    currentDeliveryId: 'del-001'
  },
  {
    id: 'veh-02',
    registrationNo: 'AR-01-B-8902',
    type: '4x4 Rescue Supply Van',
    driverId: 'usr-field-03',
    driverName: 'Tsering Dorjee',
    status: 'IN_TRANSIT',
    currentLat: 27.264,
    currentLng: 92.420,
    speedKmh: 28,
    heading: 330,
    fuelLevelPercent: 62,
    lastPing: '2 mins ago',
    currentDeliveryId: 'del-002'
  },
  {
    id: 'veh-03',
    registrationNo: 'SK-01-T-3129',
    type: 'Heavy Truck 10T',
    driverName: 'Bikash Chettri',
    status: 'IN_TRANSIT',
    currentLat: 26.882,
    currentLng: 88.471,
    speedKmh: 0,
    heading: 45,
    fuelLevelPercent: 85,
    lastPing: '4 mins ago',
    currentDeliveryId: 'del-003'
  },
  {
    id: 'veh-04',
    registrationNo: 'ML-05-E-1004',
    type: 'Emergency Fuel Tanker',
    driverName: 'Banteilang Kharkongor',
    status: 'ASSIGNED',
    currentLat: 25.578,
    currentLng: 91.893,
    speedKmh: 0,
    heading: 0,
    fuelLevelPercent: 95,
    lastPing: '10 mins ago',
    currentDeliveryId: 'del-004'
  },
  {
    id: 'veh-05',
    registrationNo: 'MN-01-K-5512',
    type: 'Medium Truck 5T',
    driverName: 'Somendro Luwang',
    status: 'IDLE',
    currentLat: 24.817,
    currentLng: 93.936,
    speedKmh: 0,
    heading: 90,
    fuelLevelPercent: 45,
    lastPing: '15 mins ago'
  }
];

export const INITIAL_DELIVERIES: Delivery[] = [
  {
    id: 'del-001',
    trackingCode: 'NER-MED-2025-081',
    commodity: 'Pediatric Vaccines & Snake Antivenom (2-8°C)',
    priority: 'CRITICAL_SOS',
    origin: 'Central Medical Stores, Guwahati',
    originCoords: { lat: 26.144, lng: 91.736 },
    destination: 'Civil Hospital, Shillong',
    destinationCoords: { lat: 25.578, lng: 91.893 },
    vehicleId: 'veh-01',
    vehicleRegNo: 'AS-01-GC-4481',
    driverId: 'usr-driver-05',
    driverName: 'Lalremruata Fanai',
    status: 'In Transit',
    eta: 'Today, 14:15 IST',
    distanceKm: 98,
    currentRouteId: 'route-nh-6-direct',
    alternateRouteId: 'route-nh-6-alternate-umiam',
    riskScore: 52,
    createdAt: '2025-02-28T06:00:00Z',
    updatedAt: '2025-02-28T08:10:00Z',
    assignedDistrict: 'East Khasi Hills'
  },
  {
    id: 'del-002',
    trackingCode: 'NER-RELIEF-2025-114',
    commodity: 'High-Altitude Cold Weather Rations & Tarpaulins',
    priority: 'HIGH',
    origin: 'Army Supply Depot, Tezpur',
    originCoords: { lat: 26.633, lng: 92.792 },
    destination: 'District Emergency Center, Tawang',
    destinationCoords: { lat: 27.586, lng: 91.868 },
    vehicleId: 'veh-02',
    vehicleRegNo: 'AR-01-B-8902',
    driverId: 'usr-field-03',
    driverName: 'Tsering Dorjee',
    status: 'Delayed',
    eta: 'Delayed by 4h (Active Rockslide at Sela Pass)',
    distanceKm: 310,
    currentRouteId: 'route-nh-13-sela',
    alternateRouteId: 'route-shergaon-tawang',
    riskScore: 86,
    createdAt: '2025-02-27T18:00:00Z',
    updatedAt: '2025-02-28T07:45:00Z',
    assignedDistrict: 'Tawang'
  },
  {
    id: 'del-003',
    trackingCode: 'NER-FOOD-2025-092',
    commodity: 'FCI Essential Grain Rations (Wheat & Rice)',
    priority: 'HIGH',
    origin: 'Siliguri Logistics Hub',
    originCoords: { lat: 26.727, lng: 88.395 },
    destination: 'STNM Central Hospital & Gangtok Depots',
    destinationCoords: { lat: 27.331, lng: 88.613 },
    vehicleId: 'veh-03',
    vehicleRegNo: 'SK-01-T-3129',
    driverName: 'Bikash Chettri',
    status: 'Delayed',
    eta: 'Halted at Sevoke (Teesta flood blockage)',
    distanceKm: 114,
    currentRouteId: 'route-nh-10-teesta',
    alternateRouteId: 'route-lava-damdim-gangtok',
    riskScore: 92,
    createdAt: '2025-02-28T05:00:00Z',
    updatedAt: '2025-02-28T08:00:00Z',
    assignedDistrict: 'East Sikkim'
  },
  {
    id: 'del-004',
    trackingCode: 'NER-FUEL-2025-027',
    commodity: 'High-Octane Aviation & Generator Diesel',
    priority: 'HIGH',
    origin: 'Guwahati IOCL Refinery',
    originCoords: { lat: 26.180, lng: 91.800 },
    destination: 'NEIGRIHMS Shillong Backup Generators',
    destinationCoords: { lat: 25.590, lng: 91.930 },
    vehicleId: 'veh-04',
    vehicleRegNo: 'ML-05-E-1004',
    driverName: 'Banteilang Kharkongor',
    status: 'Assigned',
    eta: 'Today, 17:30 IST',
    distanceKm: 104,
    currentRouteId: 'route-nh-6-direct',
    riskScore: 48,
    createdAt: '2025-02-28T07:30:00Z',
    updatedAt: '2025-02-28T07:30:00Z',
    assignedDistrict: 'East Khasi Hills'
  }
];

export const INITIAL_WEATHER: WeatherObservation[] = [
  {
    id: 'wx-01',
    districtId: 'dist-tawang',
    districtName: 'Tawang',
    state: 'Arunachal Pradesh',
    tempC: 3.5,
    rainfallMm: 68.4,
    windKmh: 48,
    visibilityKm: 0.8,
    condition: 'Dense Fog',
    alertIssued: true,
    updatedAt: '10 mins ago'
  },
  {
    id: 'wx-02',
    districtId: 'dist-east-sikkim',
    districtName: 'East Sikkim',
    state: 'Sikkim',
    tempC: 13.2,
    rainfallMm: 112.6,
    windKmh: 35,
    visibilityKm: 1.2,
    condition: 'Monsoon Downpour',
    alertIssued: true,
    updatedAt: '5 mins ago'
  },
  {
    id: 'wx-03',
    districtId: 'dist-east-khasi',
    districtName: 'East Khasi Hills',
    state: 'Meghalaya',
    tempC: 18.0,
    rainfallMm: 52.0,
    windKmh: 24,
    visibilityKm: 3.5,
    condition: 'Heavy Rain',
    alertIssued: false,
    updatedAt: '12 mins ago'
  },
  {
    id: 'wx-04',
    districtId: 'dist-kamrup',
    districtName: 'Kamrup Metropolitan',
    state: 'Assam',
    tempC: 27.5,
    rainfallMm: 6.2,
    windKmh: 14,
    visibilityKm: 8.0,
    condition: 'Scattered Clouds',
    alertIssued: false,
    updatedAt: '15 mins ago'
  },
  {
    id: 'wx-05',
    districtId: 'dist-kohima',
    districtName: 'Kohima',
    state: 'Nagaland',
    tempC: 17.8,
    rainfallMm: 34.0,
    windKmh: 18,
    visibilityKm: 4.0,
    condition: 'Thunderstorm',
    alertIssued: true,
    updatedAt: '8 mins ago'
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt-01',
    severity: 'CRITICAL',
    title: 'Sela Tunnel Corridor Blocked - Rockslide',
    message: 'NH-13 blocked near Sela Tunnel West Portal. BRO Task Force 42 clearing operations in progress. Diverting emergency supplies to Bhalukpong-Shergaon detour.',
    roadId: 'road-nh-13',
    districtId: 'dist-tawang',
    timestamp: '28 mins ago',
    read: false,
    targetRoles: ['GOVERNMENT_ADMIN', 'DISTRICT_AUTHORITY', 'TRANSPORT_MANAGER', 'EMERGENCY_OFFICER', 'FIELD_OFFICER']
  },
  {
    id: 'alt-02',
    severity: 'CRITICAL',
    title: 'Teesta River Flash Flood Submersion on NH-10',
    message: 'NH-10 closed at 29th Mile. All freight transit to Gangtok halted at Sevoke. Critical oxygen and pharmaceutical convoys routed via Lava-Damdim.',
    roadId: 'road-nh-10',
    districtId: 'dist-east-sikkim',
    timestamp: '45 mins ago',
    read: false,
    targetRoles: ['GOVERNMENT_ADMIN', 'TRANSPORT_MANAGER', 'EMERGENCY_OFFICER', 'DRIVER']
  },
  {
    id: 'alt-03',
    severity: 'WARNING',
    title: 'Byrnihat Culvert Scour on NH-6',
    message: 'Single lane operation in effect on NH-6 km 24. Heavy multi-axle trucks advised to hold at Jorabat logistics terminal to avoid bottle-necking.',
    roadId: 'road-nh-6',
    districtId: 'dist-east-khasi',
    timestamp: '1 hour ago',
    read: true,
    targetRoles: ['TRANSPORT_MANAGER', 'DRIVER', 'FIELD_OFFICER']
  },
  {
    id: 'alt-04',
    severity: 'INFO',
    title: 'East-West Expressway (NH-27) Fully Clear',
    message: 'NH-27 through Assam plains operating at 100% capacity with green status. High priority corridor for inter-state food grain movement.',
    roadId: 'road-nh-27',
    districtId: 'dist-kamrup',
    timestamp: '2 hours ago',
    read: true,
    targetRoles: ['GOVERNMENT_ADMIN', 'TRANSPORT_MANAGER']
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    userId: 'usr-field-03',
    userName: 'Tsering Dorjee (Field Officer)',
    action: 'INCIDENT_REPORTED',
    entity: 'Incident',
    entityId: 'inc-001',
    details: 'Captured GPS (27.502, 92.100) and photo of 60m rockfall on NH-13 Sela Pass',
    timestamp: '2025-02-28T04:15:22Z'
  },
  {
    id: 'log-02',
    userId: 'usr-dist-02',
    userName: 'Pema Khandu (Deputy Commissioner)',
    action: 'INCIDENT_VERIFIED',
    entity: 'Incident',
    entityId: 'inc-001',
    details: 'Verified severity as CRITICAL and updated road status to BLOCKED',
    timestamp: '2025-02-28T05:00:10Z'
  },
  {
    id: 'log-03',
    userId: 'usr-trans-04',
    userName: 'Anupama Sengupta (Transport Mgr)',
    action: 'ROUTE_RE_OPTIMIZED',
    entity: 'Delivery',
    entityId: 'del-002',
    details: 'Applied AI alternate recommendation: diverted relief convoy AR-01-B-8902 via Shergaon',
    timestamp: '2025-02-28T07:45:00Z'
  },
  {
    id: 'log-04',
    userId: 'usr-emg-06',
    userName: 'Col. Ranjit Singha (Emergency Officer)',
    action: 'EMERGENCY_CORRIDOR_DECLARED',
    entity: 'Road',
    entityId: 'road-nh-10',
    details: 'Declared Teesta-Corridor in Disaster Protocol Stage II; deployed NDRF rescue zodiacs',
    timestamp: '2025-02-28T06:35:00Z'
  }
];

export const INITIAL_RISK_PREDICTIONS: RiskPrediction[] = [
  {
    districtId: 'dist-tawang',
    districtName: 'Tawang',
    roadCode: 'NH-13',
    riskScore: 88,
    riskLevel: 'Critical',
    affectedArea: 'Sela Tunnel Pass Elevation (4,170m)',
    reason: '68mm sleet precipitation + 42° slope fracture zones + recent rockfalls',
    recommendedAction: 'Suspend 10T commercial convoy; activate BRO Sela snowcutter unit; switch route to Shergaon bypass',
    generatedAt: '15 mins ago',
    factors: {
      rainfallWeight: 0.85,
      elevationHazard: 0.92,
      activeBlockages: 1.0
    }
  },
  {
    districtId: 'dist-east-sikkim',
    districtName: 'East Sikkim',
    roadCode: 'NH-10',
    riskScore: 94,
    riskLevel: 'Critical',
    affectedArea: 'Teesta River Basin 29th-Mile Stretch',
    reason: 'Flash flood discharge exceeding 110mm/6h + riverbank erosion undercutting highway',
    recommendedAction: 'Direct all high-priority pharmaceutical convoys via Lava-Algarah-Reshi corridor',
    generatedAt: '10 mins ago',
    factors: {
      rainfallWeight: 0.96,
      elevationHazard: 0.88,
      activeBlockages: 1.0
    }
  },
  {
    districtId: 'dist-east-khasi',
    districtName: 'East Khasi Hills',
    roadCode: 'NH-6',
    riskScore: 58,
    riskLevel: 'Medium',
    affectedArea: 'Byrnihat - Umsning Rolling Gradient',
    reason: 'Culvert scouring combined with continuous monsoon fog reducing visibility to under 300m',
    recommendedAction: 'Enforce convoy headways of 200m; light vehicle single-lane pilot car operation',
    generatedAt: '25 mins ago',
    factors: {
      rainfallWeight: 0.62,
      elevationHazard: 0.55,
      activeBlockages: 0.3
    }
  },
  {
    districtId: 'dist-kamrup',
    districtName: 'Kamrup Metro',
    roadCode: 'NH-27',
    riskScore: 18,
    riskLevel: 'Low',
    affectedArea: 'Guwahati Plains Corridor',
    reason: 'Stable river valley terrain, dry tarmac, optimal visibility (>8km)',
    recommendedAction: 'Maintain normal transit schedules; prioritize freight dispatch for hill transfers',
    generatedAt: '30 mins ago',
    factors: {
      rainfallWeight: 0.12,
      elevationHazard: 0.10,
      activeBlockages: 0.0
    }
  }
];
