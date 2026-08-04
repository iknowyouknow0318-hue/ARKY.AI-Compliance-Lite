import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import policyRoutes from './routes/policyRoutes';
import controlRoutes from './routes/controlRoutes';
import scoreRoutes from './routes/scoreRoutes';
import assistantRoutes from './routes/assistantRoutes';
import checklistRoutes from './routes/checklistRoutes';
import stripeRoutes from './routes/stripeRoutes';
import auditLogRoutes from './routes/auditLogRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API Request Logger
app.use((req, res, next) => {
  console.log(`[API LOG] ${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AI Compliance Lite Core Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    providers: {
      auth: process.env.CLERK_SECRET_KEY ? 'Clerk (Production)' : 'Clerk / Sandbox Bridge',
      database: process.env.SUPABASE_URL ? 'Supabase PostgreSQL (RLS)' : 'Supabase Client / Sandbox',
      ai: process.env.OPENROUTER_API_KEY ? 'OpenRouter Multi-LLM' : 'AI Compliance Synthesizer Engine',
      payments: process.env.STRIPE_SECRET_KEY ? 'Stripe Active' : 'Stripe Sandbox'
    }
  });
});

// Raw body needed for Stripe webhook signature verification
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/controls', controlRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/logs', auditLogRoutes);


// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({ success: false, error: 'Internal enterprise compliance server error' });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 AI Compliance Lite Backend API running on port ${PORT}`);
    console.log(`=======================================================`);
  });
}

export default app;
