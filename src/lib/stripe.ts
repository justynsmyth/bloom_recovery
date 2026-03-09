import { loadStripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export async function redirectToCheckout(planSlug: string) {
  if (!stripePromise) {
    throw new Error(
      "Missing VITE_STRIPE_PUBLISHABLE_KEY. Add it to your .env file before testing Stripe.",
    );
  }

  const response = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ planSlug }),
  });

  const data = (await response.json()) as { error?: string; sessionId?: string };

  if (!response.ok || !data.sessionId) {
    throw new Error(data.error ?? "Unable to start checkout.");
  }

  const stripe = await stripePromise;

  if (!stripe) {
    throw new Error("Stripe failed to initialize.");
  }

  const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });

  if (result.error) {
    throw new Error(result.error.message ?? "Stripe redirect failed.");
  }
}
