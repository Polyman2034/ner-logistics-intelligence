/**
 * PANDAVAS NER Logistics Intelligence Platform
 * Master Full-Stack Application Component in Claymorphism Aesthetics & Multilingual Architecture
 */

import React, { useState, useEffect } from 'react';
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
  RiskPrediction
} from './types';
import { api, setApiAuthContext } from './services/api';
import { getPendingSyncCount } from './lib/offlineDb';
import { INITIAL_USERS } from './data/mockData';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Components
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GisMap } from './components/GisMap';
import { ReportsView } from './components/ReportsView';
import { IncidentReportingModal } from './components/IncidentReportingModal';
import { RouteOptimizerModal } from './components/RouteOptimizerModal';
import { LanguageSettingsModal } from './components/LanguageSettingsModal';

import {
  LayoutDashboard,
  Map as MapIcon,
  FileText,
  ShieldAlert,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Truck,
  Globe,
  Radio,
  Sliders,
  Sparkles
} from 'lucide-react';

function AppContent() {
  const { t, currentLanguage } = useLanguage();

  // Current User & RBAC
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default to Govt / NER Admin
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'reports'>('dashboard');

  // Domain Data State
  const [roads, setRoads] = useState<Road[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [weather, setWeather] = useState<WeatherObservation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals & Tools
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isRouteOptimizerOpen, setIsRouteOptimizerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Network & Offline Dexie State
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Emergency Mode & Global Search
  const [emergencyModeActive, setEmergencyModeActive] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // AI Briefing State
  const [aiBriefing, setAiBriefing] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Initial Data Fetch
  const loadPlatformData = async () => {
    try {
      const [rData, iData, vData, dData, wData, aData, logs, emg] = await Promise.all([
        api.getRoads(),
        api.getIncidents(),
        api.getVehicles(),
        api.getDeliveries(),
        api.getWeather(),
        api.getAlerts(),
        api.getAuditLogs(),
        api.getEmergencyStatus()
      ]);

      if (rData && rData.length > 0) setRoads(rData);
      if (iData) setIncidents(iData);
      if (vData) setVehicles(vData);
      if (dData) setDeliveries(dData);
      if (wData) setWeather(wData);
      if (aData) setAlerts(aData);
      if (logs) setAuditLogs(logs);
      if (emg) setEmergencyModeActive(emg.active);

      // Check Dexie sync queue
      const count = await getPendingSyncCount();
      setPendingSyncCount(count);
    } catch (err) {
      console.warn('Error loading live data from backend:', err);
    }
  };

  useEffect(() => {
    loadPlatformData();

    // Auto-fetch initial AI briefing
    fetchAiBriefing();

    // Online / Offline listeners
    const handleOnline = () => {
      setIsOnline(true);
      triggerSyncQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulated GPS Telemetry: Periodically advance in-transit vehicles along highways (Section 20)
    const telemetryInterval = setInterval(() => {
      setVehicles(prevVehicles =>
        prevVehicles.map(veh => {
          if (veh.status === 'IN_TRANSIT') {
            // Small jitter along highway coordinates
            const deltaLat = (Math.random() - 0.5) * 0.006;
            const deltaLng = (Math.random() - 0.5) * 0.006;
            const newLat = Number((veh.currentLat + deltaLat).toFixed(4));
            const newLng = Number((veh.currentLng + deltaLng).toFixed(4));

            // Sync with backend telemetry API asynchronously
            api.updateVehicleLocation(veh.id, newLat, newLng, veh.speedKmh, veh.heading).catch(() => {});

            return {
              ...veh,
              currentLat: newLat,
              currentLng: newLng,
              lastPing: 'Just now'
            };
          }
          return veh;
        })
      );
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(telemetryInterval);
    };
  }, []);

  // Fetch AI Briefing
  const fetchAiBriefing = async (query?: string) => {
    setIsAiLoading(true);
    try {
      const data = await api.getAiBriefing(query);
      setAiBriefing(data);
    } catch (e) {
      console.warn('Failed AI briefing:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Switch User Role (RBAC)
  const handleRoleChange = async (role: UserRole) => {
    const target = INITIAL_USERS.find(u => u.role === role) || {
      ...currentUser,
      role
    };
    setCurrentUser(target);
    setApiAuthContext(role, target.id);

    try {
      await api.login({ role });
      loadPlatformData();
    } catch (e) {
      console.warn('Role switch fallback active:', e);
    }
  };

  // Toggle Emergency Mode
  const handleToggleEmergency = async () => {
    try {
      const res = await api.toggleEmergency();
      setEmergencyModeActive(res.active);
      loadPlatformData();
    } catch (e: any) {
      alert(e.message || 'Only Emergency Officers or Admins can toggle Emergency Protocol.');
    }
  };

  // Report Incident Submission
  const handleReportIncidentSubmit = async (incidentData: any) => {
    const res = await api.reportIncident(incidentData, isOnline);
    if (res) {
      setIncidents(prev => [res, ...prev]);
      // Update pending sync count if offline
      const count = await getPendingSyncCount();
      setPendingSyncCount(count);
      loadPlatformData();
    }
  };

  // Verify Incident (District Authority RBAC)
  const handleVerifyIncident = async (incidentId: string) => {
    try {
      const updated = await api.verifyIncident(incidentId);
      setIncidents(prev => prev.map(i => i.id === incidentId ? updated : i));
      loadPlatformData();
    } catch (e: any) {
      alert(e.message || 'Verification forbidden for this role.');
    }
  };

  // Reject Incident
  const handleRejectIncident = async (incidentId: string, reason: string) => {
    try {
      const updated = await api.rejectIncident(incidentId, reason);
      setIncidents(prev => prev.map(i => i.id === incidentId ? updated : i));
      loadPlatformData();
    } catch (e: any) {
      alert(e.message || 'Rejection forbidden.');
    }
  };

  // Update Delivery Status (Driver)
  const handleUpdateDeliveryStatus = async (deliveryId: string, status: string) => {
    try {
      await api.updateDeliveryStatus(deliveryId, status, isOnline);
      setDeliveries(prev =>
        prev.map(d => d.id === deliveryId ? { ...d, status: status as any } : d)
      );
      const count = await getPendingSyncCount();
      setPendingSyncCount(count);
      loadPlatformData();
    } catch (e) {
      console.warn('Delivery update failed:', e);
    }
  };

  // Trigger IndexedDB Sync
  const triggerSyncQueue = async () => {
    try {
      const result = await api.syncOfflineQueue();
      if (result.syncedCount > 0) {
        setPendingSyncCount(0);
        loadPlatformData();
      }
    } catch (e) {
      console.warn('Sync failed:', e);
    }
  };

  // Apply Alternate Route to Consignment
  const handleApplyAlternateRoute = async (routeId: string) => {
    // Update delayed delivery to active with alternate bypass
    const delayed = deliveries.find(d => d.status === 'Delayed');
    if (delayed) {
      await handleUpdateDeliveryStatus(delayed.id, 'In Transit');
    }
    loadPlatformData();
  };

  // Filter roads and incidents by global search
  const filteredRoads = roads.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.state.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4F8] text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. GLOBAL NAVIGATION HEADER WITH CLAY STYLING */}
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        emergencyModeActive={emergencyModeActive}
        onToggleEmergency={handleToggleEmergency}
        isOnline={isOnline}
        onToggleOnlineStatus={() => setIsOnline(!isOnline)}
        pendingSyncCount={pendingSyncCount}
        onTriggerSync={triggerSyncQueue}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        alerts={alerts}
        onOpenReportIncident={() => setIsReportModalOpen(true)}
        onOpenLanguageSettings={() => setIsLanguageModalOpen(true)}
      />

      {/* 2. PRIMARY 4-AREA NAVIGATION TABS (Claymorphic Sub-Header) */}
      <div className="w-full bg-[#E8EEF5]/70 backdrop-blur-sm border-b border-white/60 py-3 shadow-[0_4px_12px_rgba(148,163,184,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`clay-btn px-4 py-2 text-xs flex items-center gap-2 rounded-2xl ${
                activeTab === 'dashboard' ? 'clay-btn-primary' : 'clay-btn-light'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('navDashboard')}</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`clay-btn px-4 py-2 text-xs flex items-center gap-2 rounded-2xl ${
                activeTab === 'map' ? 'clay-btn-primary' : 'clay-btn-light'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>{t('navMap')}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`clay-btn px-4 py-2 text-xs flex items-center gap-2 rounded-2xl ${
                activeTab === 'reports' ? 'clay-btn-primary' : 'clay-btn-light'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t('navReports')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Direct Language Switcher Trigger */}
            <button
              onClick={() => setIsLanguageModalOpen(true)}
              className="clay-btn clay-btn-light px-3.5 py-2 text-xs flex items-center gap-1.5 rounded-2xl font-bold"
              title="Configure Languages"
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline font-bold">22 Languages</span>
            </button>

            {/* Quick Authentication / Demo Switcher Trigger (Area 4) */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="clay-btn clay-btn-coral px-4 py-2 text-xs flex items-center gap-1.5 rounded-2xl font-bold"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Switch Persona (RBAC)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            roads={filteredRoads}
            incidents={incidents}
            vehicles={vehicles}
            deliveries={deliveries}
            weather={weather}
            alerts={alerts}
            riskPredictions={[]}
            onOpenReportIncident={() => setIsReportModalOpen(true)}
            onOpenRouteOptimizer={() => setIsRouteOptimizerOpen(true)}
            onNavigateToMap={() => setActiveTab('map')}
            onVerifyIncident={handleVerifyIncident}
            onRejectIncident={handleRejectIncident}
            onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
            onRequestAiBriefing={() => fetchAiBriefing()}
            aiBriefing={aiBriefing}
            isAiLoading={isAiLoading}
          />
        )}

        {/* VIEW 2: LIVE GIS MAP & OPERATIONS */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="clay-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block mb-1">
                  Cartographic Terminal — Section 02
                </span>
                <h2 className="text-lg font-extrabold text-slate-800">
                  {t('openGisMap')} & Hazard Operations Surface
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-layer vector GIS tracking road accessibility, verified landslides, and fleet telemetry across 8 Northeast states
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setIsRouteOptimizerOpen(true)}
                  className="clay-btn clay-btn-primary px-4 py-2.5 text-xs flex items-center gap-1.5 rounded-2xl font-bold"
                >
                  <Truck className="w-4 h-4" />
                  <span>{t('optimizeRoutes')}</span>
                </button>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="clay-btn clay-btn-coral px-4 py-2.5 text-xs flex items-center gap-1.5 rounded-2xl font-bold"
                >
                  <span>{t('reportHazard')}</span>
                </button>
              </div>
            </div>

            <GisMap
              roads={filteredRoads}
              incidents={incidents}
              vehicles={vehicles}
              deliveries={deliveries}
              currentUserRole={currentUser.role}
              emergencyModeActive={emergencyModeActive}
              onVerifyIncident={handleVerifyIncident}
            />
          </div>
        )}

        {/* VIEW 3: REPORTS & ADMIN */}
        {activeTab === 'reports' && (
          <ReportsView
            currentUser={currentUser}
            incidents={incidents}
            deliveries={deliveries}
            vehicles={vehicles}
            roads={roads}
            auditLogs={auditLogs}
            onTriggerSync={triggerSyncQueue}
            pendingSyncCount={pendingSyncCount}
          />
        )}
      </main>

      {/* 4. MODALS & POPUPS */}
      {/* 22-Language Modal */}
      <LanguageSettingsModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />

      {/* Field Incident Reporting Modal */}
      <IncidentReportingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        roads={roads}
        districts={[]}
        onSubmit={handleReportIncidentSubmit}
        isOnline={isOnline}
      />

      {/* AI Route Optimizer Modal */}
      <RouteOptimizerModal
        isOpen={isRouteOptimizerOpen}
        onClose={() => setIsRouteOptimizerOpen(false)}
        onApplyRoute={handleApplyAlternateRoute}
        onNavigateToMap={() => setActiveTab('map')}
      />

      {/* Authentication & Fast Role Switcher Modal (Area 4) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="clay-card w-full max-w-md rounded-[2rem] p-6 text-slate-800 shadow-[14px_18px_36px_rgba(148,163,184,0.35),-10px_-10px_24px_rgba(255,255,255,0.9)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wider block mb-0.5">
                  Security & Access Control
                </span>
                <h3 className="font-extrabold text-base text-slate-800">PANDAVAS Access Control</h3>
                <p className="text-xs text-slate-500">Simulate any of the 7 authenticated personas</p>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Authorized Personnel Roles:
              </span>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {INITIAL_USERS.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      handleRoleChange(u.role);
                      setIsAuthModalOpen(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left flex items-center justify-between text-xs transition-all border ${
                      currentUser.role === u.role
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-[4px_6px_14px_rgba(99,102,241,0.35)]'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-white/80 shadow-[2px_3px_6px_rgba(148,163,184,0.15)]'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs">{u.name}</div>
                      <div className={`text-[10px] mt-0.5 font-mono ${currentUser.role === u.role ? 'text-indigo-200' : 'text-slate-500'}`}>
                        {u.role.replace('_', ' ')} • {u.organization}
                      </div>
                    </div>
                    {currentUser.role === u.role && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="clay-btn clay-btn-light px-5 py-2 text-xs rounded-xl"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claymorphic Soft Color Accent Bar */}
      <div className="w-full flex h-1.5 gap-2 px-6 max-w-7xl mx-auto opacity-70">
        <div className="flex-1 rounded-full bg-indigo-400" />
        <div className="flex-1 rounded-full bg-emerald-400" />
        <div className="flex-1 rounded-full bg-orange-400" />
        <div className="flex-1 rounded-full bg-amber-400" />
      </div>

      {/* Clay Footer */}
      <footer className="w-full bg-[#E2E8F0]/80 backdrop-blur-sm border-t border-white/80 py-4 px-6 sm:px-10 text-xs font-semibold text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-slate-800 font-bold">PANDAVAS System: 100% Operational</span>
            </span>
            <span className="text-slate-400 hidden md:inline font-mono text-[11px]">
              NER Bounds: 23.0°N - 28.5°N | 88.0°E - 95.5°E
            </span>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-slate-500">
            <span>© PANDAVAS NER Logistics Intelligence</span>
            <span className="px-2 py-0.5 rounded-full bg-white text-indigo-600 font-bold shadow-sm">
              22 Languages Supported
            </span>
            <span className="font-mono text-slate-400">v3.0 Claymorphism Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
