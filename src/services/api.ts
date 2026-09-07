/**
 * PANDAVAS NER Logistics Intelligence Platform
 * Frontend API Service Layer with Offline Dexie Integration & RBAC Headers
 */

import {
  User,
  UserRole,
  Road,
  Incident,
  Vehicle,
  Delivery,
  WeatherObservation,
  Alert,
  AuditLog,
  RiskPrediction,
  RouteOption
} from '../types';
import {
  offlineDb,
  queueOfflineIncident,
  queueOfflineDeliveryUpdate,
  cacheEssentialData
} from '../lib/offlineDb';

let currentUserRole: UserRole = 'GOVERNMENT_ADMIN';
let currentUserId: string = 'usr-gov-01';

export function setApiAuthContext(role: UserRole, userId: string) {
  currentUserRole = role;
  currentUserId = userId;
}

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'x-user-role': currentUserRole,
    'x-user-id': currentUserId
  };
}

export const api = {
  // Auth
  async login(roleOrUser: { role?: UserRole; username?: string; password?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(roleOrUser)
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    setApiAuthContext(data.user.role, data.user.id);
    return data;
  },

  async register(userData: any): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Registration failed');
    const data = await res.json();
    setApiAuthContext(data.user.role, data.user.id);
    return data;
  },

  // Roads
  async getRoads(): Promise<Road[]> {
    try {
      const res = await fetch('/api/roads', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        // Update local cache
        cacheEssentialData(data, []).catch(() => {});
        return data;
      }
    } catch (e) {
      console.warn('Network unavailable, fetching cached roads from IndexedDB');
    }
    // Fallback to IndexedDB
    const cached = await offlineDb.cachedRoads.toArray();
    return cached;
  },

  async updateRoadStatus(roadId: string, status: string, delayMinutes?: number): Promise<Road> {
    const res = await fetch(`/api/roads/${roadId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, delayMinutes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update road status');
    }
    const data = await res.json();
    return data.road;
  },

  // Incidents
  async getIncidents(): Promise<Incident[]> {
    try {
      const res = await fetch('/api/incidents', { headers: getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Network unavailable fetching incidents');
    }
    return [];
  },

  async reportIncident(incidentData: Partial<Incident>, isOnline: boolean): Promise<Incident | any> {
    if (!isOnline) {
      // Queue into IndexedDB Dexie
      const queued = await queueOfflineIncident(incidentData);
      return {
        id: queued.localId,
        ...queued,
        status: 'Pending Verification',
        isOfflineSubmitted: true
      };
    }

    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(incidentData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to report incident');
    }
    const data = await res.json();
    return data.incident;
  },

  async verifyIncident(incidentId: string): Promise<Incident> {
    const res = await fetch(`/api/incidents/${incidentId}/verify`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Verification forbidden or failed');
    }
    const data = await res.json();
    return data.incident;
  },

  async rejectIncident(incidentId: string, reason: string): Promise<Incident> {
    const res = await fetch(`/api/incidents/${incidentId}/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Rejection forbidden or failed');
    }
    const data = await res.json();
    return data.incident;
  },

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    const res = await fetch('/api/vehicles', { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return await res.json();
  },

  async updateVehicleLocation(vehicleId: string, lat: number, lng: number, speed?: number, heading?: number): Promise<Vehicle> {
    const res = await fetch('/api/tracking/location', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ vehicleId, latitude: lat, longitude: lng, speed, heading })
    });
    if (!res.ok) throw new Error('Failed to update GPS telemetry');
    const data = await res.json();
    return data.vehicle;
  },

  // Deliveries
  async getDeliveries(): Promise<Delivery[]> {
    try {
      const res = await fetch('/api/deliveries', { headers: getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Network offline, reading cached deliveries');
    }
    return await offlineDb.cachedDeliveries.toArray();
  },

  async createDelivery(deliveryData: any): Promise<Delivery> {
    const res = await fetch('/api/deliveries', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(deliveryData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to dispatch delivery');
    }
    const data = await res.json();
    return data.delivery;
  },

  async updateDeliveryStatus(deliveryId: string, status: string, isOnline: boolean, notes?: string): Promise<any> {
    if (!isOnline) {
      return await queueOfflineDeliveryUpdate(deliveryId, status, currentUserId, notes);
    }

    const res = await fetch(`/api/deliveries/${deliveryId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Failed to update delivery status');
    return await res.json();
  },

  // Routing & AI
  async optimizeRoute(req: any): Promise<{ primary: RouteOption; alternate: RouteOption; recommendation: string }> {
    const res = await fetch('/api/routes/optimize', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error('Route optimization request failed');
    return await res.json();
  },

  async getAiBriefing(query?: string): Promise<{
    title: string;
    summary: string;
    keyHazards: string[];
    recommendedActions: string[];
    timestamp: string;
    source: 'GEMINI_AI' | 'HEURISTIC_NER_ENGINE';
  }> {
    const res = await fetch('/api/ai/briefing', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('AI briefing request failed');
    return await res.json();
  },

  // Emergency Mode
  async getEmergencyStatus(): Promise<any> {
    const res = await fetch('/api/emergency/status', { headers: getHeaders() });
    return await res.json();
  },

  async toggleEmergency(): Promise<any> {
    const res = await fetch('/api/emergency/toggle', {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Emergency toggle forbidden');
    }
    return await res.json();
  },

  // Weather & Alerts
  async getWeather(): Promise<WeatherObservation[]> {
    const res = await fetch('/api/weather', { headers: getHeaders() });
    return await res.json();
  },

  async getAlerts(): Promise<Alert[]> {
    const res = await fetch('/api/alerts', { headers: getHeaders() });
    return await res.json();
  },

  async markAlertsRead(alertId?: string): Promise<void> {
    await fetch('/api/alerts/mark-read', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ alertId })
    });
  },

  // Analytics & Audit
  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics', { headers: getHeaders() });
    return await res.json();
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/audit-logs', { headers: getHeaders() });
    return await res.json();
  },

  // Offline Sync Batch
  async syncOfflineQueue(): Promise<{ syncedCount: number }> {
    const pendingItems = await offlineDb.syncQueue.where('status').equals('PENDING').toArray();
    if (pendingItems.length === 0) return { syncedCount: 0 };

    const res = await fetch('/api/sync/batch', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ items: pendingItems })
    });

    if (res.ok) {
      const data = await res.json();
      // Mark synced in Dexie
      for (const result of data.results) {
        if (result.success) {
          await offlineDb.syncQueue.update(result.id, { status: 'COMPLETED' });
        }
      }
      return { syncedCount: data.processedCount };
    }
    return { syncedCount: 0 };
  }
};
