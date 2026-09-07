/**
 * RouteMind NER Logistics Intelligence Platform
 * REST API Endpoints with Role-Based Access Control (RBAC)
 */

import { Router, Request, Response } from 'express';
import { store } from './dataStore';
import { calculateRiskPrediction, optimizeRoute, generateSituationalBriefing } from './aiService';
import { UserRole, Incident, Delivery, RoadStatus } from '../src/types';

export const apiRouter = Router();

// Middleware: Extract current user role from header or fallback
function getUserContext(req: Request): { role: UserRole; userId: string; userName: string } {
  const roleHeader = req.headers['x-user-role'] as UserRole;
  const userIdHeader = req.headers['x-user-id'] as string;

  const validRoles: UserRole[] = [
    'GOVERNMENT_ADMIN',
    'DISTRICT_AUTHORITY',
    'FIELD_OFFICER',
    'TRANSPORT_MANAGER',
    'DRIVER',
    'EMERGENCY_OFFICER',
    'SYSTEM_ADMIN'
  ];

  const role = validRoles.includes(roleHeader) ? roleHeader : 'GOVERNMENT_ADMIN';
  const user = store.users.find(u => u.id === userIdHeader || u.role === role);
  return {
    role,
    userId: user?.id || 'usr-guest',
    userName: user?.name || 'Guest Officer'
  };
}

// ----------------------------------------------------
// Health Check & Documentation
// ----------------------------------------------------
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'RouteMind NER Logistics Intelligence API',
    version: '1.0.0',
    region: 'North Eastern Region (NER), India',
    timestamp: new Date().toISOString(),
    database: 'healthy',
    activeIncidents: store.incidents.filter(i => i.status !== 'Resolved').length,
    emergencyMode: store.emergencyMode.active
  });
});

apiRouter.get('/docs', (req: Request, res: Response) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'RouteMind NER Logistics Intelligence Platform API',
      version: '1.0.0',
      description: 'Production REST API powering road accessibility, GIS, AI risk prediction, fleet tracking, and incident reporting across Northeast India.'
    },
    endpoints: [
      { method: 'GET', path: '/api/health', desc: 'System status & diagnostics' },
      { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user / quick role access' },
      { method: 'GET', path: '/api/roads', desc: 'Get all arterial highways with accessibility status' },
      { method: 'GET', path: '/api/incidents', desc: 'List active and historical field hazards' },
      { method: 'POST', path: '/api/incidents', desc: 'Submit incident report with photo and GPS' },
      { method: 'POST', path: '/api/incidents/:id/verify', desc: 'District Authority incident verification' },
      { method: 'GET', path: '/api/vehicles', desc: 'Fleet vehicle telemetry and coordinates' },
      { method: 'POST', path: '/api/tracking/location', desc: 'Update vehicle GPS position' },
      { method: 'GET', path: '/api/deliveries', desc: 'List logistics deliveries and assigned cargo' },
      { method: 'POST', path: '/api/routes/optimize', desc: 'AI-assisted route planning avoiding landslides' },
      { method: 'POST', path: '/api/ai/briefing', desc: 'Generate situational briefing with Gemini AI' },
      { method: 'POST', path: '/api/sync/batch', desc: 'Offline queue batch ingestion' }
    ]
  });
});

// ----------------------------------------------------
// Authentication Endpoints
// ----------------------------------------------------
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  let targetUser = store.users.find(u =>
    (username && u.username === username) ||
    (email && u.email === email) ||
    (role && u.role === role)
  );

  if (!targetUser && role) {
    targetUser = store.users.find(u => u.role === role);
  }

  if (!targetUser) {
    targetUser = store.users[0]; // fallback default
  }

  store.logAction(targetUser.id, targetUser.name, 'USER_LOGIN', 'User', targetUser.id, `User logged in with role ${targetUser.role}`);

  res.json({
    success: true,
    user: targetUser,
    token: 'jwt-ner-token-' + targetUser.id + '-' + Date.now()
  });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, role, organization, state, districtId } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    name,
    email,
    phone: phone || '+91 90000 00000',
    username: email.split('@')[0],
    role: role || 'FIELD_OFFICER',
    organization: organization || 'NER Field Logistics',
    state: state || 'Assam',
    districtId: districtId || 'dist-kamrup',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  };

  store.users.push(newUser);
  store.logAction(newUser.id, newUser.name, 'USER_REGISTER', 'User', newUser.id, `New user registered with role ${newUser.role}`);

  res.status(201).json({
    success: true,
    user: newUser,
    token: 'jwt-ner-token-' + newUser.id
  });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const { userId, role } = getUserContext(req);
  const user = store.users.find(u => u.id === userId) || store.users.find(u => u.role === role) || store.users[0];
  res.json({ user });
});

