import Stripe from "stripe";

type CheckoutPayload = {
  planSlug?: string;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const planCatalog: Record<
  string,
  {
    name: string;
    description: string;
    unitAmount: number;
  }
> = {
  "bloom-one": {
    name: "General Mobility Kit",
    description:
      "Full-body mobility and movement restoration with guided Bloom Recovery support.",
    unitAmount: 2500,
  },
  "bloom-peak": {
    name: "Knee Recovery Kit",
    description:
      "Knee-focused recovery kit for post-surgical support and guided home progression.",
    unitAmount: 2500,
  },
  "bloom-life": {
    name: "Shoulder Recovery Kit",
    description:
      "Shoulder-specific recovery kit with guided support for mobility and rehab routines.",
    unitAmount: 2500,
  },
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!stripeSecretKey) {
    return new Response(
      JSON.stringify({
        error: "Missing STRIPE_SECRET_KEY. Add it to your environment before testing checkout.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const body = (await request.json()) as CheckoutPayload;
  const plan = planCatalog[body.planSlug ?? "bloom-one"] ?? planCatalog["bloom-one"];
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const stripe = new Stripe(stripeSecretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: plan.unitAmount,
            product_data: {
              name: plan.name,
              description: plan.description,
            },
          },
        },
      ],
      success_url: `${origin}/subscribe/${body.planSlug ?? "bloom-one"}?checkout=success`,
      cancel_url: `${origin}/subscribe/${body.planSlug ?? "bloom-one"}?checkout=cancelled`,
      metadata: {
        planSlug: body.planSlug ?? "bloom-one",
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout session.";

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
