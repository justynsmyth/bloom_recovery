import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Stripe payment setup

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");

const stripeAppearance: import("@stripe/stripe-js").Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#ef7da0",
    colorBackground: "#fffbff",
    colorText: "#1f2333",
    colorDanger: "#c0334f",
    fontFamily: "Manrope, sans-serif",
    borderRadius: "0.75rem",
    spacingUnit: "4px",
    fontSizeBase: "1rem",
  },
  rules: {
    ".Input": {
      border: "1.5px solid rgba(161, 114, 145, 0.18)",
      boxShadow: "none",
      padding: "0.75rem 1rem",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    },
    ".Input:focus": {
      borderColor: "#ef7da0",
      boxShadow: "0 0 0 3px rgba(239, 125, 160, 0.15)",
      outline: "none",
    },
    ".Label": {
      fontSize: "0.8rem",
      fontWeight: "700",
      color: "rgba(31, 35, 51, 0.68)",
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      marginBottom: "0.4rem",
    },
    ".Tab": {
      border: "1.5px solid rgba(161, 114, 145, 0.18)",
      borderRadius: "0.75rem",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      boxShadow: "none",
    },
    ".Tab--selected": {
      borderColor: "#ef7da0",
      boxShadow: "0 0 0 3px rgba(239, 125, 160, 0.15)",
    },
    ".Tab:hover": {
      borderColor: "rgba(239, 125, 160, 0.5)",
    },
  },
};

// Data 

type TierData = { name: string; monthly: number; annual: number; twoYear: number };

const tierData: Record<string, TierData> = {
  "bloom-one":  { name: "General Mobility Kit",  monthly: 25, annual: 20, twoYear: 17 },
  "bloom-peak": { name: "Knee Recovery Kit",     monthly: 25, annual: 20, twoYear: 17 },
  "bloom-life": { name: "Shoulder Recovery Kit", monthly: 25, annual: 20, twoYear: 17 },
};

const slugToKit: Record<string, string> = {
  "bloom-one":  "general-mobility",
  "bloom-peak": "knee",
  "bloom-life": "shoulder",
};

const kits = [
  { id: "general-mobility", label: "General Mobility Kit",  description: "Full-body mobility and movement restoration for general injury, overuse, or returning to activity after time off." },
  { id: "knee",             label: "Knee Recovery Kit",     description: "For ACL reconstruction, total knee replacement, and meniscus repair. Built around common post-surgical knee protocols." },
  { id: "shoulder",         label: "Shoulder Recovery Kit", description: "For rotator cuff repair, labrum surgery, and shoulder impingement rehab. Built around shoulder range-of-motion demands." },
];

const colors = [
  { id: "light",  label: "Light",       hex: "#f5b8c4" },
  { id: "medium", label: "Medium",      hex: "#7bc4c4" },
  { id: "heavy",  label: "Heavy",       hex: "#4a5568" },
  { id: "mix",    label: "One of each", hex: "#c8b8e8" },
];

const addOnItems: { id: string; label: string; price: number; description: string }[] = [
  { id: "arnica-lotion",  label: "Arnica Lotion 3-pack",   price: 24, description: "Topical arnica lotion for post-session muscle soreness and inflammation relief." },
  { id: "extra-gel-pack", label: "Extra Hot/Cold Gel Pack", price: 18, description: "Additional reusable gel pack for alternating hot/cold therapy protocols." },
  { id: "massage-stick",  label: "Massage Stick Roller",   price: 22, description: "Targeted stick roller for calves, quads, and IT band — complements the foam roller." },
];

const allProductImages = [
  "/videos/singlebox.png",
  "/videos/soft_box_natural.png",
  "/videos/box_content.png",
  "/videos/4boxes.png",
];

const resistanceHero: Record<string, string> = {
  light:  "/videos/singlebox.png",
  medium: "/videos/soft_box_natural.png",
  heavy:  "/videos/box_content.png",
  mix:    "/videos/4boxes.png",
};

const billingOptions = [
  { id: "monthly"  as const, label: "Monthly",  sublabel: "Billed each month",     savings: null,  months: 1  },
  { id: "annual"   as const, label: "Annual",   sublabel: "Billed once per year",   savings: "20%", months: 12 },
  { id: "twoYear"  as const, label: "2 Years",  sublabel: "Billed every two years", savings: "32%", months: 24 },
];

type BillingId = "monthly" | "annual" | "twoYear";