// ----------------------------------------------------
// Districts Endpoints
// ----------------------------------------------------
apiRouter.get('/districts', (req: Request, res: Response) => {
  res.json(store.districts);
});

apiRouter.get('/districts/:id', (req: Request, res: Response) => {
  const district = store.districts.find(d => d.id === req.params.id);
  if (!district) return res.status(404).json({ error: 'District not found' });
  res.json(district);
});

// ----------------------------------------------------
// Roads & Road Accessibility Endpoints
// ----------------------------------------------------
apiRouter.get('/roads', (req: Request, res: Response) => {
  const { districtId, status } = req.query;
  let results = [...store.roads];
  if (districtId) {
    results = results.filter(r => r.districtId === districtId);
  }
  if (status) {
    results = results.filter(r => r.status === status);
  }
  res.json(results);
});

apiRouter.get('/roads/:id', (req: Request, res: Response) => {
  const road = store.roads.find(r => r.id === req.params.id);
  if (!road) return res.status(404).json({ error: 'Road not found' });
  res.json(road);
});

apiRouter.patch('/roads/:id/status', (req: Request, res: Response) => {
  const { role, userId, userName } = getUserContext(req);

  // RBAC: Only authorized roles can alter official road accessibility
  const allowed: UserRole[] = ['GOVERNMENT_ADMIN', 'DISTRICT_AUTHORITY', 'EMERGENCY_OFFICER', 'SYSTEM_ADMIN'];
  if (!allowed.includes(role)) {
    return res.status(403).json({ error: 'Forbidden: Insufficient privileges to update highway accessibility status.' });
  }

  const { status, delayMinutes } = req.body;
  const road = store.roads.find(r => r.id === req.params.id);
  if (!road) return res.status(404).json({ error: 'Road not found' });

  const prevStatus = road.status;
  if (status) road.status = status as RoadStatus;
  if (typeof delayMinutes === 'number') road.estimatedDelayMinutes = delayMinutes;
  road.lastUpdated = 'Just now';

  store.logAction(userId, userName, 'ROAD_STATUS_UPDATED', 'Road', road.id, `Status changed from ${prevStatus} to ${road.status}`);

  // Trigger alert if newly blocked
  if (road.status === 'BLOCKED' && prevStatus !== 'BLOCKED') {
    const alert = {
      id: 'alt-' + Date.now(),
      severity: 'CRITICAL' as const,
      title: `${road.code} Reported BLOCKED`,
      message: `${road.name} is now closed due to severe hazard. Alternate routes activated.`,
      roadId: road.id,
      districtId: road.districtId,
      timestamp: 'Just now',
      read: false,
      targetRoles: ['GOVERNMENT_ADMIN', 'TRANSPORT_MANAGER', 'DRIVER', 'EMERGENCY_OFFICER'] as UserRole[]
    };
    store.alerts.unshift(alert);
  }

  res.json({ success: true, road });
});

// ----------------------------------------------------
// Incidents Endpoints (Field Reporting & Verification)
// ----------------------------------------------------
apiRouter.get('/incidents', (req: Request, res: Response) => {
  const { districtId, status, severity, roadId } = req.query;
  let results = [...store.incidents];

  if (districtId) results = results.filter(i => i.districtId === districtId);
  if (status) results = results.filter(i => i.status === status);
  if (severity) results = results.filter(i => i.severity === severity);
  if (roadId) results = results.filter(i => i.roadId === roadId);

  res.json(results);
});

