/**
 * PANDAVAS NER Logistics Intelligence Platform
 * Server Data Store & Relational Simulation Layer
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
  RiskPrediction,
  RouteOption
} from '../src/types';
import {
  INITIAL_USERS,
  INITIAL_DISTRICTS,
  INITIAL_ROADS,
  INITIAL_INCIDENTS,
  INITIAL_VEHICLES,
  INITIAL_DELIVERIES,
  INITIAL_WEATHER,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_RISK_PREDICTIONS
} from '../src/data/mockData';

class DataStore {
  public users: User[] = [...INITIAL_USERS];
  public districts: District[] = [...INITIAL_DISTRICTS];
  public roads: Road[] = [...INITIAL_ROADS];
  public incidents: Incident[] = [...INITIAL_INCIDENTS];
  public vehicles: Vehicle[] = [...INITIAL_VEHICLES];
  public deliveries: Delivery[] = [...INITIAL_DELIVERIES];
  public weather: WeatherObservation[] = [...INITIAL_WEATHER];
  public alerts: Alert[] = [...INITIAL_ALERTS];
  public auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  public riskPredictions: RiskPrediction[] = [...INITIAL_RISK_PREDICTIONS];

  public emergencyMode: {
    active: boolean;
    activatedBy: string;
    activatedAt: string;
    focusCorridors: string[];
    notice: string;
  } = {
    active: false,
    activatedBy: 'System',
    activatedAt: new Date().toISOString(),
    focusCorridors: ['NH-10 Sevoke-Gangtok', 'NH-13 Sela Pass', 'NH-6 Byrnihat-Shillong'],
    notice: 'Standing standby for monsoon response operations.'
  };

  // Add audit log
  public logAction(userId: string, userName: string, action: string, entity: string, entityId: string, details: string) {
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      userId,
      userName,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }

  // Update vehicle GPS and simulate movement
  public updateVehicleLocation(vehicleId: string, lat: number, lng: number, speed?: number, heading?: number) {
    const v = this.vehicles.find(item => item.id === vehicleId);
    if (v) {
      v.currentLat = lat;
      v.currentLng = lng;
      if (typeof speed === 'number') v.speedKmh = speed;
      if (typeof heading === 'number') v.heading = heading;
      v.lastPing = 'Just now';
      return v;
    }
    return null;
  }

  // Find user by ID or username
  public findUser(identifier: string): User | undefined {
    return this.users.find(u => u.id === identifier || u.username === identifier || u.email === identifier);
  }

  // Calculate distance in KM using Haversine formula (GIS)
  public calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }
}

export const store = new DataStore();
