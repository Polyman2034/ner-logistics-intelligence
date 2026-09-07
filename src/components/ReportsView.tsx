/**
 * RouteMind NER Logistics Intelligence Platform
 * Reports, Profile, Audit, Sync, API & Multi-Language Settings in Claymorphic Aesthetics
 */

import React, { useState } from 'react';
import {
  User,
  Incident,
  Delivery,
  Vehicle,
  Road,
  AuditLog,
  UserRole
} from '../types';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import {
  FileText,
  UserCircle,
  Settings,
  Shield,
  Clock,
  Download,
  Filter,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  Code,
  HardDrive,
  CheckCircle2,
  Globe,
  Radio,
  Send,
  Sliders,
  Check,
  Languages
} from 'lucide-react';

interface ReportsViewProps {
  currentUser: User;
  incidents: Incident[];
  deliveries: Delivery[];
  vehicles: Vehicle[];
  roads: Road[];
  auditLogs: AuditLog[];
  onTriggerSync: () => void;
  pendingSyncCount: number;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentUser,
  incidents,
  deliveries,
  vehicles,
  roads,
  auditLogs,
  onTriggerSync,
  pendingSyncCount
}) => {
  const {
    currentLanguage,
    setLanguage,
    broadcastLanguages,
    toggleBroadcastLanguage,
    selectAllBroadcastLanguages,
    clearBroadcastLanguages,
    languages,
    t
  } = useLanguage();

  const [activeTab, setActiveTab] = useState<'reports' | 'languages' | 'profile' | 'audit' | 'sync' | 'api'>('reports');

  // Filter state for reports
  const [filterType, setFilterType] = useState('ALL');
  const [testBroadcastSent, setTestBroadcastSent] = useState(false);

  // Filtered incidents
  const filteredIncidents = incidents.filter(i => {
    if (filterType !== 'ALL' && i.type !== filterType) return false;
    return true;
  });

  const handleSendTestBroadcast = () => {
    setTestBroadcastSent(true);
    setTimeout(() => setTestBroadcastSent(false), 4000);
  };

  return (
    <div className="clay-card p-6 sm:p-8 space-y-6">
      {/* Sub-Navigation Tabs - Claymorphic Pills */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('reports')}
          className={`clay-btn px-4 py-2.5 text-xs flex items-center gap-2 rounded-2xl ${
            activeTab === 'reports' ? 'clay-btn-primary' : 'clay-btn-light'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Operational Reports</span>
        </button>

        {/* 22-LANGUAGE CONFIGURATION TAB */}
        <button
          onClick={() => setActiveTab('languages')}
          className={`clay-btn px-4 py-2.5 text-xs flex items-center gap-2 rounded-2xl ${
            activeTab === 'languages' ? 'clay-btn-coral text-white' : 'clay-btn-light'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Languages ({languages.length})</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/30 text-[10px] font-bold">
            {broadcastLanguages.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`clay-btn px-4 py-2.5 text-xs flex items-center gap-2 rounded-2xl ${
            activeTab === 'profile' ? 'clay-btn-primary' : 'clay-btn-light'
          }`}
        >
          <UserCircle className="w-3.5 h-3.5" />
          <span>Profile & RBAC</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`clay-btn px-4 py-2.5 text-xs flex items-center gap-2 rounded-2xl ${
            activeTab === 'audit' ? 'clay-btn-primary' : 'clay-btn-light'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`clay-btn px-4 py-2.5 text-xs flex items-center gap-2 rounded-2xl ${
            activeTab === 'sync' ? 'clay-btn-primary' : 'clay-btn-light'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Offline Sync {pendingSyncCount > 0 && `(${pendingSyncCount})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`clay-btn px-4 py-2.5 text-xs flex items-center gap-2 rounded-2xl ${
            activeTab === 'api' ? 'clay-btn-primary' : 'clay-btn-light'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>REST API Spec</span>
        </button>
      </div>

      {/* TAB 1: OPERATIONAL REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                Northeast Regional Operational & Hazard Log
              </h3>
              <p className="text-xs text-slate-500">
                Hazard verifications, road clearance timelines, and delivery performance
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="clay-input px-3 py-2 text-xs text-slate-700 cursor-pointer"
              >
                <option value="ALL">All Hazard Types</option>
                <option value="Landslide">Landslide</option>
                <option value="Flood">Flood</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Bridge Damage">Bridge Damage</option>
              </select>

              <button
                onClick={() => {
                  const csv = 'Title,Type,Severity,Status,Road,Reporter,Date\n' +
                    filteredIncidents.map(i => `"${i.title}","${i.type}","${i.severity}","${i.status}","${i.roadName}","${i.reporterName}","${i.createdAt}"`).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `RouteMind-report-${Date.now()}.csv`;
                  a.click();
                }}
                className="clay-btn clay-btn-coral px-4 py-2 text-xs flex items-center gap-1.5 rounded-xl font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white shadow-[inset_1px_1px_3px_rgba(148,163,184,0.2)] p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-100">
                  <th className="py-3 px-3">Incident / Hazard</th>
                  <th className="py-3 px-3">Location & Highway</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Reporter</th>
                  <th className="py-3 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncidents.map(inc => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{inc.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{inc.description}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{inc.roadName}</div>
                      <div className="text-[10px] text-slate-400">{inc.districtName}, {inc.state}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : inc.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                        inc.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inc.status === 'Rejected'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {inc.reporterName}
                      <span className="text-[10px] text-slate-400 block font-mono">({inc.reporterRole})</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[11px] text-slate-500">
                      {new Date(inc.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-LANGUAGE & BROADCAST SETTINGS (All 22 Languages) */}
      {activeTab === 'languages' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-extrabold text-slate-800">
                  {t('languageSettings')} — 22 Official Indian Languages
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configure application UI display language and automated field disaster broadcast channels for all 8 Northeast states.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={selectAllBroadcastLanguages}
                className="clay-btn clay-btn-light px-3 py-1.5 text-xs rounded-xl"
              >
                {t('selectAll')} (22)
              </button>
              <button
                onClick={clearBroadcastLanguages}
                className="clay-btn clay-btn-light px-3 py-1.5 text-xs rounded-xl"
              >
                {t('clearAll')}
              </button>
              <button
                onClick={handleSendTestBroadcast}
                className="clay-btn clay-btn-coral px-3.5 py-1.5 text-xs flex items-center gap-1.5 rounded-xl font-bold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Broadcast</span>
              </button>
            </div>
          </div>

          {/* Test Broadcast Notification Banner if clicked */}
          {testBroadcastSent && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-[4px_6px_14px_rgba(16,185,129,0.2)] animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multilingual Test Broadcast Dispatched Successfully!</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                Emergency audio and SMS packets synthesized in {broadcastLanguages.length} selected languages for all active convoy drivers and field officers in the affected mountain sectors.
              </p>
            </div>
          )}

          {/* 1. Primary Interface Language Selection */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
              {t('selectDisplayLang')}:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3 rounded-2xl text-left transition-all ${
                    currentLanguage === lang.code
                      ? 'clay-btn-primary shadow-[4px_6px_14px_rgba(99,102,241,0.4)]'
                      : 'bg-white hover:bg-slate-50 text-slate-800 shadow-[2px_3px_6px_rgba(148,163,184,0.18)]'
                  }`}
                >
                  <div className="text-xs font-extrabold">{lang.nativeName}</div>
                  <div className="text-[10px] opacity-80 mt-0.5 flex items-center justify-between">
                    <span>{lang.name}</span>
                    <span className="font-mono text-[9px] uppercase px-1 py-0.2 rounded bg-black/10">
                      {lang.code}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Automated Multi-Language Broadcast Grid */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  {t('broadcastLanguages')}:
                </span>
                <span className="text-[11px] text-slate-500">
                  Select which languages emergency broadcasts, road closures & weather bulletins are transmitted in ({broadcastLanguages.length} active)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {languages.map(lang => {
                const isChecked = broadcastLanguages.includes(lang.code);
                return (
                  <div
                    key={lang.code}
                    onClick={() => toggleBroadcastLanguage(lang.code)}
                    className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between border transition-all ${
                      isChecked
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-[2px_4px_10px_rgba(16,185,129,0.15)]'
                        : 'bg-white border-slate-200/80 text-slate-600 shadow-[1px_2px_4px_rgba(148,163,184,0.1)] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">{lang.name}</div>
                      <div className="text-[11px] opacity-80">{lang.nativeName}</div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-emerald-600 text-white shadow-[1px_2px_4px_rgba(16,185,129,0.4)]'
                          : 'bg-slate-100 border border-slate-300 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE & RBAC ROLE CONFIGURATION */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-[4px_6px_14px_rgba(249,115,22,0.35),inset_2px_2px_4px_rgba(255,255,255,0.4)]">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">{currentUser.name}</h3>
              <p className="text-xs text-orange-600 font-mono uppercase font-bold tracking-wider">
                {currentUser.role.replace('_', ' ')}
              </p>
              <p className="text-xs text-slate-500">{currentUser.organization}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs clay-inset p-5 rounded-2xl">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Email Address:</span>
              <p className="font-mono text-xs text-slate-800 font-bold mt-0.5">{currentUser.email}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Contact Phone:</span>
              <p className="font-mono text-xs text-slate-800 font-bold mt-0.5">{currentUser.phone}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Jurisdiction / State:</span>
              <p className="font-bold text-slate-800 mt-0.5">{currentUser.state || 'Northeast Regional Command'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Assigned District:</span>
              <p className="font-bold text-slate-800 mt-0.5">{currentUser.districtName || 'All NER Districts'}</p>
            </div>
          </div>

          {/* Role Privileges Description */}
          <div className="clay-card-sm p-5 space-y-2">
            <span className="font-extrabold text-sm text-slate-800 block">Role Privileges & Access Constraints:</span>
            <ul className="space-y-1.5 text-slate-600 text-xs list-disc list-inside">
              <li>Road Accessibility Updates: {['GOVERNMENT_ADMIN', 'DISTRICT_AUTHORITY', 'EMERGENCY_OFFICER', 'SYSTEM_ADMIN'].includes(currentUser.role) ? 'AUTHORIZED' : 'RESTRICTED (Read-Only)'}</li>
              <li>Incident Verification & Rejection: {['DISTRICT_AUTHORITY', 'GOVERNMENT_ADMIN', 'EMERGENCY_OFFICER', 'SYSTEM_ADMIN'].includes(currentUser.role) ? 'AUTHORIZED' : 'RESTRICTED'}</li>
              <li>Consignment Dispatch & Re-routing: {['TRANSPORT_MANAGER', 'GOVERNMENT_ADMIN', 'EMERGENCY_OFFICER', 'SYSTEM_ADMIN'].includes(currentUser.role) ? 'AUTHORIZED' : 'RESTRICTED'}</li>
              <li>Emergency Protocol Override: {['EMERGENCY_OFFICER', 'GOVERNMENT_ADMIN', 'SYSTEM_ADMIN'].includes(currentUser.role) ? 'AUTHORIZED' : 'RESTRICTED'}</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-slate-800">Security & Operational Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable logging of road modifications, incident approvals, and emergency activations</p>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white shadow-[inset_1px_1px_3px_rgba(148,163,184,0.2)] p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 border-b border-slate-100">
                  <th className="py-2.5 px-3">Officer / User</th>
                  <th className="py-2.5 px-3">Action Event</th>
                  <th className="py-2.5 px-3">Target Entity</th>
                  <th className="py-2.5 px-3">Event Details</th>
                  <th className="py-2.5 px-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-800">{log.userName}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 text-[9px] font-bold uppercase rounded-md">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{log.entity} ({log.entityId})</td>
                    <td className="py-2.5 px-3 font-sans text-slate-800 max-w-xs truncate">{log.details}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: OFFLINE SYNC QUEUE */}
      {activeTab === 'sync' && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">IndexedDB & Offline Synchronization</h3>
              <p className="text-xs text-slate-500">Local queue managing field updates reported without cellular connectivity</p>
            </div>
            <button
              onClick={onTriggerSync}
              className="clay-btn clay-btn-coral px-4 py-2 text-xs flex items-center gap-1.5 rounded-xl font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Force Sync Now</span>
            </button>
          </div>

          <div className="clay-inset p-5 rounded-2xl text-xs space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Pending Queue Items:</span>
              <span className="font-mono font-bold text-orange-600">{pendingSyncCount} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Local Storage Engine:</span>
              <span className="font-mono font-bold text-slate-800">IndexedDB (Dexie.js v4)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Offline Tables:</span>
              <span className="text-slate-800 font-mono text-[11px]">offlineIncidents, offlineDeliveryUpdates, cachedRoads</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: REST API SPEC */}
      {activeTab === 'api' && (
        <div className="space-y-4 max-w-3xl">
          <div className="pb-3 border-b border-slate-200">
            <h3 className="text-base font-extrabold text-slate-800">REST API & Service Architecture</h3>
            <p className="text-xs text-slate-500">Comprehensive API architecture conforming to Section 13 specifications</p>
          </div>

          <div className="clay-card-dark p-5 rounded-2xl text-xs font-mono text-white space-y-1.5 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.15)]">
            <div className="text-orange-400 font-bold tracking-wider"># Core Logistics & Emergency Endpoints</div>
            <div><span className="text-emerald-400">GET</span>  /health</div>
            <div><span className="text-emerald-400">GET</span>  /api/docs</div>
            <div><span className="text-orange-400">POST</span> /api/auth/login</div>
            <div><span className="text-emerald-400">GET</span>  /api/roads</div>
            <div><span className="text-amber-400">PATCH</span>/api/roads/:id/status</div>
            <div><span className="text-emerald-400">GET</span>  /api/incidents</div>
            <div><span className="text-orange-400">POST</span> /api/incidents</div>
            <div><span className="text-orange-400">POST</span> /api/incidents/:id/verify</div>
            <div><span className="text-orange-400">POST</span> /api/incidents/:id/reject</div>
            <div><span className="text-emerald-400">GET</span>  /api/vehicles</div>
            <div><span className="text-orange-400">POST</span> /api/tracking/location</div>
            <div><span className="text-emerald-400">GET</span>  /api/deliveries</div>
            <div><span className="text-orange-400">POST</span> /api/routes/optimize</div>
            <div><span className="text-orange-400">POST</span> /api/ai/briefing</div>
            <div><span className="text-orange-400">POST</span> /api/emergency/toggle</div>
            <div><span className="text-orange-400">POST</span> /api/sync/batch</div>
          </div>
        </div>
      )}
    </div>
  );
};
