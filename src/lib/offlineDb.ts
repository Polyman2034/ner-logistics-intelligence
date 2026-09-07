/**
 * PANDAVAS NER Logistics Intelligence Platform
 * Offline-First Storage & Synchronization Engine (IndexedDB + Dexie.js)
 */

import Dexie, { Table } from 'dexie';
import { Incident, Delivery, Road, SyncQueueItem } from '../types';

export interface OfflineIncidentRecord {
  localId: string;
  type: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  roadId: string;
  roadName: string;
  districtId: string;
  districtName: string;
  severity: string;
  photoUrl?: string;
  reporterId: string;
  reporterName: string;
  reporterRole: string;
  timestamp: string;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
}

export interface OfflineDeliveryStatusRecord {
  localId: string;
  deliveryId: string;
  status: string;
  driverId: string;
  timestamp: string;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
  notes?: string;
}

export class PandavasDatabase extends Dexie {
  offlineIncidents!: Table<OfflineIncidentRecord, string>;
  offlineDeliveryUpdates!: Table<OfflineDeliveryStatusRecord, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  cachedRoads!: Table<Road, string>;
  cachedDeliveries!: Table<Delivery, string>;

  constructor() {
    super('PandavasOfflineDB');
    this.version(1).stores({
      offlineIncidents: 'localId, syncStatus, timestamp, roadId, districtId',
      offlineDeliveryUpdates: 'localId, deliveryId, syncStatus, timestamp',
      syncQueue: 'id, status, type, createdAt',
      cachedRoads: 'id, code, status, districtId',
      cachedDeliveries: 'id, trackingCode, status, driverId'
    });
  }
}

export const offlineDb = new PandavasDatabase();

// Helper to record an offline incident report
export async function queueOfflineIncident(incident: Partial<Incident>): Promise<OfflineIncidentRecord> {
  const localId = 'off-inc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
  const record: OfflineIncidentRecord = {
    localId,
    type: incident.type || 'Road Blockage',
    title: incident.title || 'Field Incident',
    description: incident.description || '',
    latitude: incident.latitude || 26.144,
    longitude: incident.longitude || 91.736,
    roadId: incident.roadId || 'road-nh-27',
    roadName: incident.roadName || 'NH-27 Corridor',
    districtId: incident.districtId || 'dist-kamrup',
    districtName: incident.districtName || 'Kamrup Metro',
    severity: incident.severity || 'MEDIUM',
    photoUrl: incident.photoUrl,
    reporterId: incident.reporterId || 'usr-field-03',
    reporterName: incident.reporterName || 'Field Officer',
    reporterRole: incident.reporterRole || 'FIELD_OFFICER',
    timestamp: new Date().toISOString(),
    syncStatus: 'PENDING'
  };

  await offlineDb.offlineIncidents.put(record);

  // Add to central sync queue
  await offlineDb.syncQueue.put({
    id: localId,
    type: 'INCIDENT_CREATE',
    payload: record,
    createdAt: Date.now(),
    retryCount: 0,
    status: 'PENDING'
  });

  return record;
}

// Helper to record an offline delivery status change
export async function queueOfflineDeliveryUpdate(
  deliveryId: string,
  status: string,
  driverId: string,
  notes?: string
): Promise<OfflineDeliveryStatusRecord> {
  const localId = 'off-del-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
  const record: OfflineDeliveryStatusRecord = {
    localId,
    deliveryId,
    status,
    driverId,
    timestamp: new Date().toISOString(),
    syncStatus: 'PENDING',
    notes
  };

  await offlineDb.offlineDeliveryUpdates.put(record);

  // Add to central sync queue
  await offlineDb.syncQueue.put({
    id: localId,
    type: 'DELIVERY_STATUS_UPDATE',
    payload: record,
    createdAt: Date.now(),
    retryCount: 0,
    status: 'PENDING'
  });

  return record;
}

// Get count of pending items in sync queue
export async function getPendingSyncCount(): Promise<number> {
  try {
    return await offlineDb.syncQueue.where('status').equals('PENDING').count();
  } catch (err) {
    console.warn('Error reading sync queue count:', err);
    return 0;
  }
}

// Cache application data for offline reading
export async function cacheEssentialData(roads: Road[], deliveries: Delivery[]): Promise<void> {
  try {
    await offlineDb.cachedRoads.clear();
    await offlineDb.cachedRoads.bulkPut(roads);
    await offlineDb.cachedDeliveries.clear();
    await offlineDb.cachedDeliveries.bulkPut(deliveries);
  } catch (err) {
    console.warn('Failed to cache data for offline access:', err);
  }
}