const STEPS = ["Customize", "Choose Plan", "Cart", "Checkout"];

// Types 

type ContactForm = {
  name: string; email: string; phone: string;
  address: string; city: string; state: string; zip: string;
};

// CheckoutPaymentForm (must be inside <Elements> to use Stripe hooks) 

interface CheckoutPaymentFormProps {
  form: ContactForm;
  formErrors: Record<string, string>;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  validateShipping: (f: ContactForm) => Record<string, string>;
  total: number;
  orderSummaryNode: React.ReactNode;
  onBack: () => void;
  onSuccess: () => void;
}

function CheckoutPaymentForm({
  form, formErrors, handleFormChange, setFormErrors,
  validateShipping, total, orderSummaryNode, onBack, onSuccess,
}: CheckoutPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateShipping(form);
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!stripe || !elements) return;

    setProcessing(true);
    setPaymentError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscribe/confirmed`,
        payment_method_data: {
          billing_details: {
            name: form.name,
            email: form.email,
            ...(form.phone && { phone: form.phone }),
            address: {
              line1: form.address,
              city: form.city,
              state: form.state,
              postal_code: form.zip,
              country: "US",
            },
          },
        },
      },
      redirect: "if_required",
    });

    setProcessing(false);

    if (error) {
      setPaymentError(error.message ?? "Payment failed. Please try again.");
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <div className="checkout-layout">
      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        {/* Contact */}
        <div className="checkout-section-block">
          <h2 className="sub-section-title">Contact information</h2>
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" placeholder="Jane Smith"
                value={form.name} onChange={handleFormChange}
                className={formErrors.name ? "error" : ""} />
              {formErrors.name && <span className="field-error">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="jane@email.com"
                value={form.email} onChange={handleFormChange}
                className={formErrors.email ? "error" : ""} />
              {formErrors.email && <span className="field-error">{formErrors.email}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone <span className="sub-optional">(optional)</span></label>
            <input id="phone" name="phone" type="tel" placeholder="(555) 000-0000"
              value={form.phone} onChange={handleFormChange} />
          </div>
        </div>

        {/* Shipping */}
        <div className="checkout-section-block">
          <h2 className="sub-section-title">Shipping address</h2>
          <div className="form-group">
            <label htmlFor="address">Street address</label>
            <input id="address" name="address" type="text" placeholder="123 Recovery Lane"
              value={form.address} onChange={handleFormChange}
              className={formErrors.address ? "error" : ""} />
            {formErrors.address && <span className="field-error">{formErrors.address}</span>}
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" placeholder="San Francisco"
                value={form.city} onChange={handleFormChange}
                className={formErrors.city ? "error" : ""} />
              {formErrors.city && <span className="field-error">{formErrors.city}</span>}
            </div>
            <div className="form-group form-group-xs">
              <label htmlFor="state">State</label>
              <input id="state" name="state" type="text" placeholder="CA" maxLength={2}
                value={form.state} onChange={handleFormChange}
                className={formErrors.state ? "error" : ""} />
              {formErrors.state && <span className="field-error">{formErrors.state}</span>}
            </div>
            <div className="form-group form-group-xs">
              <label htmlFor="zip">ZIP</label>
              <input id="zip" name="zip" type="text" placeholder="94107" maxLength={5}
                value={form.zip} onChange={handleFormChange}
                className={formErrors.zip ? "error" : ""} />
              {formErrors.zip && <span className="field-error">{formErrors.zip}</span>}
            </div>
          </div>
        </div>

        {/* Stripe PaymentElement — cards, Apple Pay, Google Pay, Klarna, etc. */}
        <div className="checkout-section-block">
          <h2 className="sub-section-title">Payment</h2>
          <PaymentElement options={{ layout: "tabs" }} />
        </div>

        {paymentError && (
          <div className="payment-error-banner">{paymentError}</div>
        )}

        <div className="sub-nav">
          <button type="button" className="button button-secondary" onClick={onBack}>
            Back
          </button>
          <button
            type="submit"
            className="button button-primary checkout-cta"
            disabled={!stripe || processing}
          >
            {processing ? "Processing…" : `Place order — $${total.toFixed(2)}`}
          </button>
        </div>
      </form>

      {orderSummaryNode}
    </div>
  );
}

// Main component 

function SubscriptionPage() {
  const { planSlug = "bloom-one" } = useParams();
  const tier = tierData[planSlug] ?? tierData["bloom-one"];

  const [step, setStep]               = useState(0);
  const [selectedKit, setSelectedKit] = useState(() => slugToKit[planSlug] ?? "general-mobility");
  const [selectedColor, setSelectedColor] = useState("light");
  const [galleryIndex, setGalleryIndex]   = useState(0);

  const heroImg     = resistanceHero[selectedColor] ?? allProductImages[0];
  const galleryImages = [heroImg, ...allProductImages.filter(img => img !== heroImg)];

  const handleKitChange   = (id: string) => { setSelectedKit(id);    setGalleryIndex(0); };
  const handleColorChange = (id: string) => { setSelectedColor(id);  setGalleryIndex(0); };

  const [addOns, setAddOns]       = useState<string[]>([]);
  const [billing, setBilling]     = useState<BillingId>("annual");
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<ContactForm>({
    name: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "",
  });

  const billingOpt    = billingOptions.find(o => o.id === billing)!;
  const pricePerMonth = tier[billing];
  const baseTotal     = pricePerMonth * billingOpt.months;
  const addOnTotal    = addOnItems
    .filter(a => addOns.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);
  const total = baseTotal + addOnTotal;

  const toggleAddOn = (id: string) =>
    setAddOns(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "phone") {
      const d = value.replace(/\D/g, "").slice(0, 10);
      if (d.length === 0) formatted = "";
      else if (d.length <= 3) formatted = `(${d}`;
      else if (d.length <= 6) formatted = `(${d.slice(0, 3)}) ${d.slice(3)}`;
      else formatted = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    } else if (name === "zip") {
      formatted = value.replace(/\D/g, "").slice(0, 5);
    } else if (name === "state") {
      formatted = value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
    }
    setForm(prev => ({ ...prev, [name]: formatted }));
    if (Object.keys(formErrors).length > 0) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateShipping = (f: ContactForm): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Valid email is required";
    if (!f.address.trim()) e.address = "Street address is required";
    if (!f.city.trim()) e.city = "City is required";
    if (f.state.length < 2) e.state = "Required";
    if (f.zip.length < 5) e.zip = "Required";
    return e;
  };

  // Stripe PaymentIntent — fetched once when user reaches step 3
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [piError, setPiError] = useState(false);

  useEffect(() => {
    if (step !== 3 || clientSecret) return;
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        metadata: {
          kit: selectedKit,
          billing,
          resistance: selectedColor,
          addOns: addOns.join(","),
        },
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setPiError(true);
      })
      .catch(() => setPiError(true));
  }, [step, clientSecret, total, selectedKit, billing, selectedColor, addOns]);

  // Order summary — shared between checkout sidebar and cart
  const orderSummaryNode = (
    <aside className="order-summary-panel">
      <h2 className="sub-section-title">Order summary</h2>
      <div className="order-summary-img">
        <img src={galleryImages[0]} alt="Bloom Recovery product" />
      </div>
      <div className="order-summary-rows">
        <div className="order-row">
          <span className="order-row-label">Kit</span>
          <span className="order-row-val">{kits.find(k => k.id === selectedKit)?.label}</span>
        </div>
        <div className="order-row">
          <span className="order-row-label">Band resistance</span>
          <span className="order-row-val order-row-color">
            <span className="order-swatch" style={{ background: colors.find(c => c.id === selectedColor)?.hex }} />
            {colors.find(c => c.id === selectedColor)?.label}
          </span>
        </div>
        <div className="order-row">
          <span className="order-row-label">Subscription</span>
          <span className="order-row-val">
            ${pricePerMonth}/mo · {billingOpt.label.toLowerCase()}
          </span>
        </div>
        {addOnItems.filter(a => addOns.includes(a.id)).map(addon => (
          <div key={addon.id} className="order-row">
            <span className="order-row-label">{addon.label}</span>
            <span className="order-row-val">+${addon.price}</span>
          </div>
        ))}
        <div className="order-divider" />
        <div className="order-total-row">
          <span>Due today</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>
      <p className="order-summary-note">Free shipping · Cancel anytime</p>
    </aside>
  );

  // Confirmation
  if (submitted) {
    return (
      <div className="sub-wizard-page">
        <header className="sub-wizard-header">
          <Link className="sub-back" to="/">← Bloom Recovery</Link>
        </header>
        <div className="sub-confirmation">
          <div className="sub-confirmation-mark">✓</div>
          <h1>You're in.</h1>
          <p>Your {tier.name} package is confirmed. Check your email for tracking and setup details.</p>
          <Link className="button button-primary" to="/">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sub-wizard-page">
      {/* Header */}
      <header className="sub-wizard-header">
        <Link className="sub-back" to="/">
          <span aria-hidden="true">←</span> Bloom Recovery
        </Link>
        <div className="sub-tier-badge">{tier.name}</div>
        <nav className="sub-steps-track" aria-label="Checkout progress">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`sub-step-item${i === step ? " active" : i < step ? " done" : ""}`}
            >
              <div className="sub-step-dot">{i < step ? "✓" : i + 1}</div>
              <span className="sub-step-label">{label}</span>
            </div>
          ))}
        </nav>
      </header>

      <main className="sub-wizard-main">

        {/* Step 0: Customize */}
        {step === 0 && (
          <section className="sub-step-panel sub-step-panel--wide">
            <div className="sub-step-heading">
              <p className="eyebrow">Build your kit</p>
              <h1>Customize your {tier.name} package</h1>
              <p className="section-copy">
                Choose the recovery focus that fits your routine, then personalize your box.
              </p>
            </div>

            <div className="customize-layout">
              {/* Left: image gallery */}
              <div className="product-gallery">
                <div className="gallery-main">
                  <img
                    key={galleryImages[galleryIndex]}
                    src={galleryImages[galleryIndex]}
                    alt="Bloom Recovery product"
                  />
                  {galleryImages.length > 1 && (
                    <>
                      <button type="button" className="gallery-nav-btn prev" aria-label="Previous image"
                        onClick={() => setGalleryIndex(i => (i - 1 + galleryImages.length) % galleryImages.length)}>
                        ‹
                      </button>
                      <button type="button" className="gallery-nav-btn next" aria-label="Next image"
                        onClick={() => setGalleryIndex(i => (i + 1) % galleryImages.length)}>
                        ›
                      </button>
                    </>
                  )}
                </div>
                <div className="gallery-thumbs">
                  {galleryImages.map((src, i) => (
                    <button key={src} type="button"
                      className={`gallery-thumb${galleryIndex === i ? " active" : ""}`}
                      onClick={() => setGalleryIndex(i)} aria-label={`View image ${i + 1}`}>
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: options */}
              <div className="customize-options">
                <div className="sub-section">
                  <h2 className="sub-section-title">Recovery focus</h2>
                  <div className="kit-grid">
                    {kits.map(kit => (
                      <button key={kit.id} type="button"
                        className={`kit-card${selectedKit === kit.id ? " selected" : ""}`}
                        onClick={() => handleKitChange(kit.id)} aria-pressed={selectedKit === kit.id}>
                        <strong>{kit.label}</strong>
                        <p>{kit.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sub-section">
                  <h2 className="sub-section-title">Band resistance</h2>
                  <div className="color-grid">
                    {colors.map(color => (
                      <button key={color.id} type="button"
                        className={`color-swatch${selectedColor === color.id ? " selected" : ""}`}
                        onClick={() => handleColorChange(color.id)}
                        aria-label={`Select ${color.label}`} aria-pressed={selectedColor === color.id}>
                        <div className="swatch-dot" style={{ background: color.hex }} />
                        <span>{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sub-section">
                  <h2 className="sub-section-title">
                    Add-ons <span className="sub-optional">(optional)</span>
                  </h2>
                  <div className="addon-grid">
                    {addOnItems.map(addon => (
                      <button key={addon.id} type="button"
                        className={`addon-card${addOns.includes(addon.id) ? " selected" : ""}`}
                        onClick={() => toggleAddOn(addon.id)} aria-pressed={addOns.includes(addon.id)}>
                        <div className="addon-card-top">
                          <strong>{addon.label}</strong>
                          <span className="addon-price">+${addon.price}</span>
                        </div>
                        <p>{addon.description}</p>
                        <div className="addon-toggle">
                          {addOns.includes(addon.id) ? "✓ Added" : "+ Add"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="sub-nav">
              <Link className="button button-secondary" to="/">Back</Link>
              <button type="button" className="button button-primary" onClick={() => setStep(1)}>
                Continue to plan
              </button>
            </div>
          </section>
        )}

        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <section className="sub-step-panel">
            <div className="sub-step-heading">
              <p className="eyebrow">Choose your plan</p>
              <h1>How often would you like to pay?</h1>
              <p className="section-copy">
                Lock in a lower rate with a longer commitment. Cancel anytime.
              </p>
            </div>

            <div className="billing-grid">
              {billingOptions.map(opt => (
                <button key={opt.id} type="button"
                  className={`billing-card${billing === opt.id ? " selected" : ""}`}
                  onClick={() => setBilling(opt.id)} aria-pressed={billing === opt.id}>
                  {opt.savings && <div className="billing-badge">Save {opt.savings}</div>}
                  <div className="billing-label">{opt.label}</div>
                  <div className="billing-price-row">
                    <span className="billing-amount">${tier[opt.id]}</span>
                    <span className="billing-mo">/mo</span>
                  </div>
                  <div className="billing-sub">{opt.sublabel}</div>
                  {opt.id !== "monthly" && (
                    <div className="billing-total-note">
                      ${tier[opt.id] * opt.months} billed{" "}
                      {opt.id === "annual" ? "annually" : "every 2 years"}
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="sub-nav">
              <button type="button" className="button button-secondary" onClick={() => setStep(0)}>Back</button>
              <button type="button" className="button button-primary" onClick={() => setStep(2)}>Continue to cart</button>
            </div>
          </section>
        )}

        {/* Step 2: Cart */}
        {step === 2 && (
          <section className="sub-step-panel">
            <div className="sub-step-heading">
              <p className="eyebrow">Review your order</p>
              <h1>Your Bloom package</h1>
            </div>

            <div className="cart-card">
              <div className="cart-row">
                <span className="cart-label">Membership</span>
                <span className="cart-value">{billingOpt.label}</span>
              </div>
              <div className="cart-row">
                <span className="cart-label">Kit</span>
                <span className="cart-value">{kits.find(k => k.id === selectedKit)?.label}</span>
              </div>
              <div className="cart-row">
                <span className="cart-label">Band resistance</span>
                <span className="cart-value cart-color-cell">
                  <span className="cart-swatch" style={{ background: colors.find(c => c.id === selectedColor)?.hex }} />
                  {colors.find(c => c.id === selectedColor)?.label}
                </span>
              </div>
              <div className="cart-row">
                <span className="cart-label">Plan</span>
                <span className="cart-value">
                  ${pricePerMonth}/mo ·{" "}
                  {billing === "monthly" ? "billed monthly" : billing === "annual" ? "billed annually" : "billed every 2 years"}
                </span>
              </div>
              {addOnItems.filter(a => addOns.includes(a.id)).map(addon => (
                <div key={addon.id} className="cart-row">
                  <span className="cart-label">{addon.label}</span>
                  <span className="cart-value">+${addon.price}</span>
                </div>
              ))}
              <div className="cart-divider" />
              <div className="cart-row cart-total-row">
                <span>Due today</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <p className="cart-note">Free shipping included. Cancel anytime.</p>
            </div>

            <div className="sub-nav">
              <button type="button" className="button button-secondary" onClick={() => setStep(1)}>Back</button>
              <button
                type="button"
                className="button button-primary"
                onClick={() => {
                  setClientSecret(null);
                  setPiError(false);
                  setStep(3);
                }}
              >
                Continue to checkout
              </button>
            </div>
          </section>
        )}

        {/* Step 3: Checkout */}
        {step === 3 && (
          <section className="sub-step-panel sub-step-panel--wide">
            <div className="sub-step-heading">
              <p className="eyebrow">Secure checkout</p>
              <h1>Complete your order</h1>
            </div>

            {piError && (
              <div className="payment-error-banner">
                Could not connect to payment processor. Please check your connection and try again.
                <button
                  type="button"
                  className="pi-retry-btn"
                  onClick={() => {
                    setClientSecret(null);
                    setPiError(false);
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {!piError && clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
                <CheckoutPaymentForm
                  form={form}
                  formErrors={formErrors}
                  handleFormChange={handleFormChange}
                  setFormErrors={setFormErrors}
                  validateShipping={validateShipping}
                  total={total}
                  orderSummaryNode={orderSummaryNode}
                  onBack={() => setStep(2)}
                  onSuccess={() => setSubmitted(true)}
                />
              </Elements>
            ) : !piError ? (
              <div className="checkout-loading">
                <div className="checkout-loading-ring" />
                <p>Setting up secure payment…</p>
              </div>
            ) : null}
          </section>
        )}
      </main>
    </div>
  );
}

export default SubscriptionPage;
