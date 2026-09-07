/**
 * RouteMind NER Logistics Intelligence Platform
 * Field Incident Reporting Modal in Claymorphism Aesthetics
 */

import React, { useState } from 'react';
import { Road, District, IncidentType, IncidentSeverity } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  AlertTriangle,
  Camera,
  MapPin,
  X,
  Upload,
  WifiOff,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface IncidentReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roads: Road[];
  districts: District[];
  onSubmit: (incident: any) => Promise<void>;
  isOnline: boolean;
}

const INCIDENT_TYPES: IncidentType[] = [
  'Landslide',
  'Road Blockage',
  'Flood',
  'Bridge Damage',
  'Road Damage',
  'Traffic',
  'Accident',
  'Weather Hazard',
  'Other'
];

export const IncidentReportingModal: React.FC<IncidentReportingModalProps> = ({
  isOpen,
  onClose,
  roads,
  districts,
  onSubmit,
  isOnline
}) => {
  const { t } = useLanguage();
  const [type, setType] = useState<IncidentType>('Landslide');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roadId, setRoadId] = useState(roads[0]?.id || 'road-nh-13');
  const [districtId, setDistrictId] = useState(districts[1]?.id || 'dist-tawang');
  const [severity, setSeverity] = useState<IncidentSeverity>('HIGH');
  const [latitude, setLatitude] = useState<number>(27.502);
  const [longitude, setLongitude] = useState<number>(92.100);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCaptureGps = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLatitude(Number(pos.coords.latitude.toFixed(4)));
          setLongitude(Number(pos.coords.longitude.toFixed(4)));
          setGpsLoading(false);
        },
        err => {
          console.warn('Geolocation failed or denied, using road waypoint:', err);
          const road = roads.find(r => r.id === roadId);
          if (road && road.coordinates[0]) {
            setLatitude(road.coordinates[0].lat);
            setLongitude(road.coordinates[0].lng);
          }
          setGpsLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      setGpsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    setIsSubmitting(true);
    try {
      const selectedRoad = roads.find(r => r.id === roadId);
      const selectedDistrict = districts.find(d => d.id === districtId);

      await onSubmit({
        type,
        title: title || `${type} on ${selectedRoad?.code || 'Arterial Highway'}`,
        description,
        roadId,
        roadName: selectedRoad?.name,
        districtId,
        districtName: selectedDistrict?.name,
        severity,
        latitude,
        longitude,
        photoUrl
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="clay-card w-full max-w-lg rounded-[2rem] p-6 text-slate-800 shadow-[14px_18px_36px_rgba(148,163,184,0.35),-10px_-10px_24px_rgba(255,255,255,0.9)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-[3px_4px_10px_rgba(249,115,22,0.35)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800">
                {t('reportHazard')}
              </h3>
              <p className="text-xs text-slate-500">
                Field dispatch for BRO, NDRF & District Authorities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* Offline Notice Banner if Disconnected */}
        {!isOnline && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-950">
            <WifiOff className="w-4 h-4 text-orange-600 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> Report will be securely queued in local IndexedDB and automatically synced upon network recovery.
            </span>
          </div>
        )}

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="mt-4 overflow-y-auto space-y-4 text-xs pr-1 flex-1">
          {/* Incident Type & Severity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Hazard Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as IncidentType)}
                className="clay-input w-full px-3 py-2 text-xs text-slate-800"
              >
                {INCIDENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as IncidentSeverity)}
                className="clay-input w-full px-3 py-2 text-xs text-slate-800 font-bold"
              >
                <option value="LOW">LOW (Slow Traffic)</option>
                <option value="MEDIUM">MEDIUM (Caution / Scour)</option>
                <option value="HIGH">HIGH (Single Lane Block)</option>
                <option value="CRITICAL">CRITICAL (Road Total Block)</option>
              </select>
            </div>
          </div>

          {/* Highway & District */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Arterial Highway
              </label>
              <select
                value={roadId}
                onChange={e => {
                  setRoadId(e.target.value);
                  const selectedRoad = roads.find(r => r.id === e.target.value);
                  if (selectedRoad) {
                    setDistrictId(selectedRoad.districtId);
                    if (selectedRoad.coordinates[0]) {
                      setLatitude(selectedRoad.coordinates[0].lat);
                      setLongitude(selectedRoad.coordinates[0].lng);
                    }
                  }
                }}
                className="clay-input w-full px-3 py-2 text-xs text-slate-800"
              >
                {roads.map(r => (
                  <option key={r.id} value={r.id}>{r.code} - {r.name.slice(0, 22)}...</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                District Jurisdiction
              </label>
              <select
                value={districtId}
                onChange={e => setDistrictId(e.target.value)}
                className="clay-input w-full px-3 py-2 text-xs text-slate-800"
              >
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Headline / Summary
            </label>
            <input
              type="text"
              placeholder="e.g. Major rockslide 2km before Sela Tunnel West Portal"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="clay-input w-full px-3 py-2 text-xs text-slate-800"
            />
          </div>

          {/* GPS Coordinates with One-Touch Capture */}
          <div className="clay-inset p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                Geotag Location (GPS)
              </span>
              <button
                type="button"
                onClick={handleCaptureGps}
                disabled={gpsLoading}
                className="clay-btn clay-btn-light px-3 py-1 text-[10px] font-bold flex items-center gap-1 rounded-xl"
              >
                {gpsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3 text-orange-500" />}
                Auto-Capture GPS
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">Latitude:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={e => setLatitude(parseFloat(e.target.value))}
                  className="clay-input w-full px-2.5 py-1.5 text-xs font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">Longitude:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={e => setLongitude(parseFloat(e.target.value))}
                  className="clay-input w-full px-2.5 py-1.5 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Photo Evidence */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-orange-500" />
              Incident Photo Evidence
            </label>
            <div className="flex items-center gap-3">
              {photoUrl && (
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-[2px_3px_6px_rgba(0,0,0,0.15)] shrink-0">
                  <img src={photoUrl} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="text"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                placeholder="Photo URL or camera attachment link"
                className="clay-input flex-1 px-3 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Field Observations & Impact
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe debris volume, lane coverage, structural condition, machinery needed (e.g. JCB excavators), and weather..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="clay-input w-full px-3 py-2 text-xs text-slate-800 leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="clay-btn clay-btn-light px-4 py-2 text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="clay-btn clay-btn-coral px-5 py-2.5 text-xs flex items-center gap-1.5 rounded-xl font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  Submit Field Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