apiRouter.post('/incidents', (req: Request, res: Response) => {
  const { role, userId, userName } = getUserContext(req);
  const {
    type,
    title,
    description,
    latitude,
    longitude,
    roadId,
    districtId,
    severity,
    photoUrl
  } = req.body;

  if (!type || !description) {
    return res.status(400).json({ error: 'Type and description are required' });
  }

  const road = store.roads.find(r => r.id === roadId) || store.roads[0];
  const district = store.districts.find(d => d.id === districtId) || store.districts.find(d => d.id === road.districtId) || store.districts[0];

  const newIncident: Incident = {
    id: 'inc-' + Date.now(),
    type: type || 'Road Blockage',
    title: title || `${type} on ${road.code}`,
    description,
    latitude: Number(latitude) || road.coordinates[0]?.lat || 26.144,
    longitude: Number(longitude) || road.coordinates[0]?.lng || 91.736,
    roadId: road.id,
    roadName: road.name,
    districtId: district.id,
    districtName: district.name,
    state: district.state,
    severity: severity || 'MEDIUM',
    status: (role === 'DISTRICT_AUTHORITY' || role === 'GOVERNMENT_ADMIN') ? 'Verified' : 'Pending Verification',
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80',
    reporterId: userId,
    reporterName: userName,
    reporterRole: role,
    createdAt: new Date().toISOString()
  };

  store.incidents.unshift(newIncident);
  store.logAction(userId, userName, 'INCIDENT_CREATED', 'Incident', newIncident.id, `Reported ${newIncident.type} at (${newIncident.latitude}, ${newIncident.longitude})`);

  // If severe or critical, adjust road status automatically
  if (newIncident.severity === 'CRITICAL' && newIncident.status === 'Verified') {
    road.status = 'BLOCKED';
    road.activeIncidentsCount += 1;
  } else if (newIncident.status === 'Verified') {
    if (road.status === 'ACCESSIBLE') road.status = 'CAUTION';
    road.activeIncidentsCount += 1;
  }

  res.status(201).json({ success: true, incident: newIncident });
});

apiRouter.post('/incidents/:id/verify', (req: Request, res: Response) => {
  const { role, userId, userName } = getUserContext(req);

  // RBAC check: Only District Authority, Government Admin, Emergency Officer, or System Admin can verify
  const canVerify: UserRole[] = ['DISTRICT_AUTHORITY', 'GOVERNMENT_ADMIN', 'EMERGENCY_OFFICER', 'SYSTEM_ADMIN'];
  if (!canVerify.includes(role)) {
    return res.status(403).json({ error: 'Forbidden: Only District Authorities or Administrators can verify field incidents.' });
  }

  const incident = store.incidents.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  incident.status = 'Verified';
  incident.verifiedBy = userName;
  incident.verifiedAt = new Date().toISOString();

  // Update associated road
  const road = store.roads.find(r => r.id === incident.roadId);
  if (road) {
    road.activeIncidentsCount += 1;
    if (incident.severity === 'CRITICAL') {
      road.status = 'BLOCKED';
      road.estimatedDelayMinutes = Math.max(road.estimatedDelayMinutes, 180);
    } else if (road.status === 'ACCESSIBLE') {
      road.status = 'CAUTION';
      road.estimatedDelayMinutes = Math.max(road.estimatedDelayMinutes, 45);
    }
  }

  store.logAction(userId, userName, 'INCIDENT_VERIFIED', 'Incident', incident.id, `Verified by ${userName}`);

  res.json({ success: true, incident });
});

