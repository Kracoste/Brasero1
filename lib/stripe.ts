import Stripe from 'stripe';

// Stripe client - will be null if STRIPE_SECRET_KEY is not set
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const hasStripeCredentials = () => !!process.env.STRIPE_SECRET_KEY;
