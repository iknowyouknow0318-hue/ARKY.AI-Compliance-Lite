import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { supabase, insertAuditLog } from '../services/supabaseClient';

const router = Router();

// In-memory sandbox store for user profiles
const sandboxUserStore: Record<string, any> = {};

// POST /api/users/onboarding - Save or update onboarding data
router.post('/onboarding', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;
  const { companyName, industry, cloudProvider, dataTypes, teamSize, targetFrameworks } = req.body;

  const now = new Date().toISOString();
  const profileData = {
    user_id: userId,
    email: req.userEmail,
    company_name: companyName || '',
    industry: industry || '',
    cloud_provider: cloudProvider || '',
    data_types: dataTypes || [],
    team_size: teamSize || '',
    target_frameworks: targetFrameworks || [],
    onboarding_completed: true,
    onboarding_completed_at: now,
    updated_at: now,
  };

  if (supabase) {
    const { data, error } = await supabase
      .from('users')
      .upsert([{ ...profileData, created_at: now }], { onConflict: 'user_id' })
      .select();

    if (!error && data) {
      await insertAuditLog(userId, 'onboarding_completed', 'user', {
        company_name: companyName,
        target_frameworks: targetFrameworks,
      });
      return res.json({ success: true, data: data[0] });
    }

    if (error) {
      console.error('[User Routes] Onboarding upsert error:', error.message);
    }
  }

  // Sandbox mode
  sandboxUserStore[userId] = { ...profileData, id: userId };
  console.log(`[Audit Log] onboarding_completed | user=${userId} | company=${companyName}`);
  return res.json({ success: true, data: sandboxUserStore[userId], message: 'Onboarding saved (sandbox mode)' });
});

// GET /api/users/profile - Fetch user profile including subscription_status
router.get('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId!;

  if (supabase) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!error && data) {
      return res.json({ success: true, data });
    }
  }

  // Return sandbox profile
  const profile = sandboxUserStore[userId] || {
    user_id: userId,
    email: req.userEmail,
    company_name: '',
    industry: '',
    subscription_status: 'free',
    onboarding_completed: false,
  };

  return res.json({ success: true, data: profile });
});

export default router;