apiRouter.post('/incidents/:id/reject', (req: Request, res: Response) => {
  const { role, userId, userName } = getUserContext(req);

  const canVerify: UserRole[] = ['DISTRICT_AUTHORITY', 'GOVERNMENT_ADMIN', 'EMERGENCY_OFFICER', 'SYSTEM_ADMIN'];
  if (!canVerify.includes(role)) {
    return res.status(403).json({ error: 'Forbidden: Only District Authorities can reject reports.' });
  }

  const incident = store.incidents.find(i => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  incident.status = 'Rejected';
  incident.rejectionReason = req.body.reason || 'Verification patrol found road clear.';

  store.logAction(userId, userName, 'INCIDENT_REJECTED', 'Incident', incident.id, `Rejected: ${incident.rejectionReason}`);

  res.json({ success: true, incident });
});

// ----------------------------------------------------
// Vehicles & Telemetry
// ----------------------------------------------------
apiRouter.get('/vehicles', (req: Request, res: Response) => {
  res.json(store.vehicles);
});

apiRouter.post('/vehicles', (req: Request, res: Response) => {
  const { registrationNo, type, driverName } = req.body;
  const newVeh = {
    id: 'veh-' + Date.now(),
    registrationNo: registrationNo || 'AS-01-XX-0000',
    type: type || 'Medium Truck 5T',
    driverName: driverName || 'Assigned Driver',
    status: 'IDLE' as const,
    currentLat: 26.144,
    currentLng: 91.736,
    speedKmh: 0,
    heading: 0,
    fuelLevelPercent: 100,
    lastPing: 'Just now'
  };
  store.vehicles.push(newVeh);
  res.status(201).json(newVeh);
});

apiRouter.post('/tracking/location', (req: Request, res: Response) => {
  const { vehicleId, latitude, longitude, speed, heading } = req.body;
  if (!vehicleId || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'vehicleId, latitude, and longitude are required' });
  }

  const updated = store.updateVehicleLocation(vehicleId, latitude, longitude, speed, heading);
  if (!updated) return res.status(404).json({ error: 'Vehicle not found' });

  res.json({ success: true, vehicle: updated });
});

// ----------------------------------------------------
// Deliveries Management
// ----------------------------------------------------
apiRouter.get('/deliveries', (req: Request, res: Response) => {
  const { role, userId } = getUserContext(req);

  // Driver role sees primarily assigned delivery
  if (role === 'DRIVER') {
    const driverDeliveries = store.deliveries.filter(d => d.driverId === userId || d.status === 'In Transit');
    return res.json(driverDeliveries.length > 0 ? driverDeliveries : store.deliveries.slice(0, 1));
  }

  res.json(store.deliveries);
});

apiRouter.post('/deliveries', (req: Request, res: Response) => {
  const { role, userId, userName } = getUserContext(req);
  const allowed: UserRole[] = ['TRANSPORT_MANAGER', 'GOVERNMENT_ADMIN', 'EMERGENCY_OFFICER', 'SYSTEM_ADMIN'];
  if (!allowed.includes(role)) {
    return res.status(403).json({ error: 'Forbidden: Only Transport Managers and Admins can create deliveries.' });
  }

  const { commodity, priority, origin, destination, vehicleId, driverId } = req.body;

  const newDelivery: Delivery = {
    id: 'del-' + Date.now(),
    trackingCode: 'NER-' + (commodity?.slice(0, 3).toUpperCase() || 'LOG') + '-' + Date.now().toString().slice(-4),
    commodity: commodity || 'Essential Supplies',
    priority: priority || 'NORMAL',
    origin: origin || 'Guwahati Hub',
    originCoords: { lat: 26.144, lng: 91.736 },
    destination: destination || 'Shillong Depots',
    destinationCoords: { lat: 25.578, lng: 91.893 },
    vehicleId: vehicleId || 'veh-01',
    driverId: driverId || 'usr-driver-05',
    status: 'Created',
    eta: 'Pending Dispatch',
    distanceKm: 98,
    currentRouteId: 'route-opt-direct',
    riskScore: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedDistrict: 'Kamrup Metro'
  };

  store.deliveries.unshift(newDelivery);
  store.logAction(userId, userName, 'DELIVERY_CREATED', 'Delivery', newDelivery.id, `Created consignment ${newDelivery.trackingCode}`);

  res.status(201).json({ success: true, delivery: newDelivery });
});

apiRouter.patch('/deliveries/:id/status', (req: Request, res: Response) => {
  const { userId, userName } = getUserContext(req);
  const { status, notes } = req.body;

  const delivery = store.deliveries.find(d => d.id === req.params.id);
  if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

  const prev = delivery.status;
  delivery.status = status;
  delivery.updatedAt = new Date().toISOString();

  // If driver marks Delivered or In Transit, update associated vehicle status
  if (delivery.vehicleId) {
    const v = store.vehicles.find(veh => veh.id === delivery.vehicleId);
    if (v) {
      if (status === 'Delivered') v.status = 'IDLE';
      else if (status === 'In Transit') v.status = 'IN_TRANSIT';
    }
  }

  store.logAction(userId, userName, 'DELIVERY_STATUS_CHANGE', 'Delivery', delivery.id, `Status transitioned from ${prev} to ${status}. Note: ${notes || 'none'}`);

  res.json({ success: true, delivery });
});

