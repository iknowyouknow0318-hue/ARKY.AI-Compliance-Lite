import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { supabase, insertAuditLog } from '../services/supabaseClient';

dotenv.config();

const router = Router();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, { apiVersion: '2025-06-30' as Stripe.LatestApiVersion }) : null;

// POST /api/stripe/create-checkout-session
router.post('/create-checkout-session', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { plan = 'growth_299' } = req.body;
  const userEmail = req.userEmail || 'founder@startup.io';

  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: plan === 'enterprise_999' ? 'AI Compliance Lite - Enterprise' : 'AI Compliance Lite - Growth Plan',
                description: 'Full SOC 2, HIPAA, and GDPR AI compliance automation platform',
              },
              unit_amount: plan === 'enterprise_999' ? 99900 : 29900,
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}&checkout=success`,
        cancel_url: `${req.headers.origin || 'http://localhost:5173'}/settings`,
        customer_email: userEmail,
      });

      return res.json({ success: true, url: session.url });
    } catch (err: any) {
      console.error('[Stripe Error]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // Fallback demo redirect for local sandbox mode
  return res.json({
    success: true,
    url: `${req.headers.origin || 'http://localhost:5173'}/dashboard?checkout=success_sandbox`,
    message: 'Sandbox mode checkout activated successfully!'
  });
});

// POST /api/stripe/webhook
router.post('/webhook', async (req: any, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  // Security: always require a valid webhook secret in production
  if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not set. Rejecting webhook.');
    return res.status(400).json({ error: 'Webhook secret not configured.' });
  }

  if (!sig) {
    console.error('[Stripe Webhook] Missing stripe-signature header. Rejecting request.');
    return res.status(400).json({ error: 'Missing stripe-signature header.' });
  }

  let event: Stripe.Event;

  if (stripe) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error('[Stripe Webhook Signature Error]', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // Stripe not configured — reject
    return res.status(400).json({ error: 'Stripe not configured on this server.' });
  }

  // Process key webhook event types
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data?.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const newStatus = subscription.status; // 'active', 'past_due', 'canceled', etc.

      console.log(`[Stripe Webhook] Subscription ${event.type}: ${subscription.id} status=${newStatus}`);

      // Update users.subscription_status in Supabase
      if (supabase && customerId) {
        const { error } = await supabase
          .from('users')
          .update({
            subscription_status: newStatus === 'active' ? 'active' : newStatus === 'canceled' ? 'canceled' : 'free',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', customerId);

        if (error) {
          console.error('[Stripe Webhook] Failed to update user subscription_status:', error.message);
        } else {
          // Fetch user_id for audit log
          const { data: userData } = await supabase
            .from('users')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (userData?.user_id) {
            await insertAuditLog(userData.user_id, 'stripe_subscription_updated', 'subscription', {
              subscription_id: subscription.id,
              new_status: newStatus,
              customer_id: customerId,
            });
          }
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data?.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      console.log(`[Stripe Webhook] Subscription canceled: ${subscription.id}`);

      if (supabase && customerId) {
        await supabase
          .from('users')
          .update({ subscription_status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_customer_id', customerId);
      }
      break;
    }

    case 'checkout.session.completed': {
      const session = event.data?.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const customerEmail = session.customer_email;

      console.log(`[Stripe Webhook] Checkout completed for ${customerEmail}`);

      // Link stripe_customer_id to user by email if not already linked
      if (supabase && customerId && customerEmail) {
        await supabase
          .from('users')
          .update({
            stripe_customer_id: customerId,
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('email', customerEmail);
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data?.object as Stripe.PaymentIntent;
      console.log(`[Stripe Webhook] PaymentIntent succeeded: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return res.json({ received: true });
});


export default router;
