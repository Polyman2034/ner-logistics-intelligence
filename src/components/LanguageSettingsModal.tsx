import React, { useState } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';
import {
  Globe,
  Check,
  CheckCircle2,
  Radio,
  Sparkles,
  Sliders,
  Send,
  X,
  Volume2
} from 'lucide-react';

interface LanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSettingsModal: React.FC<LanguageSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    currentLanguage,
    setLanguage,
    broadcastLanguages,
    toggleBroadcastLanguage,
    selectAllBroadcastLanguages,
    clearBroadcastLanguages,
    t
  } = useLanguage();

  const [activeTab, setActiveTab] = useState<'display' | 'broadcast'>('display');
  const [filterQuery, setFilterQuery] = useState('');
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    l =>
      l.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.region.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleTestBroadcast = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="clay-modal w-full max-w-2xl bg-[#F0F4F8] rounded-[2rem] border border-white/80 p-6 shadow-[14px_18px_36px_rgba(148,163,184,0.35),-10px_-10px_24px_rgba(255,255,255,0.9)] flex flex-col max-h-[92vh] overflow-hidden text-slate-800">
        {/* Clay Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-[4px_6px_14px_rgba(99,102,241,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                {t('languageSettings')}
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(99,102,241,0.15)]">
                  22 Languages
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Indian 8th Schedule & NER Regional Multilingual Intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-[3px_4px_8px_rgba(148,163,184,0.3),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clay Tab Switcher */}
        <div className="mt-4 flex p-1.5 rounded-2xl bg-slate-200/60 shadow-[inset_2px_3px_6px_rgba(148,163,184,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]">
          <button
            onClick={() => setActiveTab('display')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'display'
                ? 'bg-white text-indigo-700 shadow-[4px_6px_14px_rgba(148,163,184,0.35),inset_1px_1px_2px_rgba(255,255,255,0.9)] scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>1. {t('selectDisplayLang')}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-50 text-[10px] uppercase font-mono">
              {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'broadcast'
                ? 'bg-white text-indigo-700 shadow-[4px_6px_14px_rgba(148,163,184,0.35),inset_1px_1px_2px_rgba(255,255,255,0.9)] scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>2. {t('broadcastLanguages')}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {broadcastLanguages.length} Active
            </span>
          </button>
        </div>

        {/* Filter Input */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Filter by language name (e.g., Assamese, Bengali, Bodo, Hindi, Manipuri)..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 shadow-[inset_2px_3px_5px_rgba(148,163,184,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Body Content */}
        <div className="mt-3 overflow-y-auto flex-1 pr-1 space-y-3 max-h-[50vh]">
          {activeTab === 'display' ? (
            /* TAB 1: Single UI Display Language Selector */
            <div className="space-y-2">
              <p className="text-xs text-slate-500 px-1">
                Select your primary navigation and operational language across the PANDAVAS platform:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredLanguages.map(lang => {
                  const isSelected = currentLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-3.5 rounded-2xl text-left transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-[4px_6px_16px_rgba(99,102,241,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-white/80 shadow-[4px_6px_12px_rgba(148,163,184,0.18),inset_1px_1px_2px_rgba(255,255,255,0.9)] hover:scale-[1.01]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm leading-snug">{lang.name}</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                              isSelected ? 'bg-indigo-700/60 text-indigo-100' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {lang.code.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`font-semibold text-xs ${
                              isSelected ? 'text-indigo-100' : 'text-indigo-600'
                            }`}
                          >
                            {lang.nativeName}
                          </span>
                          <span
                            className={`text-[10px] truncate ${
                              isSelected ? 'text-indigo-200' : 'text-slate-400'
                            }`}
                          >
                            • {lang.region}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-white text-indigo-600 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]'
                            : 'bg-slate-100 text-transparent border border-slate-200'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TAB 2: Multiple Languages Selection for Automated Broadcast & Advisories */
            <div className="space-y-3">
              {/* Informative Clay Card */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 shadow-[4px_6px_14px_rgba(245,158,11,0.15),inset_1px_1px_2px_rgba(255,255,255,0.9)]">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-[2px_3px_6px_rgba(245,158,11,0.35)]">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">
                      Multi-Language Automated Broadcast Engine
                    </h4>
                    <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                      {t('broadcastDesc')} When disaster alerts, road blockages, or bypass directives are issued, the PANDAVAS platform dispatches multilingual notifications simultaneously across every checked language.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions for Multi-Selection */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 pb-1">
                <span className="text-xs font-bold text-slate-700">
                  {broadcastLanguages.length} of 22 Languages Active for Dispatch
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAllBroadcastLanguages}
                    className="px-3 py-1.5 rounded-xl bg-white text-indigo-600 hover:text-indigo-800 text-[11px] font-bold shadow-[2px_3px_6px_rgba(148,163,184,0.25),inset_1px_1px_2px_rgba(255,255,255,0.9)] active:scale-95 transition-all"
                  >
                    Select All (22)
                  </button>
                  <button
                    onClick={clearBroadcastLanguages}
                    className="px-3 py-1.5 rounded-xl bg-white text-slate-500 hover:text-slate-800 text-[11px] font-bold shadow-[2px_3px_6px_rgba(148,163,184,0.25),inset_1px_1px_2px_rgba(255,255,255,0.9)] active:scale-95 transition-all"
                  >
                    Reset (English Only)
                  </button>
                </div>
              </div>

              {/* Multi-Select Checkboxes in Clay Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredLanguages.map(lang => {
                  const isChecked = broadcastLanguages.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      onClick={() => toggleBroadcastLanguage(lang.code)}
                      className={`p-3.5 rounded-2xl text-left transition-all flex items-center justify-between border ${
                        isChecked
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-300 shadow-[4px_6px_14px_rgba(16,185,129,0.18),inset_1px_1px_2px_rgba(255,255,255,0.9)]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-white/80 shadow-[3px_4px_10px_rgba(148,163,184,0.15),inset_1px_1px_2px_rgba(255,255,255,0.9)] opacity-75'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs">{lang.name}</span>
                          <span className="text-[10px] font-semibold text-emerald-700">
                            {lang.nativeName}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                          {lang.region} ({lang.script})
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isChecked
                            ? 'bg-emerald-500 text-white shadow-[2px_3px_6px_rgba(16,185,129,0.4),inset_1px_1px_2px_rgba(255,255,255,0.4)]'
                            : 'bg-slate-100 text-transparent border border-slate-300 shadow-[inset_1px_1px_2px_rgba(148,163,184,0.2)]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {testSent ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Multilingual Test Advisory Broadcasted!
              </span>
            ) : (
              <button
                type="button"
                onClick={handleTestBroadcast}
                className="px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:text-indigo-600 text-xs font-bold shadow-[3px_4px_8px_rgba(148,163,184,0.25),inset_1px_1px_2px_rgba(255,255,255,0.9)] active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-indigo-500" />
                <span>Test Broadcast ({broadcastLanguages.length} Langs)</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-[4px_6px_14px_rgba(99,102,241,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] active:scale-95 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('applySelection')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