// ----------------------------------------------------
// Routing & AI Optimization
// ----------------------------------------------------
apiRouter.post('/routes/optimize', (req: Request, res: Response) => {
  const { origin, destination, originCoords, destinationCoords } = req.body;

  const origC = originCoords || { lat: 26.144, lng: 91.736 };
  const destC = destinationCoords || { lat: 25.578, lng: 91.893 };

  const result = optimizeRoute(
    origin || 'Origin Hub',
    destination || 'Destination Depot',
    origC,
    destC
  );

  res.json(result);
});

// ----------------------------------------------------
// Weather, Alerts, Emergency Mode, Analytics
// ----------------------------------------------------
apiRouter.get('/weather', (req: Request, res: Response) => {
  res.json(store.weather);
});

apiRouter.get('/alerts', (req: Request, res: Response) => {
  res.json(store.alerts);
});

apiRouter.post('/alerts/mark-read', (req: Request, res: Response) => {
  const { alertId } = req.body;
  if (alertId) {
    const alert = store.alerts.find(a => a.id === alertId);
    if (alert) alert.read = true;
  } else {
    store.alerts.forEach(a => { a.read = true; });
  }
  res.json({ success: true });
});

apiRouter.get('/emergency/status', (req: Request, res: Response) => {
  res.json(store.emergencyMode);
});

apiRouter.post('/emergency/toggle', (req: Request, res: Response) => {
  const { role, userId, userName } = getUserContext(req);
  const canToggle: UserRole[] = ['EMERGENCY_OFFICER', 'GOVERNMENT_ADMIN', 'SYSTEM_ADMIN'];
  if (!canToggle.includes(role)) {
    return res.status(403).json({ error: 'Forbidden: Only Emergency Disaster Officers or Admins can toggle Emergency Protocol.' });
  }

  store.emergencyMode.active = !store.emergencyMode.active;
  store.emergencyMode.activatedBy = userName;
  store.emergencyMode.activatedAt = new Date().toISOString();

  store.logAction(
    userId,
    userName,
    store.emergencyMode.active ? 'EMERGENCY_MODE_ACTIVATED' : 'EMERGENCY_MODE_DEACTIVATED',
    'System',
    'emergency-core',
    `Emergency protocol ${store.emergencyMode.active ? 'ENGAGED' : 'STAND-DOWN'}`
  );

  // Broadcast alert
  const alert = {
    id: 'alt-' + Date.now(),
    severity: store.emergencyMode.active ? ('CRITICAL' as const) : ('INFO' as const),
    title: store.emergencyMode.active ? 'REGIONAL EMERGENCY PROTOCOL ACTIVATED' : 'Emergency Protocol Stood Down',
    message: store.emergencyMode.active
      ? 'All priority corridors are reserved for NDRF, medical transport, and emergency convoys.'
      : 'Normal freight corridors and standard speed limits reinstated across Northeast region.',
    timestamp: 'Just now',
    read: false,
    targetRoles: [
      'GOVERNMENT_ADMIN',
      'DISTRICT_AUTHORITY',
      'FIELD_OFFICER',
      'TRANSPORT_MANAGER',
      'DRIVER',
      'EMERGENCY_OFFICER',
      'SYSTEM_ADMIN'
    ] as UserRole[]
  };
  store.alerts.unshift(alert);

  res.json(store.emergencyMode);
});

