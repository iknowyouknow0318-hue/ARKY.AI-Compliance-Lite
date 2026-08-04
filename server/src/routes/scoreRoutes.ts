import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabase, insertAuditLog } from '../services/supabaseClient';

const router = Router();

// GET /api/score - Calculate real-time compliance score from live DB data
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId || 'demo_user';

  // ─── Live Calculation from DB ─────────────────────────────────────────────
  let policyScore = 0;
  let controlScore = 0;
  let evidenceScore = 0;
  let frameworkBreakdown: Record<string, number> = {};
  let recommendations: string[] = [];
  let totalPolicies = 0;
  let totalControls = 0;
  let completedControls = 0;
  let controlsWithEvidence = 0;

  if (supabase) {
    // Query policies for this user
    const { data: policies } = await supabase
      .from('policies')
      .select('framework, status')
      .eq('user_id', userId);

    // Query controls for this user
    const { data: controls } = await supabase
      .from('controls')
      .select('framework, status, evidence_url')
      .eq('user_id', userId);

    if (policies) {
      totalPolicies = policies.length;
      // Score based on policy existence and status
      const publishedPolicies = policies.filter(p => p.status === 'Published' || p.status === 'Approved');
      policyScore = totalPolicies === 0 ? 0 : Math.min(100, Math.round((publishedPolicies.length / Math.max(totalPolicies, 3)) * 100));

      // Framework-level breakdown by policy
      const frameworks = ['SOC 2', 'HIPAA', 'GDPR'];
      frameworks.forEach(fw => {
        const fwPolicies = policies.filter(p => p.framework === fw);
        frameworkBreakdown[fw] = fwPolicies.length > 0 ? 85 + Math.min(15, fwPolicies.length * 5) : 0;
      });
    }

    if (controls) {
      totalControls = controls.length;
      completedControls = controls.filter(c => c.status === 'Complete').length;
      controlsWithEvidence = controls.filter(c => c.evidence_url && c.evidence_url.trim() !== '').length;

      controlScore = totalControls === 0 ? 0 : Math.round((completedControls / totalControls) * 100);
      evidenceScore = totalControls === 0 ? 0 : Math.round((controlsWithEvidence / totalControls) * 100);

      // Build recommendations for incomplete controls
      const incomplete = controls.filter(c => c.status !== 'Complete').slice(0, 3);
      recommendations = incomplete.map(c => `Complete control implementation and attach evidence`);

      // Fill default recommendations if needed
      if (recommendations.length === 0) {
        recommendations = [
          'Upload GitHub branch protection screenshot for Control CC8.1 (+4% score impact)',
          'Attach signed BAA agreement documentation for Supabase & Clerk (+3% score impact)',
          'Complete annual executive risk assessment questionnaire (+2% score impact)'
        ];
      }
    }
  } else {
    // Sandbox defaults
    policyScore = 85;
    controlScore = 80;
    evidenceScore = 90;
    frameworkBreakdown = { 'SOC 2': 88, 'HIPAA': 82, 'GDPR': 85 };
    recommendations = [
      'Upload GitHub branch protection screenshot for Control CC8.1 (+4% score impact)',
      'Attach signed BAA agreement documentation for Supabase & Clerk (+3% score impact)',
      'Complete annual executive risk assessment questionnaire (+2% score impact)'
    ];
  }

  // Weighted formula: Policies (40%) + Controls (40%) + Evidence (20%)
  const overallScore = Math.round(policyScore * 0.40 + controlScore * 0.40 + evidenceScore * 0.20);

  let riskLevel = 'Low Risk';
  if (overallScore < 50) riskLevel = 'High Risk';
  else if (overallScore < 80) riskLevel = 'Moderate Risk';

  const now = new Date().toISOString();
  const scoreData = {
    overall_score: overallScore,
    risk_level: riskLevel,
    breakdown: {
      'Policies (40% weight)': policyScore,
      'Controls (40% weight)': controlScore,
      'Evidence Proofs (20% weight)': evidenceScore,
      ...frameworkBreakdown,
    },
    audit_readiness: `${overallScore}% Audit Ready — ${riskLevel}`,
    recommendations,
    calculated_at: now,
  };

  // Upsert into compliance_scores table
  if (supabase) {
    const { error } = await supabase
      .from('compliance_scores')
      .upsert([
        {
          user_id: userId,
          overall_score: overallScore,
          risk_level: riskLevel,
          breakdown: scoreData.breakdown,
          recommendations,
          updated_at: now,
        }
      ], { onConflict: 'user_id' });

    if (error) {
      console.warn('[Score] Failed to upsert compliance_scores:', error.message);
    }
  }

  // Write audit log
  await insertAuditLog(userId, 'score_calculated', 'compliance_score', {
    overall_score: overallScore,
    risk_level: riskLevel,
    total_policies: totalPolicies,
    completed_controls: completedControls,
  });

  return res.json({ success: true, data: scoreData });
});

export default router;
