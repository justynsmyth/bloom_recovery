import { Link, useParams } from "react-router-dom";

const planContent: Record<
  string,
  { name: string; summary: string; note: string }
> = {
  "bloom-one": {
    name: "Bloom One",
    summary:
      "Entry tier for the purchase flow. This route is ready for pricing, checkout, and trial terms.",
    note: "Use this page for the initial subscription checkout implementation.",
  },
  "bloom-peak": {
    name: "Bloom Peak",
    summary:
      "Mid-tier subscription route intended for deeper product detail and billing options.",
    note: "Another developer can build the payment experience here without touching the landing page.",
  },
  "bloom-life": {
    name: "Bloom Life",
    summary:
      "Premium subscription route reserved for the highest-tier checkout and health-forward messaging.",
    note: "The route is isolated so the subscription flow can evolve independently.",
  },
};

function SubscriptionPage() {
  const { planSlug = "bloom-one" } = useParams();
  const plan = planContent[planSlug] ?? planContent["bloom-one"];

  return (
    <main className="subscription-page">
      <div className="subscription-card">
        <p className="eyebrow">Subscription route</p>
        <h1>{plan.name}</h1>
        <p className="subscription-copy">{plan.summary}</p>
        <p className="subscription-note">{plan.note}</p>
        <div className="subscription-actions">
          <a className="button button-primary" href="#">
            Placeholder checkout CTA
          </a>
          <Link className="button button-secondary" to="/">
            Back to landing page
          </Link>
        </div>
      </div>
    </main>
  );
}

export default SubscriptionPage;