apiRouter.get('/analytics', (req: Request, res: Response) => {
  const totalRoads = store.roads.length;
  const accessibleRoads = store.roads.filter(r => r.status === 'ACCESSIBLE').length;
  const blockedRoads = store.roads.filter(r => r.status === 'BLOCKED').length;
  const cautionRoads = store.roads.filter(r => r.status === 'CAUTION').length;

  const totalIncidents = store.incidents.length;
  const activeIncidents = store.incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Rejected').length;
  const pendingIncidents = store.incidents.filter(i => i.status === 'Pending Verification').length;

  const activeDeliveries = store.deliveries.filter(d => d.status === 'In Transit').length;
  const delayedDeliveries = store.deliveries.filter(d => d.status === 'Delayed').length;
  const deliveredToday = store.deliveries.filter(d => d.status === 'Delivered').length;

  res.json({
    roads: {
      total: totalRoads,
      accessible: accessibleRoads,
      blocked: blockedRoads,
      caution: cautionRoads,
      accessibilityRatio: Number(((accessibleRoads / (totalRoads || 1)) * 100).toFixed(1))
    },
    incidents: {
      total: totalIncidents,
      active: activeIncidents,
      pendingVerification: pendingIncidents
    },
    deliveries: {
      inTransit: activeDeliveries,
      delayed: delayedDeliveries,
      deliveredToday
    },
    fleet: {
      totalVehicles: store.vehicles.length,
      activeInTransit: store.vehicles.filter(v => v.status === 'IN_TRANSIT').length,
      idle: store.vehicles.filter(v => v.status === 'IDLE').length
    }
  });
});

apiRouter.get('/audit-logs', (req: Request, res: Response) => {
  res.json(store.auditLogs);
});

// ----------------------------------------------------
// AI Services: Risk Prediction & Gemini Briefing
// ----------------------------------------------------
apiRouter.post('/ai/predict-risk', (req: Request, res: Response) => {
  const { roadId } = req.body;
  const targetRoadId = roadId || store.roads[0]?.id;
  const prediction = calculateRiskPrediction(targetRoadId);
  res.json(prediction);
});

apiRouter.post('/ai/briefing', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    const briefing = await generateSituationalBriefing(query);
    res.json(briefing);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate briefing', details: err?.message });
  }
});

// ----------------------------------------------------
// Offline Sync Batch Endpoint
// ----------------------------------------------------
apiRouter.post('/sync/batch', (req: Request, res: Response) => {
  const { userId, userName } = getUserContext(req);
  const { items } = req.body; // array of sync items

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'items array is required' });
  }

  const results: { id: string; success: boolean; error?: string }[] = [];

  for (const item of items) {
    try {
      if (item.type === 'INCIDENT_CREATE') {
        const payload = item.payload;
        const newInc: Incident = {
          id: 'inc-sync-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          type: payload.type || 'Road Blockage',
          title: payload.title || 'Offline Field Report',
          description: payload.description || 'Reported from remote location',
          latitude: payload.latitude,
          longitude: payload.longitude,
          roadId: payload.roadId || store.roads[0].id,
          roadName: payload.roadName || store.roads[0].name,
          districtId: payload.districtId || store.districts[0].id,
          districtName: payload.districtName || store.districts[0].name,
          state: 'Northeast Region',
          severity: payload.severity || 'MEDIUM',
          status: 'Pending Verification',
          photoUrl: payload.photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80',
          reporterId: payload.reporterId || userId,
          reporterName: payload.reporterName || userName,
          reporterRole: payload.reporterRole || 'FIELD_OFFICER',
          createdAt: payload.timestamp || new Date().toISOString(),
          isOfflineSubmitted: true
        };
        store.incidents.unshift(newInc);
        store.logAction(userId, userName, 'SYNC_OFFLINE_INCIDENT', 'Incident', newInc.id, 'Synced incident created during network disconnection');
        results.push({ id: item.id, success: true });
      } else if (item.type === 'DELIVERY_STATUS_UPDATE') {
        const payload = item.payload;
        const del = store.deliveries.find(d => d.id === payload.deliveryId);
        if (del) {
          del.status = payload.status;
          del.updatedAt = new Date().toISOString();
          store.logAction(userId, userName, 'SYNC_OFFLINE_DELIVERY', 'Delivery', del.id, `Synced status update: ${payload.status}`);
          results.push({ id: item.id, success: true });
        } else {
          results.push({ id: item.id, success: false, error: 'Delivery record not found' });
        }
      } else {
        results.push({ id: item.id, success: true });
      }
    } catch (e: any) {
      results.push({ id: item.id, success: false, error: e?.message || 'Sync error' });
    }
  }

  res.json({ success: true, processedCount: results.length, results });
});
