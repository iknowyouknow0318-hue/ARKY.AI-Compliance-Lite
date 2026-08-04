import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { AuditLog } from '../types';
import { supabase } from '../services/supabaseClient';

const router = Router();

// In-memory store for audit logs in sandbox mode
const sandboxLogsStore: Record<string, AuditLog[]> = {};

// Helper to seed initial audit logs if empty
function getInitialLogs(userId: string): AuditLog[] {
  const now = Date.now();
  return [
    {
      id: `log_${now}_01`,
      user_id: userId,
      action: 'policy_generated',
      resource: 'policy',
      resource_name: 'Information Security & Access Control Policy',
      details: { framework: 'SOC 2', version: 1, model: 'GPT-4' },
      ip_address: '192.168.1.1',
      created_at: new Date(now - 3600000 * 2).toISOString(),
    },
    {
      id: `log_${now}_05`,
      user_id: userId,
      action: 'evidence_renamed',
      resource: 'evidence',
      resource_name: 'Renamed "mfa_config.png" ➔ "AWS_MFA_Enforcement_Proof.png"',
      details: { oldName: 'mfa_config.png', newName: 'AWS_MFA_Enforcement_Proof.png' },
      ip_address: '192.168.1.1',
      created_at: new Date(now - 3600000 * 3).toISOString(),
    },
    {
      id: `log_${now}_02`,
      user_id: userId,
      action: 'control_marked_complete',
      resource: 'control',
      resource_name: 'CC6.1 - Logical Access Control',
      details: { status: 'Complete', evidenceAttached: true },
      ip_address: '192.168.1.1',
      created_at: new Date(now - 3600000 * 5).toISOString(),
    },
    {
      id: `log_${now}_03`,
      user_id: userId,
      action: 'evidence_uploaded',
      resource: 'evidence',
      resource_name: 'AWS_MFA_Enforcement_Proof.png',
      details: { fileSize: '1.2MB', fileType: 'image/png' },
      ip_address: '192.168.1.1',
      created_at: new Date(now - 3600000 * 12).toISOString(),
    },
    {
      id: `log_${now}_04`,
      user_id: userId,
      action: 'onboarding_completed',
      resource: 'user',
      resource_name: 'Company Profile & Compliance Roadmap',
      details: { targetFrameworks: ['SOC 2', 'HIPAA'] },
      ip_address: '192.168.1.1',
      created_at: new Date(now - 3600000 * 24).toISOString(),
    },
  ];
}

// GET /api/logs - Fetch paginated user audit logs
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId || 'demo_user';
  const { action, limit = 50 } = req.query;

  if (supabase) {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (action && typeof action === 'string' && action !== 'all') {
      query = query.eq('action', action);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return res.json({ success: true, data });
    }
  }

  // Fallback to sandbox store
  if (!sandboxLogsStore[userId]) {
    sandboxLogsStore[userId] = getInitialLogs(userId);
  }

  let logs = sandboxLogsStore[userId];
  if (action && typeof action === 'string' && action !== 'all') {
    logs = logs.filter((l) => l.action === action);
  }

  return res.json({ success: true, data: logs });
});

// POST /api/logs/action - Write a new audit log entry (called from client for client-side actions)
router.post('/action', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId || 'demo_user';
  const { action, resource, metadata = {} } = req.body;

  if (!action || !resource) {
    return res.status(400).json({ success: false, error: 'action and resource are required' });
  }

  const logEntry: AuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    user_id: userId,
    action,
    resource,
    details: metadata,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from('audit_logs').insert([{
      user_id: userId,
      action,
      resource,
      metadata,
      created_at: logEntry.created_at,
    }]);
    if (error) {
      console.warn('[Audit Log] Write error:', error.message);
    } else {
      return res.json({ success: true });
    }
  }

  // Sandbox: store in memory
  if (!sandboxLogsStore[userId]) sandboxLogsStore[userId] = getInitialLogs(userId);
  sandboxLogsStore[userId].unshift(logEntry);
  return res.json({ success: true });
});

// POST /api/logs/export - Export audit logs as CSV or JSON format
router.post('/export', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId || 'demo_user';
  const { format = 'csv' } = req.body;

  let logs = sandboxLogsStore[userId] || getInitialLogs(userId);
  if (supabase) {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (data && data.length > 0) logs = data;
  }

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="arky_audit_logs.json"');
    return res.send(JSON.stringify(logs, null, 2));
  }

  // Generate CSV format
  const headers = ['ID', 'Date & Time', 'Action', 'Resource', 'Resource Name', 'IP Address'];
  const csvRows = [headers.join(',')];

  logs.forEach((log) => {
    const row = [
      `"${log.id}"`,
      `"${log.created_at}"`,
      `"${log.action}"`,
      `"${log.resource}"`,
      `"${(log.resource_name || '').replace(/"/g, '""')}"`,
      `"${log.ip_address || 'N/A'}"`,
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="arky_audit_logs.csv"');
  return res.send(csvContent);
});

export default router;
