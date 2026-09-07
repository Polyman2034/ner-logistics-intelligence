/**
 * RouteMind NER Logistics Intelligence Platform
 * Interactive GIS Engine with Road Accessibility, Incidents, Telemetry & Risk Zones
 */

import React, { useState, useEffect, useRef } from 'react';
import { Road, Incident, Vehicle, Delivery, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  AlertTriangle,
  Truck,
  Shield,
  Navigation,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  MapPin,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface GisMapProps {
  roads: Road[];
  incidents: Incident[];
  vehicles: Vehicle[];
  deliveries: Delivery[];
  currentUserRole: UserRole;
  emergencyModeActive: boolean;
  selectedEntity?: { type: 'road' | 'incident' | 'vehicle' | 'delivery'; id: string } | null;
  onSelectEntity?: (entity: { type: 'road' | 'incident' | 'vehicle' | 'delivery'; id: string } | null) => void;
  onVerifyIncident?: (id: string) => void;
}

export const GisMap: React.FC<GisMapProps> = ({
  roads,
  incidents,
  vehicles,
  deliveries,
  currentUserRole,
  emergencyModeActive,
  selectedEntity,
  onSelectEntity,
  onVerifyIncident
}) => {
  const { t } = useLanguage();

  // Layer toggles
  const [showRoads, setShowRoads] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showEmergencyRoutes, setShowEmergencyRoutes] = useState(true);

  // Map viewport & pan/zoom state for GIS visualization
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Selected item modal/details drawer
  const [activePopup, setActivePopup] = useState<any | null>(null);

  // Northeast India geographic bounds
  // Lat: ~23.0 to 28.5, Lng: ~88.0 to 95.0
  const minLng = 88.0;
  const maxLng = 95.5;
  const minLat = 23.0;
  const maxLat = 28.5;

  // Convert geo coordinates (lng, lat) to SVG coordinate space (800 x 600)
  const projectCoords = (lat: number, lng: number) => {
    const width = 840;
    const height = 580;
    const padding = 50;

    const x = padding + ((lng - minLng) / (maxLng - minLng)) * (width - padding * 2);
    // Invert lat for SVG y-axis
    const y = height - (padding + ((lat - minLat) / (maxLat - minLat)) * (height - padding * 2));

    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset zoom & pan
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActivePopup(null);
  };

  return (
    <div className="clay-card relative w-full h-[640px] overflow-hidden rounded-[2.25rem] p-1.5 select-none shadow-[12px_16px_32px_rgba(148,163,184,0.3),-8px_-8px_20px_rgba(255,255,255,0.95)]">
      {/* Dark Vector GIS Screen Container */}
      <div className="relative w-full h-full bg-[#111620] rounded-[2rem] overflow-hidden">
        {/* Top Map HUD Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
          {/* Region & Coordinate Indicator */}
          <div className="pointer-events-auto flex items-center gap-2.5 bg-white/95 backdrop-blur-md text-slate-800 px-4 py-2 rounded-2xl shadow-[4px_6px_14px_rgba(0,0,0,0.18),inset_1px_1px_2px_rgba(255,255,255,0.9)]">
            <div className={`w-2.5 h-2.5 rounded-full ${emergencyModeActive ? 'bg-orange-500 animate-ping' : 'bg-emerald-500'}`} />
            <span className="text-[11px] font-bold text-slate-800">
              {emergencyModeActive ? 'EMERGENCY GIS: PRIORITY CORRIDORS' : 'NER ARTERIAL GIS LIVE'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono border-l border-slate-200 pl-2">
              88.0°E - 95.5°E | 23.0°N - 28.5°N
            </span>
          </div>

          {/* Map Layer Controls */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-[4px_6px_14px_rgba(0,0,0,0.18),inset_1px_1px_2px_rgba(255,255,255,0.9)] text-[11px] font-bold">
            <button
              onClick={() => setShowRoads(!showRoads)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                showRoads
                  ? 'clay-btn-primary text-white shadow-[2px_3px_8px_rgba(99,102,241,0.4)]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('highways')} ({roads.length})
            </button>
            <button
              onClick={() => setShowIncidents(!showIncidents)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                showIncidents
                  ? 'clay-btn-coral text-white shadow-[2px_3px_8px_rgba(249,115,22,0.4)]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('hazards')} ({incidents.filter(i => i.status !== 'Resolved').length})
            </button>
            <button
              onClick={() => setShowVehicles(!showVehicles)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                showVehicles
                  ? 'clay-btn-emerald text-white shadow-[2px_3px_8px_rgba(16,185,129,0.4)]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('vehicles')} ({vehicles.length})
            </button>
            <button
              onClick={() => setShowRiskZones(!showRiskZones)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                showRiskZones
                  ? 'bg-amber-100 text-amber-900 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9)]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('riskZones')}
            </button>
          </div>
        </div>

        {/* Floating Zoom & Pan Controls */}
        <div className="absolute right-4 bottom-5 z-20 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.3, 3.5))}
            className="w-10 h-10 rounded-2xl bg-white text-slate-700 hover:text-indigo-600 flex items-center justify-center shadow-[3px_4px_10px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.9)] active:scale-95 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.3, 0.7))}
            className="w-10 h-10 rounded-2xl bg-white text-slate-700 hover:text-indigo-600 flex items-center justify-center shadow-[3px_4px_10px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.9)] active:scale-95 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="w-10 h-10 rounded-2xl bg-white text-slate-700 hover:text-indigo-600 flex items-center justify-center shadow-[3px_4px_10px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.9)] active:scale-95 transition-all"
            title="Reset Viewport"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Road Accessibility Legend */}
        <div className="absolute left-4 bottom-5 z-20 pointer-events-auto bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-[4px_6px_14px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.9)] text-[11px] text-slate-700 space-y-2">
          <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5 pb-1 border-b border-slate-200">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Accessibility Status
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1.5 bg-emerald-500 rounded-full" />
            <span className="font-medium">Accessible (Clear corridor)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1.5 bg-amber-400 rounded-full" />
            <span className="font-medium">Caution (Partial / Scour)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1.5 bg-orange-500 rounded-full" />
            <span className="font-medium">Blocked (Landslide / Flood)</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping inline-block" />
            <span className="text-orange-600 font-bold text-[10px] uppercase tracking-wider">Active Landslide</span>
          </div>
        </div>

      {/* Main Interactive Vector / GIS Map Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`w-full h-full cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
      >
        <svg
          viewBox="0 0 840 580"
          className="w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          {/* Defs for gradients, patterns and glow filters */}
          <defs>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="corridor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            {/* Mountain terrain contour background pattern */}
            <pattern id="contour-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.35)" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="840" height="580" fill="#0f172a" />
          <rect width="840" height="580" fill="url(#contour-grid)" />

          {/* Northeast India State Boundaries (Stylized Polygons) */}
          {/* Assam Valley */}
          <path
            d="M 240 280 Q 320 250 480 240 L 590 220 L 580 280 L 490 310 L 320 330 Z"
            fill="rgba(30, 41, 59, 0.4)"
            stroke="rgba(71, 85, 105, 0.4)"
            strokeWidth="1"
          />
          {/* Arunachal Pradesh Mountain Arc */}
          <path
            d="M 380 90 L 580 80 L 730 140 L 680 210 L 460 210 L 380 180 Z"
            fill="rgba(51, 65, 85, 0.25)"
            stroke="rgba(71, 85, 105, 0.4)"
            strokeWidth="1"
          />
          {/* Meghalaya Plateau */}
          <path
            d="M 320 340 L 460 330 L 450 390 L 310 380 Z"
            fill="rgba(30, 41, 59, 0.5)"
            stroke="rgba(71, 85, 105, 0.4)"
            strokeWidth="1"
          />
          {/* Sikkim Enclave */}
          <path
            d="M 120 180 L 160 170 L 170 230 L 130 240 Z"
            fill="rgba(30, 41, 59, 0.5)"
            stroke="rgba(71, 85, 105, 0.4)"
            strokeWidth="1"
          />
          {/* Nagaland / Manipur / Mizoram Corridor */}
          <path
            d="M 580 290 L 660 300 L 640 440 L 570 470 L 540 370 Z"
            fill="rgba(30, 41, 59, 0.3)"
            stroke="rgba(71, 85, 105, 0.4)"
            strokeWidth="1"
          />

          {/* District Center Markers & Names */}
          <g className="district-labels opacity-65 pointer-events-none">
            <text x="350" y="310" fill="#94a3b8" fontSize="10" fontWeight="600">Guwahati (Kamrup)</text>
            <text x="370" y="375" fill="#94a3b8" fontSize="10" fontWeight="600">Shillong</text>
            <text x="375" y="160" fill="#cbd5e1" fontSize="10" fontWeight="600">Tawang (BRO Sector)</text>
            <text x="110" y="210" fill="#cbd5e1" fontSize="10" fontWeight="600">Gangtok (Sikkim)</text>
            <text x="610" y="340" fill="#94a3b8" fontSize="10" fontWeight="600">Kohima</text>
            <text x="600" y="410" fill="#94a3b8" fontSize="10" fontWeight="600">Imphal</text>
            <text x="510" y="490" fill="#94a3b8" fontSize="10" fontWeight="600">Aizawl</text>
            <text x="470" y="405" fill="#94a3b8" fontSize="10" fontWeight="600">Silchar (Barak Gateway)</text>
          </g>

          {/* High-Risk Zones (Rainfall / Landslide hazard bubbles) */}
          {showRiskZones && (
            <g className="risk-zones">
              {/* Tawang High Alpine Hazard Zone */}
              <circle
                cx={projectCoords(27.50, 92.10).x}
                cy={projectCoords(27.50, 92.10).y}
                r="38"
                fill="rgba(244, 63, 94, 0.14)"
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              {/* Teesta Flood Inundation Zone */}
              <circle
                cx={projectCoords(27.05, 88.49).x}
                cy={projectCoords(27.05, 88.49).y}
                r="34"
                fill="rgba(244, 63, 94, 0.16)"
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              {/* Khasi Hills Cloudburst Hazard Zone */}
              <circle
                cx={projectCoords(25.57, 91.89).x}
                cy={projectCoords(25.57, 91.89).y}
                r="30"
                fill="rgba(245, 158, 11, 0.12)"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </g>
          )}

          {/* Arterial Highways (Roads) */}
          {showRoads && roads.map(road => {
            if (road.coordinates.length < 2) return null;

            // Generate SVG path string from coordinates
            const points = road.coordinates.map(c => projectCoords(c.lat, c.lng));
            const pathD = points.reduce((acc, p, idx) => {
              return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
            }, '');

            let strokeColor = '#10b981'; // Green: ACCESSIBLE
            let strokeWidth = 3.5;
            let dashArray = 'none';

            if (road.status === 'BLOCKED') {
              strokeColor = '#f43f5e'; // Red: BLOCKED
              strokeWidth = 4.5;
              dashArray = '6 3';
            } else if (road.status === 'CAUTION') {
              strokeColor = '#f59e0b'; // Amber: CAUTION
              strokeWidth = 3.5;
            }

            const isSelected = selectedEntity?.type === 'road' && selectedEntity.id === road.id;

            return (
              <g key={road.id} className="cursor-pointer group" onClick={() => setActivePopup({ type: 'road', data: road })}>
                {/* Thick invisible hit-target for easy clicking */}
                <path d={pathD} fill="none" stroke="transparent" strokeWidth="18" />
                {/* Visual highway line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSelected ? strokeWidth + 2 : strokeWidth}
                  strokeDasharray={dashArray}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={road.status === 'BLOCKED' ? 'url(#glow-red)' : 'none'}
                  className="transition-all hover:stroke-white"
                />
                {/* Mid-point Code Tag */}
                {points.length > 1 && (
                  <text
                    x={points[Math.floor(points.length / 2)].x}
                    y={points[Math.floor(points.length / 2)].y - 7}
                    fill={strokeColor}
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                    className="select-none bg-slate-900 px-1"
                  >
                    {road.code}
                  </text>
                )}
              </g>
            );
          })}

          {/* Active Deliveries / Moving Trajectories */}
          {deliveries.map(del => {
            const start = projectCoords(del.originCoords.lat, del.originCoords.lng);
            const end = projectCoords(del.destinationCoords.lat, del.destinationCoords.lng);
            return (
              <g key={del.id} className="pointer-events-none opacity-40">
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* Incident / Hazard Markers */}
          {showIncidents && incidents.map(inc => {
            if (inc.status === 'Resolved' || inc.status === 'Rejected') return null;
            const p = projectCoords(inc.latitude, inc.longitude);
            const isCritical = inc.severity === 'CRITICAL';

            return (
              <g
                key={inc.id}
                transform={`translate(${p.x}, ${p.y})`}
                onClick={() => setActivePopup({ type: 'incident', data: inc })}
                className="cursor-pointer group"
              >
                {isCritical && (
                  <circle r="14" fill="rgba(244, 63, 94, 0.35)" className="animate-ping" />
                )}
                <circle
                  r="7.5"
                  fill={isCritical ? '#f43f5e' : '#f59e0b'}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125 shadow-lg"
                />
                <circle r="2.5" fill="#ffffff" />
              </g>
            );
          })}

          {/* Fleet Vehicle Markers */}
          {showVehicles && vehicles.map(veh => {
            const p = projectCoords(veh.currentLat, veh.currentLng);
            const isInTransit = veh.status === 'IN_TRANSIT';

            return (
              <g
                key={veh.id}
                transform={`translate(${p.x}, ${p.y})`}
                onClick={() => setActivePopup({ type: 'vehicle', data: veh })}
                className="cursor-pointer group"
              >
                {isInTransit && (
                  <circle r="12" fill="rgba(56, 189, 248, 0.25)" className="animate-pulse" />
                )}
                <rect
                  x="-7"
                  y="-7"
                  width="14"
                  height="14"
                  rx="3"
                  fill={isInTransit ? '#0284c7' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-transform group-hover:scale-125"
                />
                <text
                  x="0"
                  y="14"
                  fill="#94a3b8"
                  fontSize="8"
                  fontWeight="600"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {veh.registrationNo.split('-')[0]}-{veh.registrationNo.split('-')[1]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Entity Details Popup Card / Drawer */}
      {activePopup && (
        <div className="clay-card absolute top-14 right-4 z-30 w-84 p-5 text-slate-800 animate-in fade-in slide-in-from-right-4 duration-200 shadow-[8px_12px_24px_rgba(0,0,0,0.25)]">
          <div className="flex items-start justify-between pb-2 mb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 block">
                {activePopup.type === 'road' ? 'Arterial Corridor' : activePopup.type === 'incident' ? 'Active Field Hazard' : 'Fleet Telemetry'}
              </span>
              <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1 mt-0.5">
                {activePopup.type === 'road' && `${activePopup.data.code} - ${activePopup.data.name}`}
                {activePopup.type === 'incident' && activePopup.data.title}
                {activePopup.type === 'vehicle' && `${activePopup.data.registrationNo} (${activePopup.data.type})`}
              </h4>
            </div>
            <button
              onClick={() => setActivePopup(null)}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Road Popup Details */}
          {activePopup.type === 'road' && (
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-bold">Accessibility:</span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                    activePopup.data.status === 'ACCESSIBLE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activePopup.data.status === 'BLOCKED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {activePopup.data.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-bold">Length:</span>
                <span className="text-slate-800 font-mono font-bold">{activePopup.data.lengthKm} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-bold">Estimated Delay:</span>
                <span className="text-slate-800 font-mono font-bold">{activePopup.data.estimatedDelayMinutes} mins</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-bold">Weather:</span>
                <span className="text-slate-800 font-medium">{activePopup.data.weatherCondition}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-bold">AI Risk Score:</span>
                <span className="text-orange-600 font-mono font-bold">{activePopup.data.riskScore}/100</span>
              </div>
            </div>
          )}

          {/* Incident Popup Details */}
          {activePopup.type === 'incident' && (
            <div className="space-y-3 text-xs">
              {activePopup.data.photoUrl && (
                <div className="relative w-full h-28 overflow-hidden rounded-2xl shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]">
                  <img
                    src={activePopup.data.photoUrl}
                    alt={activePopup.data.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono font-bold text-white uppercase rounded-md">
                    {activePopup.data.severity}
                  </div>
                </div>
              )}
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {activePopup.data.description}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
                <span>By: {activePopup.data.reporterName}</span>
                <span>{activePopup.data.latitude.toFixed(3)}, {activePopup.data.longitude.toFixed(3)}</span>
              </div>
              {/* District Authority Verification Action */}
              {activePopup.data.status === 'Pending Verification' && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (onVerifyIncident) onVerifyIncident(activePopup.data.id);
                      setActivePopup(null);
                    }}
                    className="clay-btn clay-btn-coral w-full py-2 px-3 text-xs flex items-center justify-center gap-1.5 rounded-xl font-bold"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verify & Enforce Hazard Status</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Vehicle Popup Details */}
          {activePopup.type === 'vehicle' && (
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-bold">Driver:</span>
                <span className="font-bold text-slate-800">{activePopup.data.driverName || 'Unassigned'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-bold">Status:</span>
                <span className="font-mono text-orange-600 font-bold text-[10px] uppercase">{activePopup.data.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-bold">Live Speed:</span>
                <span className="text-slate-800 font-mono font-bold">{activePopup.data.speedKmh} km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[11px] font-bold">Fuel Level:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden shadow-[inset_1px_1px_2px_rgba(148,163,184,0.3)]">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                      style={{ width: `${activePopup.data.fuelLevelPercent}%` }}
                    />
                  </div>
                  <span className="text-slate-800 font-mono font-bold text-[10px]">{activePopup.data.fuelLevelPercent}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};
