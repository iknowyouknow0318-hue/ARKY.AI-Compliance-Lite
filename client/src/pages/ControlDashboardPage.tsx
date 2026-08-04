import React, { useState } from 'react';
import { 
  CheckSquare, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Filter, 
  Plus, 
  ShieldCheck,
  FileCheck,
  Edit3
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';
import { EvidenceUploadModal } from '../components/EvidenceUploadModal';
import { Control } from '../types';
import { api } from '../services/api';

export const ControlDashboardPage: React.FC = () => {
  const { controls, updateControl } = useComplianceStore();
  const [selectedFramework, setSelectedFramework] = useState<string>('All');
  const [activeUploadControl, setActiveUploadControl] = useState<Control | null>(null);
  const [renamingControl, setRenamingControl] = useState<Control | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');

  const filteredControls = controls.filter((c) => {
    if (selectedFramework === 'All') return true;
    return c.framework === selectedFramework;
  });

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingControl || !newFileName.trim()) return;

    const oldName = renamingControl.evidence_name || 'evidence_file.png';
    const updatedName = newFileName.trim();

    // Update in store & API
    updateControl(renamingControl.id, { evidence_name: updatedName });
    await api.logAuditAction('evidence_renamed', 'evidence', {
      oldName,
      newName: updatedName,
      controlCode: renamingControl.code
    });

    setRenamingControl(null);
    setNewFileName('');
  };

  const getStatusBadge = (status: Control['status']) => {
    switch (status) {
      case 'Complete':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Complete
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3 text-brand-400 animate-pulse" /> In Progress
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold text-sky-600 font-mono uppercase tracking-wider">Control Matrix &amp; Evidence Binder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Compliance Control Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Attach screenshot proofs, configuration links, and system logs for auditor sign-off.
          </p>
        </div>

        {/* Framework Filter Buttons & Quick Complete Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-sky-50 p-1.5 rounded-2xl border border-sky-100">
            {['All', 'SOC 2', 'HIPAA', 'GDPR'].map((fw) => (
              <button
                key={fw}
                onClick={() => setSelectedFramework(fw)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedFramework === fw
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              controls.forEach((c) => {
                useComplianceStore.getState().updateControl(c.id, {
                  status: 'Complete',
                  evidence_url: c.evidence_url || 'https://storage.supabase.co/evidence/mfa_config.png',
                });
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete All Controls</span>
          </button>
        </div>
      </div>

      {/* Control Matrix Table */}
      <div className="bg-white/90 rounded-3xl border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-sky-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Control Code &amp; Title</span>
          <div className="flex items-center gap-12">
            <span>Evidence Proof</span>
            <span>Status</span>
            <span>Action</span>
          </div>
        </div>

        <div className="divide-y divide-sky-100">
          {filteredControls.map((ctrl) => (
            <div key={ctrl.id} className="p-5 hover:bg-sky-50/50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-sky-500/10 text-sky-700 border border-sky-500/20 font-mono">
                    {ctrl.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{ctrl.framework} • {ctrl.category}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{ctrl.title}</h4>
                <p className="text-xs text-slate-600 leading-normal">{ctrl.description}</p>
              </div>

              <div className="flex items-center gap-6 self-end md:self-center">
                {ctrl.evidence_name ? (
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <a
                        href={ctrl.evidence_url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ctrl.evidence_name}</span>
                      </a>
                      <button
                        onClick={() => {
                          setRenamingControl(ctrl);
                          setNewFileName(ctrl.evidence_name || '');
                        }}
                        title="Rename Evidence File"
                        className="p-1 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">{ctrl.evidence_type}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No Evidence</span>
                )}

                <div>{getStatusBadge(ctrl.status)}</div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveUploadControl(ctrl)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
                    <span>Attach</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Evidence Upload Modal */}
      <EvidenceUploadModal
        control={activeUploadControl}
        onClose={() => setActiveUploadControl(null)}
      />

      {/* File Rename Modal */}
      {renamingControl && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sky-100 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-600" />
                Rename Evidence File
              </h3>
              <button
                onClick={() => setRenamingControl(null)}
                className="text-xs text-slate-400 hover:text-slate-900 font-bold"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Control Reference
                </label>
                <span className="text-xs font-mono font-bold text-sky-600 block">
                  {renamingControl.code} — {renamingControl.title}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current File Name
                </label>
                <span className="text-xs text-slate-500 font-mono block">
                  {renamingControl.evidence_name || 'evidence_file.png'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New File Name
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. mfa_enforcement_okta_2026.png"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-sky-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setRenamingControl(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-sky-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  Save &amp; Log History
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
