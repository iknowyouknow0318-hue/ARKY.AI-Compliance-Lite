import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { AIService } from '../services/aiService';
import { supabase } from '../services/supabaseClient';

const router = Router();

// POST /api/assistant/chat - Q&A AI compliance copilot with intent routing + DB retrieval
router.post('/chat', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId || 'demo_user';
  const { question, context } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ success: false, error: 'Valid prompt question is required' });
  }

  // ─── Retrieve user's data from Supabase ──────────────────────────────────
  let userContext: {
    policies: any[];
    controls: any[];
    checklists: any[];
    score: any | null;
  } = { policies: [], controls: [], checklists: [], score: null };

  if (supabase) {
    const [policiesRes, controlsRes, checklistsRes, scoreRes] = await Promise.all([
      supabase.from('policies').select('id, title, framework, status, compliance_tags').eq('user_id', userId),
      supabase.from('controls').select('id, code, title, framework, status, evidence_url').eq('user_id', userId),
      supabase.from('checklists').select('id, title, framework, completion_percentage').eq('user_id', userId),
      supabase.from('compliance_scores').select('overall_score, risk_level, breakdown').eq('user_id', userId).single(),
    ]);

    if (policiesRes.data) userContext.policies = policiesRes.data;
    if (controlsRes.data) userContext.controls = controlsRes.data;
    if (checklistsRes.data) userContext.checklists = checklistsRes.data;
    if (scoreRes.data) userContext.score = scoreRes.data;
  }

  try {
    const result = await AIService.answerQuestion(question, userContext, context);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
