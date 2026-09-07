/**
 * PANDAVAS NER Logistics Intelligence Platform
 * AI Route Optimization & Alternate Route Recommendation Modal in Claymorphism Aesthetics
 */

import React, { useState } from 'react';
import { RouteOption } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Route,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';

interface RouteOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRoute: (routeId: string) => void;
  onNavigateToMap: () => void;
}

export const RouteOptimizerModal: React.FC<RouteOptimizerModalProps> = ({
  isOpen,
  onClose,
  onApplyRoute,
  onNavigateToMap
}) => {
  const { t } = useLanguage();
  const [selectedCorridor, setSelectedCorridor] = useState('tawang');

  if (!isOpen) return null;

  const corridorsData = {
    tawang: {
      title: 'Tezpur / Guwahati Hub ➔ Tawang Alpine Forward Depot',
      commodity: 'Pediatric Vaccines & Cold-Weather Tarpaulins',
      primary: {
        name: 'NH-13 Trans-Arunachal (Direct via Sela Pass)',
        distanceKm: 310,
        duration: '11 hrs 45 mins',
        risk: 88,
        riskLevel: 'Critical',
        delay: '+4.0 hours delay (Active 60m rockslide near Sela Tunnel Portal)',
        status: 'BLOCKED'
      },
      alternate: {
        name: 'Bhalukpong - Rupa - Shergaon All-Weather Bypass',
        distanceKm: 355,
        duration: '8 hrs 20 mins',
        risk: 26,
        riskLevel: 'Low',
        delay: 'Clear (All-weather military grade tarmac)',
        status: 'ACCESSIBLE',
        reason: 'Avoids 4,170m elevation fracture zone completely. Saves 3.4 hours transit time and reduces landslide risk by 62%.'
      }
    },
    gangtok: {
      title: 'Siliguri Logistics Railhead ➔ STNM Hospital, Gangtok',
      commodity: 'Medical Liquid Oxygen Cylinders & Grains',
      primary: {
        name: 'NH-10 Sevoke - Teesta 29th-Mile Lifeline',
        distanceKm: 114,
        duration: '6 hrs 30 mins',
        risk: 94,
        riskLevel: 'Critical',
        delay: '+6.0 hours delay (Teesta river runoff submerged 1.4m)',
        status: 'BLOCKED'
      },
      alternate: {
        name: 'Damdim - Lava - Algarah - Reshi Alternate Corridor',
        distanceKm: 148,
        duration: '4 hrs 50 mins',
        risk: 32,
        riskLevel: 'Low',
        delay: 'Caution on uphill bends, otherwise open',
        status: 'ACCESSIBLE',
        reason: 'Climbs above Teesta flood line. Guarantees safe passage for pressurized oxygen convoys without water damage.'
      }
    }
  };

  const currentData = selectedCorridor === 'tawang' ? corridorsData.tawang : corridorsData.gangtok;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="clay-card w-full max-w-2xl rounded-[2rem] p-6 text-slate-800 shadow-[14px_18px_36px_rgba(148,163,184,0.35),-10px_-10px_24px_rgba(255,255,255,0.9)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-[3px_4px_10px_rgba(99,102,241,0.35)]">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-800">
                  {t('optimizeRoutes')}
                </h3>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-600" /> AI Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Autonomous terrain hazard avoidance for Northeast freight
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

        {/* Content */}
        <div className="mt-4 overflow-y-auto space-y-4 text-xs pr-1 flex-1">
          {/* Corridor Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Select Disrupted Corridor to Optimize:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedCorridor('tawang')}
                className={`p-3.5 rounded-2xl text-left transition-all ${
                  selectedCorridor === 'tawang'
                    ? 'clay-btn-primary shadow-[4px_6px_14px_rgba(99,102,241,0.35)]'
                    : 'bg-white text-slate-800 shadow-[2px_3px_6px_rgba(148,163,184,0.18)] hover:bg-slate-50'
                }`}
              >
                <div className="font-extrabold text-xs">Arunachal Alpine Sector</div>
                <div className="text-[11px] opacity-80 mt-0.5">Tezpur ➔ Tawang (Sela Blockage)</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCorridor('gangtok')}
                className={`p-3.5 rounded-2xl text-left transition-all ${
                  selectedCorridor === 'gangtok'
                    ? 'clay-btn-primary shadow-[4px_6px_14px_rgba(99,102,241,0.35)]'
                    : 'bg-white text-slate-800 shadow-[2px_3px_6px_rgba(148,163,184,0.18)] hover:bg-slate-50'
                }`}
              >
                <div className="font-extrabold text-xs">Sikkim Lifeline Sector</div>
                <div className="text-[11px] opacity-80 mt-0.5">Siliguri ➔ Gangtok (Teesta Flood)</div>
              </button>
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 shadow-[2px_3px_6px_rgba(99,102,241,0.1)]">
            <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              AI Recommendation: Use Alternate All-Weather Bypass
            </div>
            <p className="text-[11px] leading-relaxed text-indigo-800">
              {currentData.alternate.reason}
            </p>
          </div>

          {/* Comparison Cards: Primary vs Alternate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary (Blocked) */}
            <div className="clay-card-sm p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Primary Route</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] uppercase">
                  {currentData.primary.status}
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800">{currentData.primary.name}</h4>

              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Distance:</span>
                  <span className="font-mono font-bold text-slate-800">{currentData.primary.distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Travel Time:</span>
                  <span className="font-mono font-bold text-slate-800">{currentData.primary.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Score:</span>
                  <span className="font-mono font-bold text-rose-600">{currentData.primary.risk}% (Critical)</span>
                </div>
                <div className="pt-1.5 text-[11px] text-rose-700 font-medium border-t border-slate-100">
                  {currentData.primary.delay}
                </div>
              </div>
            </div>

            {/* Alternate (Recommended) */}
            <div className="clay-card-sm p-4 space-y-2.5 bg-emerald-50/50 border-emerald-300 relative">
              <div className="absolute -top-2.5 right-3 bg-emerald-600 text-white rounded-full text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" /> RECOMMENDED
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">PANDAVAS Bypass</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase">
                  {currentData.alternate.status}
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-emerald-950">{currentData.alternate.name}</h4>

              <div className="space-y-1.5 text-[11px] text-emerald-900">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Distance:</span>
                  <span className="font-mono font-bold">{currentData.alternate.distanceKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Travel Time:</span>
                  <span className="font-mono font-bold text-emerald-800">{currentData.alternate.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Risk Score:</span>
                  <span className="font-mono font-bold text-emerald-700">{currentData.alternate.risk}% (Low)</span>
                </div>
                <div className="pt-1.5 text-[11px] text-emerald-800 font-medium border-t border-emerald-200">
                  {currentData.alternate.delay}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onClose();
                onNavigateToMap();
              }}
              className="clay-btn clay-btn-light px-4 py-2 text-xs rounded-xl flex items-center gap-1 font-bold"
            >
              <span>{t('openGisMap')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                onApplyRoute('route-opt-bypass');
                onClose();
              }}
              className="clay-btn clay-btn-coral px-5 py-2.5 text-xs flex items-center gap-1.5 rounded-xl font-bold"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply Bypass Route</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
