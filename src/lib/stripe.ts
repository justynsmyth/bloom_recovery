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

  const data = (await response.json()) as {
    error?: string;
    sessionId?: string;
    url?: string | null;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to start checkout.");
  }

  if (data.url) {
    window.location.assign(data.url);
    return;
  }

  if (!data.sessionId) {
    throw new Error("Stripe checkout session was created without a redirect URL.");
  }

  throw new Error("Stripe redirect URL was not returned.");
}
