import React, { useState, useEffect } from 'react';
import { X, Printer, ShieldCheck, Tag, Calendar, Edit3, Save, History, Check } from 'lucide-react';
import { Policy, PolicyVersion } from '../types';
import { api } from '../services/api';
import { useComplianceStore } from '../store/useComplianceStore';

interface PolicyViewModalProps {
  policy: Policy | null;
  onClose: () => void;
}

export const PolicyViewModal: React.FC<PolicyViewModalProps> = ({ policy, onClose }) => {
  const { updatePolicyInStore } = useComplianceStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableContent, setEditableContent] = useState<string>('');
  const [editableTitle, setEditableTitle] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [versions, setVersions] = useState<PolicyVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  useEffect(() => {
    if (policy) {
      setEditableContent(policy.content);
      setEditableTitle(policy.title);
      setIsEditing(false);
      api.fetchPolicyVersions(policy.id).then((v) => {
        if (v && v.length > 0) setVersions(v);
      });
    }
  }, [policy?.id]);

  if (!policy) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const updated = await api.editPolicy(policy.id, editableContent, editableTitle);
    setIsSaving(false);
    if (updated) {
      updatePolicyInStore(policy.id, updated);
      setIsEditing(false);
    } else {
      // Local fallback update if offline
      const newVer = (policy.version || 1) + 1;
      const newEditCount = (policy.edit_count || 0) + 1;
      updatePolicyInStore(policy.id, {
        content: editableContent,
        title: editableTitle,
        version: newVer,
        edit_count: newEditCount,
        last_edited_at: new Date().toISOString(),
      });
      setIsEditing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-500/20 text-brand-400 border border-brand-500/30">
                {policy.framework}
              </span>
              <span className="text-xs font-semibold text-slate-400">{policy.category}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                v{policy.version}.0 {policy.status}
              </span>
              {policy.edit_count ? (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                  Edited {policy.edit_count} {policy.edit_count === 1 ? 'time' : 'times'}
                </span>
              ) : null}
            </div>

            {isEditing ? (
              <input
                type="text"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="text-xl font-extrabold text-white bg-slate-900 border border-slate-700 px-3 py-1 rounded-xl w-full focus:outline-none focus:border-brand-500 mt-1"
              />
            ) : (
              <h2 className="text-xl font-extrabold text-white tracking-tight">{policy.title}</h2>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tags & Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-brand-400" />
            {policy.compliance_tags?.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
                {tag}
              </span>
            ))}
          </div>

          {policy.model_used && (
            <span className="text-[10px] text-slate-500 italic">
              Model: <code className="text-brand-400">{policy.model_used}</code>
            </span>
          )}
        </div>

        {/* Document Content View / Edit */}
        <div className="flex-1 overflow-y-auto my-4 p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 font-mono text-xs text-slate-200 leading-relaxed select-text">
          {isEditing ? (
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full h-80 bg-transparent text-slate-100 font-mono text-xs focus:outline-none resize-none"
            />
          ) : (
            <div className="whitespace-pre-wrap">{policy.content}</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Generated: {new Date(policy.created_at).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving Version...' : 'Save Edit (Increment Version)'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-400" />
                <span>Edit Policy</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
