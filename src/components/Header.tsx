/**
 * RouteMind NER Logistics Intelligence Platform
 * Global Navigation Header with Claymorphism Aesthetics, 22-Language Selector & RBAC
 */

import React, { useState } from 'react';
import { User, UserRole, Alert } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  Wifi,
  WifiOff,
  RefreshCw,
  Search,
  Bell,
  ChevronDown,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Globe,
  Sliders
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  emergencyModeActive: boolean;
  onToggleEmergency: () => void;
  isOnline: boolean;
  onToggleOnlineStatus: () => void;
  pendingSyncCount: number;
  onTriggerSync: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  alerts: Alert[];
  onOpenReportIncident: () => void;
  onOpenLanguageModal: () => void;
}

const ROLES: { role: UserRole; label: string; badgeColor: string }[] = [
  { role: 'GOVERNMENT_ADMIN', label: '1. Government / NER Admin', badgeColor: 'bg-purple-100 text-purple-800' },
  { role: 'DISTRICT_AUTHORITY', label: '2. District Authority', badgeColor: 'bg-blue-100 text-blue-800' },
  { role: 'FIELD_OFFICER', label: '3. Field Officer (BRO/PWD)', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { role: 'TRANSPORT_MANAGER', label: '4. Transport / Fleet Mgr', badgeColor: 'bg-indigo-100 text-indigo-800' },
  { role: 'DRIVER', label: '5. Driver (Convoy)', badgeColor: 'bg-amber-100 text-amber-800' },
  { role: 'EMERGENCY_OFFICER', label: '6. Disaster / Emergency Off.', badgeColor: 'bg-rose-100 text-rose-800' },
  { role: 'SYSTEM_ADMIN', label: '7. System Administrator', badgeColor: 'bg-slate-100 text-slate-800' }
];

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  emergencyModeActive,
  onToggleEmergency,
  isOnline,
  onToggleOnlineStatus,
  pendingSyncCount,
  onTriggerSync,
  searchQuery,
  onSearchChange,
  alerts,
  onOpenReportIncident,
  onOpenLanguageModal
}) => {
  const { currentLanguage, broadcastLanguages, languages, t } = useLanguage();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.read);
  const currentLangObj = languages.find(l => l.code === currentLanguage);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F0F4F8]/90 backdrop-blur-md border-b border-white/60 text-slate-800 shadow-[0_4px_20px_rgba(148,163,184,0.15)]">
      {/* Top Critical Emergency Banner if Active */}
      {emergencyModeActive && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold tracking-wide shadow-[0_4px_12px_rgba(234,88,12,0.3)]">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
            <span className="text-[11px] font-bold">
              {t('emergencyActive')}: Priority clearance enforced for Medical, NDRF & Essential Supplies across NER mountain corridors.
            </span>
          </div>
          <button
            onClick={onToggleEmergency}
            className="clay-btn px-3 py-1 bg-white text-orange-700 text-[10px] font-bold rounded-xl shadow-[2px_3px_6px_rgba(0,0,0,0.2)] hover:bg-orange-50 active:scale-95 transition-all"
          >
            Deactivate
          </button>
        </div>
      )}

      {/* Main Clay Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-[4px_6px_14px_rgba(99,102,241,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
                RouteMind<span className="text-orange-500">.NER</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(99,102,241,0.15)]">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Global Search - Clay Inset */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="clay-input w-full pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder:text-slate-400 font-sans"
            />
          </div>
        </div>

        {/* Right Tools & Role Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* MULTI-LANGUAGE SELECTOR BUTTON (22 Languages) */}
          <button
            onClick={onOpenLanguageModal}
            className="clay-btn clay-btn-light px-3 py-2 text-xs flex items-center gap-1.5 rounded-2xl group"
            title="Configure Language & Multi-Language Broadcast Settings"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <span>{currentLangObj?.nativeName || 'English'}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-700 font-mono">
                  {currentLanguage.toUpperCase()}
                </span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold" title={`${broadcastLanguages.length} Languages Selected for Field Alerts`}>
              {broadcastLanguages.length}
            </span>
          </button>

          {/* Quick Field Hazard Report Button */}
          <button
            onClick={onOpenReportIncident}
            className="clay-btn clay-btn-coral px-3.5 py-2 text-xs flex items-center gap-1.5 rounded-2xl"
            title="Report Road Hazard, Landslide or Fracture"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-bold">{t('reportHazard')}</span>
          </button>

          {/* Offline/Online Status Pill */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleOnlineStatus}
              className={`clay-btn px-2.5 py-2 text-xs flex items-center gap-1.5 rounded-2xl ${
                isOnline
                  ? 'clay-btn-light text-slate-700'
                  : 'bg-amber-100 text-amber-900 border border-amber-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]'
              }`}
              title={isOnline ? 'Network Connected (Click to simulate offline mode)' : 'Network Disconnected (Click to restore online mode)'}
            >
              {isOnline ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-800" />
              )}
              <span className="hidden lg:inline text-[11px] font-bold">
                {isOnline ? t('live') : t('offline')}
              </span>
            </button>

            {pendingSyncCount > 0 && (
              <button
                onClick={onTriggerSync}
                className="clay-btn clay-btn-primary px-2.5 py-2 text-xs flex items-center gap-1 rounded-2xl animate-bounce"
                title="Sync pending offline reports to server"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="text-[11px] font-bold">{t('syncPending')} ({pendingSyncCount})</span>
              </button>
            )}
          </div>

          {/* Emergency Mode Protocol Toggle */}
          <button
            onClick={onToggleEmergency}
            className={`clay-btn px-3 py-2 text-xs flex items-center gap-1.5 rounded-2xl ${
              emergencyModeActive
                ? 'clay-btn-coral'
                : 'clay-btn-light'
            }`}
            title="Toggle Emergency Disaster Protocol"
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-bold">
              {emergencyModeActive ? t('emergencyActive') : t('emergencyMode')}
            </span>
          </button>

          {/* Alerts Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsMenu(!showAlertsMenu)}
              className="clay-btn clay-btn-light w-10 h-10 flex items-center justify-center rounded-2xl relative"
              title="View Regional Alerts"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-[1px_2px_4px_rgba(249,115,22,0.4)]">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {showAlertsMenu && (
              <div className="clay-card absolute right-0 mt-3 w-80 sm:w-96 p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                  <span className="font-bold text-sm text-slate-800">Regional Alerts & Hazards</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold">
                    ({alerts.length}) Active
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {alerts.map(a => (
                    <div
                      key={a.id}
                      className={`p-3 rounded-2xl border ${
                        a.severity === 'CRITICAL'
                          ? 'bg-rose-50/80 border-rose-200 text-rose-950 shadow-[2px_3px_8px_rgba(244,63,94,0.15)]'
                          : a.severity === 'WARNING'
                          ? 'bg-amber-50/80 border-amber-200 text-amber-950 shadow-[2px_3px_8px_rgba(245,158,11,0.15)]'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="line-clamp-1 text-xs">{a.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{a.timestamp}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed opacity-85">{a.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill & Dropdown (RBAC) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="clay-btn clay-btn-light flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl text-xs"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold shadow-[2px_3px_6px_rgba(249,115,22,0.3)]">
                {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[11px] font-bold text-slate-800 line-clamp-1 max-w-[110px]">
                  {currentUser.name}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="clay-card absolute right-0 mt-3 w-80 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="pb-3 border-b border-slate-200 mb-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-orange-600">
                    Role-Based Access Control (RBAC)
                  </div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{currentUser.organization}</div>
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {ROLES.map(r => (
                    <button
                      key={r.role}
                      onClick={() => {
                        onRoleChange(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                        currentUser.role === r.role
                          ? 'clay-btn-primary font-bold'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60 shadow-[2px_2px_4px_rgba(148,163,184,0.15)]'
                      }`}
                    >
                      <span className="text-xs">{r.label}</span>
                      {currentUser.role === r.role && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
