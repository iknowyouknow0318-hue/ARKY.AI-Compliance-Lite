import React, { useEffect, useState } from 'react';
import {
  History,
  Download,
  Filter,
  ShieldCheck,
  Calendar,
  Search,
  FileSpreadsheet,
  Clock,
  Lock,
} from 'lucide-react';
import { api } from '../services/api';
import { AuditLog } from '../types';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    api.fetchAuditLogs(selectedAction).then((data) => {
      setLogs(data);
      setIsLoading(false);
    });
  }, [selectedAction]);

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.resource.toLowerCase().includes(q) ||
      (log.resource_name || '').toLowerCase().includes(q)
    );
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'evidence_renamed':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-sky-500/10 text-sky-700 border border-sky-500/20 font-mono">
            File Renamed
          </span>
        );
      case 'policy_generated':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-500/10 text-indigo-700 border border-indigo-500/20 font-mono">
            Policy Generated
          </span>
        );
      case 'control_marked_complete':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-mono">
            Control Complete
          </span>
        );
      case 'evidence_uploaded':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-700 border border-purple-500/20 font-mono">
            Evidence Uploaded
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200 font-mono">
            {action.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/90 border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold text-sky-600 font-mono uppercase tracking-wider">
              Auditor Verification Trail
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Audit Activity &amp; Revision History Trail
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Immutable log of all compliance activities, evidence uploads, file renames, and policy modifications.
          </p>
        </div>

        {/* CSV Export Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => api.exportAuditLogs('csv')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Log CSV</span>
          </button>
        </div>
      </div>

      {/* Retention Notice Bar */}
      <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between gap-4 text-xs text-slate-700">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>12-Month Retention Active:</strong> Audit logs and file revision histories are stored in encrypted WORM storage for auditor verification.
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px] font-extrabold font-mono shrink-0">
          SOC 2 CC6.8 Compliant
        </span>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action or file name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-sky-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'evidence_renamed', 'policy_generated', 'control_marked_complete', 'evidence_uploaded', 'onboarding_completed'].map(
            (action) => (
              <button
                key={action}
                onClick={() => setSelectedAction(action)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedAction === action
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-sky-100'
                }`}
              >
                {action === 'all' ? 'All Logs' : action.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white/90 rounded-3xl border border-sky-100/90 shadow-xl shadow-sky-500/5 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-sky-100 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>Date &amp; Timestamp</span>
          <div className="flex items-center gap-16">
            <span>Action Badge</span>
            <span>Resource Name / File History</span>
            <span>IP Address</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500 italic">Loading audit trail...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 italic">No audit log events match your search criteria.</div>
        ) : (
          <div className="divide-y divide-sky-100">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-sky-50/50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{new Date(log.created_at).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 font-mono">ID: {log.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 self-end md:self-center">
                  <div>{getActionBadge(log.action)}</div>
                  <div className="w-64 text-right md:text-left truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{log.resource_name || log.resource}</p>
                    <p className="text-[10px] text-slate-500 font-mono capitalize">
                      {log.details?.oldName && log.details?.newName
                        ? `${log.details.oldName} → ${log.details.newName}`
                        : log.resource}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{log.ip_address || '127.0.0.1'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
