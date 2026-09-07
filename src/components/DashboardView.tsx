/**
 * PANDAVAS NER Logistics Intelligence Platform
 * Dashboard View in Claymorphic Aesthetics with Full 22-Language Support
 */

import React from 'react';
import {
  Road,
  Incident,
  Vehicle,
  Delivery,
  WeatherObservation,
  Alert,
  RiskPrediction,
  UserRole
} from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  AlertTriangle,
  Truck,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  CloudRain,
  Sparkles,
  Route,
  CheckCircle,
  Activity,
  Layers,
  ChevronRight,
  RefreshCw,
  Eye,
  Globe,
  Sliders,
  Send,
  Navigation
} from 'lucide-react';

interface DashboardViewProps {
  currentUserRole: UserRole;
  roads: Road[];
  incidents: Incident[];
  vehicles: Vehicle[];
  deliveries: Delivery[];
  weather: WeatherObservation[];
  alerts: Alert[];
  riskPredictions: RiskPrediction[];
  onOpenReportIncident: () => void;
  onOpenRouteOptimizer: () => void;
  onNavigateToMap: () => void;
  onVerifyIncident: (id: string) => void;
  onRejectIncident: (id: string, reason: string) => void;
  onUpdateDeliveryStatus: (id: string, status: Delivery['status']) => void;
  onRequestAiBriefing: () => void;
  aiBriefing: any | null;
  isAiLoading: boolean;
  onOpenLanguageModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUserRole,
  roads,
  incidents,
  vehicles,
  deliveries,
  weather,
  alerts,
  onOpenReportIncident,
  onOpenRouteOptimizer,
  onNavigateToMap,
  onVerifyIncident,
  onRejectIncident,
  onUpdateDeliveryStatus,
  onRequestAiBriefing,
  aiBriefing,
  isAiLoading,
  onOpenLanguageModal
}) => {
  const { currentLanguage, broadcastLanguages, languages, t } = useLanguage();

  // Derived Metrics
  const accessibleRoads = roads.filter(r => r.status === 'ACCESSIBLE');
  const accessiblePercentage = roads.length > 0
    ? Math.round((accessibleRoads.length / roads.length) * 100)
    : 0;

  const activeHazards = incidents.filter(i => i.status !== 'Resolved');
  const blockedRoads = roads.filter(r => r.status === 'BLOCKED');
  const inTransitDeliveries = deliveries.filter(d => d.status === 'IN_TRANSIT');
  const delayedDeliveries = deliveries.filter(d => d.status === 'DELAYED');

  // Pending incidents for verification
  const pendingVerification = incidents.filter(i => i.status === 'Reported');

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HERO SECTION: Claymorphic Title with Quick Metrics & Action */}
      <div className="clay-card p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative clay background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-100/60 via-purple-50/40 to-transparent rounded-full pointer-events-none -mr-20 -mt-20 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(99,102,241,0.15)] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Northeast Lifeline Corridors Live Telemetry</span>
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                NH-27 • NH-10 • NH-13 • NH-29
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              PANDAVAS Regional Terrain & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
                Corridor Logistics Intelligence
              </span>
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Multilingual Broadcast Status Pill in Hero */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold shadow-[inset_1px_1px_2px_rgba(148,163,184,0.2)]">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>UI Language:</span>
                <span className="font-bold text-indigo-700">
                  {languages.find(l => l.code === currentLanguage)?.name} ({languages.find(l => l.code === currentLanguage)?.nativeName})
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]">
                <Send className="w-3 h-3 text-emerald-600" />
                <span>Multilingual Broadcast:</span>
                <span className="font-bold">{broadcastLanguages.length} Languages Active</span>
              </div>

              {onOpenLanguageModal && (
                <button
                  onClick={onOpenLanguageModal}
                  className="px-2.5 py-1.5 rounded-xl bg-white text-indigo-600 hover:text-indigo-800 text-[11px] font-bold shadow-[2px_3px_6px_rgba(148,163,184,0.2),inset_1px_1px_2px_rgba(255,255,255,0.9)] transition-all active:scale-95 flex items-center gap-1"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Configure (22)</span>
                </button>
              )}
            </div>
          </div>

          {/* Action CTAs in Hero */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={onOpenRouteOptimizer}
              className="clay-btn clay-btn-primary px-5 py-3.5 text-xs flex items-center justify-center gap-2 rounded-2xl"
            >
              <Route className="w-4 h-4" />
              <span>{t('calculateSafeCorridor')}</span>
            </button>

            <button
              onClick={onNavigateToMap}
              className="clay-btn clay-btn-light px-5 py-3.5 text-xs flex items-center justify-center gap-2 rounded-2xl"
            >
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>{t('openGisMap')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. FOUR KPI CARDS (CLAYMORPHISM) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Road Accessibility */}
        <div className="clay-card p-5 hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {t('roadAccessibility')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-[2px_3px_6px_rgba(16,185,129,0.25)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {accessiblePercentage}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({accessibleRoads.length} / {roads.length} Open)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 shadow-[inset_1px_1px_2px_rgba(148,163,184,0.3)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${accessiblePercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Active Road Hazards */}
        <div className="clay-card p-5 hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {t('activeHazards')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center shadow-[2px_3px_6px_rgba(249,115,22,0.25)]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {activeHazards.length}
            </span>
            <span className="text-xs text-orange-600 font-bold">
              ({blockedRoads.length} {t('blockedRoads')})
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Monitoring active landslides, rockfalls & river surges
          </p>
        </div>

        {/* Metric 3: Fleet Convoys in Transit */}
        <div className="clay-card p-5 hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {t('fleetInTransit')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-[2px_3px_6px_rgba(99,102,241,0.25)]">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {inTransitDeliveries.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              of {vehicles.length} {t('registeredCarriers')}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Live telemetry tracking GPS & fuel efficiency
          </p>
        </div>

        {/* Metric 4: Delayed Missions / Need Reroute */}
        <div className="clay-card p-5 hover:scale-[1.01] transition-transform">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {t('delayedMissions')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-[2px_3px_6px_rgba(244,63,94,0.25)]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {delayedDeliveries.length}
            </span>
            <span className="text-xs text-rose-600 font-bold">
              {t('needsReroute')}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Automated alternate corridors queued for recalculation
          </p>
        </div>
      </div>

      {/* 3. DRIVER ACTIVE MISSION HUD (Visible for DRIVER or FLEET personas) */}
      {(currentUserRole === 'DRIVER' || currentUserRole === 'TRANSPORT_MANAGER') && (
        <div className="clay-card p-6 border-indigo-200/80 shadow-[10px_14px_28px_rgba(99,102,241,0.12),-8px_-8px_20px_rgba(255,255,255,0.95)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-[2px_4px_10px_rgba(249,115,22,0.35)]">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  {t('driverMission')}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  TRK-01 • Consignment: Emergency Oxygen Cylinders • Route: Guwahati to Tawang
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenRouteOptimizer}
                className="clay-btn clay-btn-primary px-3.5 py-2 text-xs flex items-center gap-1.5 rounded-xl"
              >
                <Route className="w-3.5 h-3.5" />
                <span>{t('viewGpsRoute')}</span>
              </button>
              <button
                onClick={onOpenReportIncident}
                className="clay-btn clay-btn-coral px-3 py-2 text-xs flex items-center gap-1 rounded-xl"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t('reportBlockageSos')}</span>
              </button>
            </div>
          </div>

          {/* Stepper Status Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { status: 'PICKED_UP' as const, label: t('pickedUp') },
              { status: 'IN_TRANSIT' as const, label: t('inTransit') },
              { status: 'DELAYED' as const, label: t('delayed') },
              { status: 'DELIVERED' as const, label: t('delivered') }
            ].map(step => (
              <button
                key={step.status}
                onClick={() => onUpdateDeliveryStatus('DEL-01', step.status)}
                className={`py-3 px-3 rounded-2xl text-xs font-bold transition-all text-center ${
                  deliveries.find(d => d.id === 'DEL-01')?.status === step.status
                    ? 'clay-btn-primary shadow-[4px_6px_14px_rgba(99,102,241,0.4)]'
                    : 'bg-white hover:bg-slate-50 text-slate-600 shadow-[3px_4px_8px_rgba(148,163,184,0.18)]'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. FIELD HAZARD VERIFICATION QUEUE (Government/Admin/District Authority) */}
      {(currentUserRole === 'GOVERNMENT_ADMIN' || currentUserRole === 'DISTRICT_AUTHORITY' || currentUserRole === 'FIELD_OFFICER') && pendingVerification.length > 0 && (
        <div className="clay-card p-6 border-amber-200/80 shadow-[10px_14px_28px_rgba(245,158,11,0.12),-8px_-8px_20px_rgba(255,255,255,0.95)]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-800">
                {t('verificationQueue')} ({pendingVerification.length})
              </h3>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              District Authority Oversight
            </span>
          </div>

          <div className="space-y-3">
            {pendingVerification.map(inc => (
              <div
                key={inc.id}
                className="clay-inset p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{inc.title}</span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px]">
                      {inc.severity}
                    </span>
                    <span className="text-slate-500 text-[11px]">By {inc.reporterName}</span>
                  </div>
                  <p className="text-slate-600 mt-1 text-xs leading-relaxed">{inc.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onVerifyIncident(inc.id)}
                    className="clay-btn clay-btn-emerald px-3.5 py-2 text-[11px] flex items-center gap-1 rounded-xl"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t('verifyBlock')}</span>
                  </button>
                  <button
                    onClick={() => onRejectIncident(inc.id, 'Deemed safe by local patrol inspection')}
                    className="clay-btn clay-btn-light px-3 py-2 text-[11px] rounded-xl text-slate-600"
                  >
                    {t('reject')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ARTERIAL HIGHWAYS TABLE & AI LOGISTICS BRIEFING */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Highway Table */}
        <div className="lg:col-span-2 clay-card p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600">
                Freight Lifelines
              </span>
              <h3 className="font-extrabold text-base text-slate-800">
                {t('arterialHighwayStatus')}
              </h3>
            </div>
            <button
              onClick={onNavigateToMap}
              className="clay-btn clay-btn-light px-3.5 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 rounded-xl"
            >
              <span>{t('openGisMap')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-200 pb-2">
                  <th className="pb-3">Highway</th>
                  <th className="pb-3">Corridor / State</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Delay</th>
                  <th className="pb-3">Risk</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roads.slice(0, 6).map(road => (
                  <tr key={road.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-800">{road.code}</td>
                    <td className="py-3">
                      <div className="font-bold text-slate-800">{road.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {road.state} ({road.elevationGradient})
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] ${
                          road.status === 'ACCESSIBLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : road.status === 'BLOCKED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {road.status === 'ACCESSIBLE'
                          ? t('allWeather')
                          : road.status === 'BLOCKED'
                          ? t('blocked')
                          : t('caution')}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-600 text-xs">
                      {road.estimatedDelayMinutes > 0 ? `+${road.estimatedDelayMinutes}m` : 'On Time'}
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-mono font-bold ${
                          road.riskScore > 75
                            ? 'text-rose-600'
                            : road.riskScore > 45
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {road.riskScore}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {road.status === 'BLOCKED' ? (
                        <button
                          onClick={onOpenRouteOptimizer}
                          className="clay-btn clay-btn-coral px-3 py-1.5 text-[10px] rounded-xl"
                        >
                          Find Alternate
                        </button>
                      ) : (
                        <button
                          onClick={onNavigateToMap}
                          className="clay-btn clay-btn-light px-3 py-1 text-[10px] rounded-xl text-slate-600"
                        >
                          View Map
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: AI Situation Briefing & Weather */}
        <div className="space-y-5">
          {/* AI Situation Card in Dark Claymorphism */}
          <div className="clay-card-dark p-6 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-orange-300">
                    {t('aiBriefingTitle')}
                  </span>
                </div>
                <button
                  onClick={onRequestAiBriefing}
                  disabled={isAiLoading}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Refresh AI Analysis"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="mt-4">
                <h4 className="font-extrabold text-base text-white">
                  {aiBriefing?.title || 'Monsoon Hazard & Mountain Corridor Dispatch'}
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                  {aiBriefing?.summary ||
                    'Active rockslide near Sela Tunnel west portal along NH-13. Emergency bypass via Bomdila-Dirang engaged for pharmaceutical carriers.'}
                </p>

                {/* Key Hazards */}
                <div className="mt-4 space-y-2">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                    Critical Monitored Hazards:
                  </span>
                  {(aiBriefing?.keyHazards || [
                    'Sela Tunnel West Portal: 60m rockslide clearing',
                    'Teesta 29th Mile: 1.4m river overflow'
                  ]).map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-orange-400 font-bold mt-0.5">›</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                {aiBriefing?.source === 'GEMINI_AI' ? 'Gemini 2.5 Flash' : 'NER Heuristic'}
              </span>
              <button
                onClick={onOpenRouteOptimizer}
                className="clay-btn clay-btn-coral px-4 py-2 text-xs flex items-center gap-1.5 rounded-xl"
              >
                <Route className="w-3.5 h-3.5" />
                <span>{t('optimizeRoutes')}</span>
              </button>
            </div>
          </div>

          {/* Quick Weather Snapshot Card in Light Clay */}
          <div className="clay-card p-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-indigo-500" />
                {t('weatherRadar')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                IMD Stations
              </span>
            </div>

            <div className="space-y-2.5">
              {weather.slice(0, 3).map(w => (
                <div
                  key={w.id}
                  className="flex items-center justify-between text-xs border-b border-slate-100 pb-2 last:border-none last:pb-0"
                >
                  <div>
                    <span className="font-bold text-slate-800">{w.districtName}</span>
                    <span className="text-slate-400 block text-[10px]">{w.condition}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800 font-mono">{w.rainfallMm} mm</span>
                    <span className="text-slate-400 block text-[10px] font-mono">{w.tempC}°C</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
