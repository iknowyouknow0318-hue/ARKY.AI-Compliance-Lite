import React, { useEffect } from 'react';
import {
  ListTodo,
  Download,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';
import { api } from '../services/api';
import { jsPDF } from 'jspdf';

export const AuditChecklistPage: React.FC = () => {
  const {
    checklists,
    setChecklists,
    toggleChecklistItem,
    markAllChecklistItemsComplete,
    onboardingData,
    policies,
    controls,
    score,
    setLastExportedAt,
    setActiveTab,
  } = useComplianceStore();

  useEffect(() => {
    api.fetchChecklists().then((res) => {
      if (res && res.length > 0) setChecklists(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportPDF = async (checklistTitle: string, items: any[]) => {
    const doc = new jsPDF();
    const company = onboardingData.companyName || 'Acme SaaS Inc';
    const industry = onboardingData.industry || 'B2B SaaS / FinTech';
    const cloudProvider = onboardingData.cloudProvider || 'AWS / Supabase';
    const dateStr = new Date().toLocaleDateString();
    const completedCount = items.filter((i) => i.status === 'completed').length;
    const overallScore = score?.overall_score ?? 0;

    // ── COVER PAGE ────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('ARKY AI COMPLIANCE', 14, 40);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Auditor Readiness Binder & Verification Report', 14, 50);
    doc.line(14, 56, 196, 56);

    doc.setFontSize(11);
    doc.text(`Organization Name: ${company}`, 14, 75);
    doc.text(`Industry Sector: ${industry}`, 14, 83);
    doc.text(`Primary Infrastructure: ${cloudProvider}`, 14, 91);
    doc.text(`Date of Generation: ${dateStr}`, 14, 99);
    doc.text(`Checklist Package: ${checklistTitle}`, 14, 107);
    doc.text(`Verification Status: AUDIT READY (Stage 1)`, 14, 115);

    // Score box on cover
    doc.rect(14, 130, 182, 50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('COMPLIANCE READINESS SUMMARY', 20, 142);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Overall Readiness Score: ${overallScore}%  (${score?.risk_level ?? 'Not Calculated'})`, 20, 152);
    doc.text(`Total Checklist Items: ${items.length}`, 20, 160);
    doc.text(`Completed: ${completedCount} / ${items.length} (${Math.round((completedCount / Math.max(items.length, 1)) * 100)}%)`, 20, 168);

    doc.setFontSize(9);
    doc.text('Generated via Arky AI Engine — Confidential Auditor Document', 14, 280);

    // ── PAGE 2: TABLE OF CONTENTS ────────────────────────────────────────
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TABLE OF CONTENTS', 14, 20);
    doc.line(14, 24, 196, 24);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const tocItems = [
      '1. Cover Page & Executive Summary',
      '2. Table of Contents',
      '3. Generated Compliance Policies',
      '4. Control Matrix & Evidence Summary',
      '5. Audit Checklist Detail',
    ];
    tocItems.forEach((item, i) => doc.text(item, 14, 40 + i * 10));

    // ── PAGE 3: POLICIES SECTION ─────────────────────────────────────────
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('3. Generated Compliance Policies', 14, 20);
    doc.line(14, 24, 196, 24);

    if (policies.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('No policies have been generated yet.', 14, 36);
    } else {
      let yPos = 36;
      policies.forEach((pol, idx) => {
        if (yPos > 260) { doc.addPage(); yPos = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${idx + 1}. [${pol.framework}] ${pol.title}`, 14, yPos);
        yPos += 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`   Status: ${pol.status} | Version: ${pol.version} | Category: ${pol.category}`, 14, yPos);
        yPos += 5;
        doc.text(`   Tags: ${(pol.compliance_tags || []).join(', ')}`, 14, yPos);
        yPos += 10;
      });
    }

    // ── PAGE 4: CONTROLS SUMMARY ─────────────────────────────────────────
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('4. Control Matrix & Evidence Summary', 14, 20);
    doc.line(14, 24, 196, 24);

    if (controls.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('No controls loaded yet.', 14, 36);
    } else {
      let yCtrl = 36;
      controls.forEach((ctrl, idx) => {
        if (yCtrl > 250) { doc.addPage(); yCtrl = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        const statusMark = ctrl.status === 'Complete' ? '✓' : '○';
        doc.text(`${statusMark} ${ctrl.code}: ${ctrl.title}`, 14, yCtrl);
        yCtrl += 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`   Framework: ${ctrl.framework} | Status: ${ctrl.status} | Evidence: ${ctrl.evidence_name || 'None'}`, 14, yCtrl);
        yCtrl += 10;
      });
    }

    // ── PAGE 5: CHECKLIST DETAIL ─────────────────────────────────────────
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`5. ${checklistTitle} — Detailed Audit Checklist`, 14, 20);
    doc.line(14, 24, 196, 24);

    let y = 34;
    items.forEach((item, index) => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      const statusTag = item.status === 'completed' ? '[PASSED ✓]' : '[PENDING]';
      const itemLines = doc.splitTextToSize(`${statusTag} ${index + 1}. ${item.text}`, 180);
      doc.text(itemLines, 14, y);
      y += itemLines.length * 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Category: ${item.category} | Control Code: ${item.code || 'N/A'}`, 18, y);
      y += 10;
    });

    doc.save(`${company.replace(/\s+/g, '_')}_Auditor_Readiness_Binder.pdf`);

    // ── Post-export: write audit log + update lastExportedAt ─────────────
    const exportedAt = new Date().toISOString();
    setLastExportedAt(exportedAt);

    try {
      await api.logAuditAction('pdf_exported', 'compliance_binder', {
        checklist_title: checklistTitle,
        overall_score: overallScore,
        policies_count: policies.length,
        controls_count: controls.length,
        completed_checklist_items: completedCount,
        exported_at: exportedAt,
      });
    } catch {
      console.warn('[PDF Export] Audit log write failed (non-blocking).');
    }
  };


  return (
    <div className="space-y-6 animate-fadeIn pb-12">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ListTodo className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Auditor Preparedness Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Audit Prep Checklists & PDF Export
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate auditor-ready compliance binders for Big-4 SOC 2 Type II and HIPAA assessors.
          </p>
        </div>

        {/* Score summary card */}
        {score && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-lg font-black text-emerald-400">{score.overall_score}%</p>
              <p className="text-[10px] text-slate-300 font-medium">{score.risk_level}</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
          <p className="text-2xl font-black text-brand-400">{policies.length}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Policies Generated</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
          <p className="text-2xl font-black text-emerald-400">
            {controls.filter(c => c.status === 'Complete').length}/{controls.length}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Controls Complete</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
          <p className="text-2xl font-black text-indigo-400">
            {controls.filter(c => c.evidence_url).length}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Evidence Attached</p>
        </div>
      </div>

      {/* Checklists */}
      <div className="space-y-6">
        {checklists.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-dashed border-slate-700 text-center space-y-4">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <div>
              <p className="text-sm font-bold text-slate-400">No checklists loaded yet</p>
              <p className="text-xs text-slate-500 mt-1">Complete Step 2 (Policy Generator) to unlock your audit checklists.</p>
            </div>
            <button
              onClick={() => setActiveTab('policies')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all"
            >
              <span>Go to Policy Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          checklists.map((chk) => (
            <div key={chk.id} className="glass-card rounded-3xl border border-slate-800 p-6 space-y-4">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-brand-500/20 text-brand-400 border border-brand-500/30">
                      {chk.framework}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{chk.completion_percentage}% Completed</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">{chk.title}</h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => markAllChecklistItemsComplete(chk.id)}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Complete All</span>
                  </button>

                  <button
                    onClick={() => exportPDF(chk.title, chk.items)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export PDF Binder</span>
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${chk.completion_percentage}%` }}
                />
              </div>

              {/* Checklist Items */}
              <div className="space-y-2.5">
                {chk.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(chk.id, item.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      item.status === 'completed'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-emerald-500 text-white' : 'border border-slate-700 bg-slate-900'
                      }`}>
                        {item.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${item.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {item.text}
                        </p>
                        <span className="text-[10px] text-slate-400">{item.category} • Code: {item.code || 'SOC 2'}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                      item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
