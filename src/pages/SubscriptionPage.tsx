import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { redirectToCheckout } from "../lib/stripe";

const planContent: Record<
  string,
  { name: string; summary: string; note: string }
> = {
  "bloom-one": {
    name: "General Mobility Kit",
    summary:
      "Checkout route for the General Mobility Kit. This is wired for Stripe Checkout in test mode.",
    note: "Add your Stripe keys to .env and this button can redirect into a real test checkout session.",
  },
  "bloom-peak": {
    name: "Knee Recovery Kit",
    summary:
      "Checkout route for the Knee Recovery Kit, ready for a separate payment flow implementation.",
    note: "The Stripe session is created server-side through the Vercel API route.",
  },
  "bloom-life": {
    name: "Shoulder Recovery Kit",
    summary:
      "Checkout route for the Shoulder Recovery Kit, isolated from the landing page for independent development.",
    note: "Use this page to extend pricing, shipping, or post-purchase logic without touching the launch page.",
  },
};

function SubscriptionPage() {
  const { planSlug = "bloom-one" } = useParams();
  const [searchParams] = useSearchParams();
  const [checkoutState, setCheckoutState] = useState<{
    loading: boolean;
    error: string | null;
  }>({ loading: false, error: null });
  const plan = planContent[planSlug] ?? planContent["bloom-one"];
  const checkoutSuccess = searchParams.get("checkout") === "success";
  const checkoutCancelled = searchParams.get("checkout") === "cancelled";

  async function handleCheckout() {
    try {
      setCheckoutState({ loading: true, error: null });
      await redirectToCheckout(planSlug);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to launch checkout.";
      setCheckoutState({ loading: false, error: message });
    }
  }

  return (
    <main className="subscription-page">
      <div className="subscription-card">
        <p className="eyebrow">Subscription route</p>
        <h1>{plan.name}</h1>
        <p className="subscription-copy">{plan.summary}</p>
        <p className="subscription-note">{plan.note}</p>
        {checkoutSuccess ? (
          <p className="subscription-note">
            Stripe redirected back with a success flag. Replace this with a real
            confirmation page when you build the final purchase flow.
          </p>
        ) : null}
        {checkoutCancelled ? (
          <p className="subscription-note">
            Checkout was cancelled. You can retry the Stripe flow below.
          </p>
        ) : null}
        {checkoutState.error ? (
          <p className="subscription-note">{checkoutState.error}</p>
        ) : null}
        <div className="subscription-actions">
          <button
            className="button button-primary"
            type="button"
            onClick={handleCheckout}
            disabled={checkoutState.loading}
          >
            {checkoutState.loading ? "Starting checkout..." : "Pay with Stripe"}
          </button>
          <Link className="button button-secondary" to="/">
            Back to landing page
          </Link>
        </div>
      </div>
    </main>
  );
}

export default SubscriptionPage;
