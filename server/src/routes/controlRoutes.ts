import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabase, insertAuditLog } from '../services/supabaseClient';

const router = Router();

const sandboxControlsStore: Record<string, any[]> = {};

// GET /api/controls - Fetch controls and status
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId || 'demo_user';

  if (supabase) {
    const { data, error } = await supabase.from('controls').select('*').eq('user_id', userId);
    if (!error && data && data.length > 0) {
      return res.json({ success: true, data });
    }
  }

  const controls = sandboxControlsStore[userId] || getInitialDefaultControls(userId);
  sandboxControlsStore[userId] = controls;
  return res.json({ success: true, data: controls });
});

// PATCH /api/controls/:id - Update control status or attach evidence
router.patch('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId || 'demo_user';
  const { id } = req.params;
  const { status, evidence_url, evidence_name, evidence_type } = req.body;

  const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
  if (status !== undefined) updatePayload.status = status;
  if (evidence_url !== undefined) updatePayload.evidence_url = evidence_url;
  if (evidence_name !== undefined) updatePayload.evidence_name = evidence_name;
  if (evidence_type !== undefined) updatePayload.evidence_type = evidence_type;

  if (supabase) {
    const { data, error } = await supabase
      .from('controls')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (!error && data && data.length > 0) {
      // Write audit log for control update
      await insertAuditLog(userId, 'control_updated', 'control', {
        control_id: id,
        status: status || data[0].status,
        evidence_name: evidence_name || null,
      });

      // If evidence was attached, log that separately
      if (evidence_url || evidence_name) {
        await insertAuditLog(userId, 'evidence_uploaded', 'evidence', {
          control_id: id,
          evidence_name: evidence_name,
          evidence_url: evidence_url,
          evidence_type: evidence_type,
        });
      }

      return res.json({ success: true, data: data[0] });
    }
  }

  // Sandbox fallback
  if (!sandboxControlsStore[userId]) {
    sandboxControlsStore[userId] = getInitialDefaultControls(userId);
  }
  const userControls = sandboxControlsStore[userId];
  const targetIdx = userControls.findIndex((c) => c.id === id);
  if (targetIdx !== -1) {
    Object.assign(userControls[targetIdx], updatePayload);
    const updated = userControls[targetIdx];

    // Write sandbox audit logs
    await insertAuditLog(userId, 'control_updated', 'control', {
      control_id: id,
      status: updated.status,
      evidence_name: updated.evidence_name || null,
    });
    if (evidence_url || evidence_name) {
      await insertAuditLog(userId, 'evidence_uploaded', 'evidence', {
        control_id: id,
        evidence_name,
        evidence_url,
        evidence_type,
      });
    }

    return res.json({ success: true, data: updated });
  }

  return res.status(404).json({ success: false, error: 'Control not found' });
});

function getInitialDefaultControls(userId: string) {
  return [
    {
      id: 'ctrl_01',
      user_id: userId,
      code: 'CC6.1',
      title: 'Logical Access Control & Multi-Factor Auth',
      description: 'Enforce MFA across all cloud infrastructure, developer repos, and identity platforms.',
      framework: 'SOC 2',
      category: 'Logical Access',
      status: 'Complete',
      evidence_url: 'https://docs.clerk.dev/mfa-audit-log.png',
      evidence_name: 'Clerk_MFA_Enforcement_Policy.png',
      evidence_type: 'Image Proof',
      assigned_role: 'Security Lead',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'ctrl_02',
      user_id: userId,
      code: 'CC6.6',
      title: 'Data Encryption In-Transit & At-Rest',
      description: 'TLS 1.3 for API endpoints and AES-256 for Supabase PostgreSQL tables.',
      framework: 'SOC 2',
      category: 'Data Protection',
      status: 'Complete',
      evidence_url: 'https://supabase.com/docs/security/encryption',
      evidence_name: 'Supabase_TLS1.3_AES256_Cert.pdf',
      evidence_type: 'System Config',
      assigned_role: 'DevOps Specialist',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'ctrl_03',
      user_id: userId,
      code: 'CC8.1',
      title: 'Automated CI/CD Change Management Controls',
      description: 'Require mandatory peer review and automated security tests before production deploy.',
      framework: 'SOC 2',
      category: 'Change Management',
      status: 'Complete',
      evidence_url: 'https://github.com/arky/repo/actions/workflows/ci.yml',
      evidence_name: 'GitHub_Actions_CICD_PeerReview_Proof.pdf',
      evidence_type: 'CI/CD Config',
      assigned_role: 'Lead Developer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'ctrl_04',
      user_id: userId,
      code: '164.312(a)',
      title: 'HIPAA Unique User Identification & Access Revocation',
      description: 'Assign unique logins to each system operator and auto-revoke access upon termination.',
      framework: 'HIPAA',
      category: 'Technical Safeguard',
      status: 'Complete',
      evidence_url: 'https://clerk.com/docs/security/mfa',
      evidence_name: 'Clerk_MFA_User_Auth_Policy.pdf',
      evidence_type: 'Identity Config',
      assigned_role: 'Compliance Lead',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'ctrl_05',
      user_id: userId,
      code: 'GDPR-Art32',
      title: 'GDPR Technical Confidentiality & Resiliency Assessment',
      description: 'Regular testing and evaluating technical & organizational security measures.',
      framework: 'GDPR',
      category: 'Data Confidentiality',
      status: 'Complete',
      evidence_url: 'https://supabase.com/docs/security/gdpr',
      evidence_name: 'GDPR_Art32_Resiliency_Audit.pdf',
      evidence_type: 'Audit Report',
      assigned_role: 'DPO / Founder',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
}

export default router;
