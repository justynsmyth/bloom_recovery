import { useEffect, useRef, useState } from "react";
import { CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

const navLinks = [
  "Memberships",
  "How it works",
  "App",
  "Why BLOOM",
  "Collection",
];

const featureCards = [
  {
    eyebrow: "Guidance",
    title: "Know what to do after PT ends",
    body: "Bloom gives patients a clear plan for what to do, when to do it, and how to keep progressing at home.",
  },
  {
    eyebrow: "Accountability",
    title: "Stay consistent when motivation drops",
    body: "Built-in reminders, routines, and progression help patients stay on track after discharge.",
  },
  {
    eyebrow: "Confidence",
    title: "Reduce fear of doing recovery alone",
    body: "Bloom helps patients feel more supported and less afraid of movement or reinjury.",
  },
  {
    eyebrow: "Continuity",
    title: "Continue care beyond insurance coverage",
    body: "Bloom extends recovery beyond formal therapy with a structured continuation-of-care system at home.",
  },
];

const appSupportCards = [
  {
    number: "04",
    title: "Tools that were made for this",
    body: "Resistance bands, foam roller, stretch strap, massage ball, gel pack, and arnica lotion. Every item is selected for clinical relevance to the injury.",
  },
  {
    number: "05",
    title: "Bloom back to full strength",
    body: "The program does not stop at basic function. Progressive loading and athlete-minded mobility help patients move from recovered to truly strong.",
  },
  {
    number: "06",
    title: "Your PT stays in the loop",
    body: "The Bloom clinic dashboard gives therapists remote visibility into session compliance, so they can see who is following through without extra work.",
  },
];

const statHighlights = [
  {
    value: "60%",
    label: "of kit buyers are projected to convert into paid app subscribers",
  },
  {
    value: "6 mos",
    label: "average modeled retention during the recovery transition period",
  },
  {
    value: "4.95x",
    label: "modeled LTV to CAC ratio from the Bloom financial plan",
  },
];

const plans = [
  {
    name: "General Mobility Kit",
    slug: "bloom-one",
    subtitle:
      "Full-body mobility and movement restoration for patients recovering from general injury, overuse, or returning to activity after time off.",
    accent: "",
    perks: [
      "Resistance loop bands",
      "Stretch strap with 10 loops",
      "12-inch foam roller",
      "Lacrosse massage ball",
      "Reusable hot/cold gel pack",
    ],
  },
  {
    name: "Knee Recovery Kit",
    slug: "bloom-peak",
    subtitle:
      "For ACL reconstruction, total knee replacement, and meniscus repair. Contents selected around the most common post-surgical knee protocols.",
    perks: [
      "Everything in General Mobility",
      "Knee compression sleeve",
      "Half-round roller for post-op sensitivity",
      "Terminal knee extension protocol",
      "Knee-specific app guidance",
    ],
  },
  {
    name: "Shoulder Recovery Kit",
    slug: "bloom-life",
    subtitle:
      "For rotator cuff repair, labrum surgery, and shoulder impingement rehab. Built around the shoulder's unique range-of-motion demands.",
    accent: "",
    perks: [
      "Everything in General Mobility",
      "Resistance tubing for shoulder loading",
      "Door pulley for overhead mechanics",
      "Pec minor and trap massage protocol",
      "Shoulder-specific app guidance",
    ],
  },
];

const footerColumns = [
  {
    title: "Kits",
    links: [
      "General Mobility",
      "Knee Recovery",
      "Shoulder Recovery",
      "Back & Mobility",
      "Build My Plan",
    ],
  },
  {
    title: "Support",
    links: [
      "Member Support",
      "Order Status",
      "App Download",
      "Clinic Login",
      "FAQ",
    ],
  },
  {
    title: "Company",
    links: [
      "Our Mission",
      "Careers",
      "Press",
      "Partner With Us",
      "The Bloom Blog",
    ],
  },
  {
    title: "For Clinics",
    links: [
      "Become a Partner",
      "Clinic Dashboard",
      "Clinical Evidence",
      "Corporate Gifting",
      "Hero Discounts",
    ],
  },
];

function LandingPage() {
  const heroShellRef = useRef<HTMLElement | null>(null);
  const chromeRef = useRef<HTMLDivElement | null>(null);
  const nextSectionRef = useRef<HTMLElement | null>(null);
  const [showFloatingUi, setShowFloatingUi] = useState(true);
  const { scrollYProgress } = useScroll({
    target: heroShellRef,
    offset: ["start start", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.2,
  });
  const overlayOpacity = useTransform(
    smoothProgress,
    [0, 0.29, 0.77],
    [0, 0, 1],
  );
  const videoOpacity = useTransform(
    smoothProgress,
    [0, 0.29, 0.77],
    [1, 1, 0.08],
  );
  const videoSaturation = useTransform(
    smoothProgress,
    [0, 0.29, 0.77],
    [1, 1, 0.62],
  );
  const textOpacity = useTransform(smoothProgress, [0, 0.29, 0.77], [1, 1, 1]);
  const textColor = useTransform(
    smoothProgress,
    [0, 0.29, 0.58, 0.77],
    ["#17141f", "#17141f", "#f7edf3", "#f7edf3"],
  );
  const textAccentColor = useTransform(
    smoothProgress,
    [0, 0.29, 0.58, 0.77],
    ["#ef7da0", "#ef7da0", "#8fe7ff", "#8fe7ff"],
  );
  const textY = useTransform(smoothProgress, [0, 1], ["-3%", "-7%"]);
  const textBlur = useTransform(smoothProgress, [0, 0.77], [0, 1.5]);

  useEffect(() => {
    let lastY = window.scrollY;
    let upDistance = 0;
    let downDistance = 0;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      const chromeHeight = chromeRef.current?.offsetHeight ?? 0;
      const nextSectionTop =
        nextSectionRef.current?.getBoundingClientRect().top ??
        Number.POSITIVE_INFINITY;
      const hideThreshold = chromeHeight + window.innerHeight * 0.08;

      if (currentY <= 24) {
        setShowFloatingUi(true);
        upDistance = 0;
        downDistance = 0;
        lastY = currentY;
        return;
      }

      if (delta < 0) {
        upDistance += Math.abs(delta);
        downDistance = 0;
        if (upDistance > 28) {
          setShowFloatingUi(true);
        }
      } else if (delta > 0 && nextSectionTop <= hideThreshold) {
        downDistance += delta;
        upDistance = 0;
        if (downDistance > 18) {
          setShowFloatingUi(false);
        }
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page-shell">
      <motion.div
        className="floating-ui"
        initial={false}
        animate={showFloatingUi ? "visible" : "hidden"}
        variants={{
          visible: { opacity: 1, y: 0, pointerEvents: "auto" },
          hidden: { opacity: 0, y: -24, pointerEvents: "none" },
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div ref={chromeRef} className="hero-chrome">
          <div className="promo-bar">
            <span>Try Bloom Recovery free for one month</span>
            <Link to="/subscribe/bloom-one">Join now</Link>
          </div>

          <header className="site-header">
            <div className="brand-lockup" aria-label="Bloom Recovery">
              <span className="brand-mark" />
              <span className="brand-word">Bloom Recovery</span>
            </div>

            <nav className="site-nav" aria-label="Primary">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
                >
                  {link}
                </a>
              ))}
            </nav>

            <Link className="cta-link" to="/subscribe/bloom-one">
              Start trial
            </Link>
          </header>
        </div>

        <Link className="floating-join-button" to="/subscribe/bloom-one">
          Join Now
        </Link>
      </motion.div>

      <main>
        <section ref={heroShellRef} className="hero-shell">
          <section className="hero-section">
            <div className="hero-frame">
              <div className="hero-visual" aria-hidden="true">
                <motion.video
                  className="hero-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  style={{
                    opacity: videoOpacity,
                    filter: useTransform(
                      videoSaturation,
                      (value) => `saturate(${value})`,
                    ),
                  }}
                >
                  <source src="/videos/clip1.mp4" type="video/mp4" />
                </motion.video>
                <div className="hero-video-scrim" />
                <motion.div
                  className="hero-fade-overlay"
                  style={{ opacity: overlayOpacity }}
                />
              </div>

              <div className="hero-content">
                <motion.div
                  className="hero-copy"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    opacity: textOpacity,
                    y: textY,
                    filter: useTransform(
                      textBlur,
                      (value) => `blur(${value}px)`,
                    ),
                  }}
                >
                  <motion.p
                    className="eyebrow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
                    style={{ color: textColor }}
                  >
                    Your Recovery. Your Pace. Your Program.
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.85,
                      delay: 0.16,
                      ease: "easeOut",
                    }}
                    style={{ color: textColor }}
                  >
                    The kit designed for{" "}
                    <motion.span style={{ color: textAccentColor }}>
                      lasting recovery.
                    </motion.span>
                  </motion.h1>
                  <div className="hero-copy-spacer" aria-hidden="true" />
                </motion.div>
              </div>
            </div>
          </section>
          <motion.div
            className="hero-shell-fade"
            style={{ opacity: overlayOpacity }}
          />
        </section>

        <section
          ref={nextSectionRef}
          className="section-grid"
          id="how-it-works"
        >
          <div className="intro-grid">
            <div className="section-heading">
              <p className="eyebrow">How it works</p>
              <h2>
                Bridge the gap between{" "}
                <span className="section-emphasis section-emphasis-cool">
                  discharge
                </span>{" "}
                and{" "}
                <span className="section-emphasis section-emphasis-warm">
                  recovery.
                </span>
              </h2>
              <p className="section-copy">
                After physical therapy ends, many patients are left without
                enough guidance. Bloom provides a structured{" "}
                <strong>at-home system</strong> to keep recovery moving.
              </p>
            </div>

            <div className="intro-image-panel">
              <img
                src="/videos/singlebox.png"
                alt="Bloom Recovery knee recovery kit box"
              />
            </div>
          </div>

          <div className="feature-grid">
            {featureCards.map((feature, index) => (
              <article
                key={feature.title}
                className={`feature-card feature-${index + 1}`}
              >
                <p className="eyebrow">{feature.eyebrow}</p>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bundle-section" id="why-bloom">
          <div className="bundle-layout">
            <div className="bundle-image-card">
              <img
                src="/videos/box_content.png"
                alt="Bloom Recovery kit contents laid out with accessories and packaging"
              />
            </div>

            <div className="bundle-copy">
              <p className="eyebrow">Why BLOOM</p>
              <h2>More than equipment.</h2>
              <p className="section-copy">
                Bloom is designed for the moment patients are still healing but
                no longer have regular access to their therapist. The product
                combines physical tools, a progression plan, and digital support
                so recovery does not turn into guesswork.
              </p>

              <div className="bundle-points">
                <article>
                  <strong>Structured progression</strong>
                  <p>
                    Patients get a clearer sense of what to do, how often to do
                    it, and when to progress or scale back.
                  </p>
                </article>
                <article>
                  <strong>Accountability at home</strong>
                  <p>
                    Routines, reminders, and digital guidance help users stay
                    consistent after formal care ends.
                  </p>
                </article>
                <article>
                  <strong>Lower-friction recovery</strong>
                  <p>
                    Bloom is meant to feel calmer, easier to use, and more
                    approachable than piecing recovery together alone.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="app-loop-section" id="app">
          <div className="app-loop-layout">
            <div className="section-heading app-loop-heading">
              <p className="eyebrow">The app + your PT</p>
              <h2>Your therapist stays connected, even after discharge.</h2>
              <p className="section-copy">
                Bloom does not stop at a box. The app gives patients visible
                progress tracking, structured routines, and a clearer sense of
                what to do next, while the clinic dashboard helps therapists
                stay in the loop remotely.
              </p>
            </div>

            <div className="app-loop-stats">
              {statHighlights.map((stat) => (
                <article key={stat.value} className="app-stat-card">
                  <strong>{stat.value}</strong>
                  <p>{stat.label}</p>
                </article>
              ))}
            </div>

            <div className="app-loop-grid">
              {appSupportCards.map((card) => (
                <article key={card.number} className="app-loop-card">
                  <span>{card.number}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="collection-section" id="collection">
          <div className="section-heading">
            <p className="eyebrow">Recovery collection</p>
            <h2>
              Three launch kits built around the recovery paths patients face
              most.
            </h2>
          </div>

          <div className="collection-hero-card">
            <img
              src="/videos/4boxes.png"
              alt="Four Bloom Recovery kits in different colors"
            />
          </div>
        </section>

        <section className="rental-section">
          <div className="bundle-layout rental-layout">
            <div className="bundle-copy">
              <p className="eyebrow">Rental tools</p>
              <h2>
                Access higher-cost recovery tools without forcing every patient
                to buy them outright.
              </h2>
              <p className="section-copy">
                The Bloom model also supports rentable equipment for products
                patients may only need during a specific phase of recovery. This
                creates a more flexible path for at-home care while keeping the
                system clinically structured. Example rental tools include free
                weights, a massage gun, and a bench.
              </p>

              <div className="bundle-points rental-points">
                <article>
                  <strong>Rent-to-purchase options</strong>
                  <p>
                    Useful for larger tools that lose relevance after a patient
                    progresses.
                  </p>
                </article>
                <article>
                  <strong>Custom plan attached</strong>
                  <p>
                    Rental equipment can still be tied to a guided at-home
                    progression plan.
                  </p>
                </article>
                <article>
                  <strong>Lower upfront burden</strong>
                  <p>
                    Makes premium recovery support more accessible for patients
                    who need flexibility.
                  </p>
                </article>
              </div>
            </div>

            <div className="bundle-image-card rental-image-card">
              <img
                src="/videos/box_content.png"
                alt="Bloom Recovery kit contents and tools laid out as part of a rentable recovery system"
              />
            </div>
          </div>
        </section>

        <section className="membership-section" id="memberships">
          <motion.div
            className="section-heading membership-heading"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="eyebrow">Choose your kit</p>
            <h2>Built for recovery. Specific to your injury.</h2>
            <p className="section-copy">
              Every kit includes the essentials to get started, with the Bloom
              app available as an optional add-on for guided support.
            </p>
          </motion.div>

          <div className="plan-grid plan-grid--kits">
            {plans.map((plan) => (
              <article key={plan.name} className="plan-card">
                {plan.accent ? (
                  <span className="plan-accent">{plan.accent}</span>
                ) : null}
                <h3>{plan.name}</h3>
                <p className="plan-subtitle">{plan.subtitle}</p>
                <div className="plan-image-placeholder" aria-hidden="true">
                  <span>Image placeholder</span>
                </div>
                <ul>
                  {plan.perks.map((perk) => (
                    <li key={perk}>
                      <CircleCheck
                        className="plan-check-icon"
                        aria-hidden="true"
                      />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <div className="plan-actions">
                  <Link
                    className="button button-primary plan-link"
                    to={`/subscribe/${plan.slug}`}
                  >
                    Choose kit
                  </Link>
                  <a href="#footer">Learn more</a>
                </div>
              </article>
            ))}
          </div>

          <aside className="membership-aside membership-aside--row">
            <img
              src="/videos/soft_box_natural.png"
              alt="Bloom Recovery product box in a natural lifestyle setting"
            />
            <div className="membership-aside-copy">
              <p className="eyebrow">Launch story</p>
              <h3>
                Bloom is built to make recovery feel structured, not abandoned.
              </h3>
              <p>
                The product is positioned around confidence, accountability, and
                continuation of care, giving patients a clearer next step after
                discharge instead of leaving them on their own.
              </p>
            </div>
          </aside>
        </section>
      </main>

      <section className="footer-cta-band">
        <button type="button" className="footer-cta-button">
          Partner With Bloom
        </button>
      </section>

      <footer className="site-footer" id="footer">
        <div className="site-footer-inner">
          <div className="site-footer-brand">
            <h2>Bloom</h2>
            <p>
              Our mission is to close the gap between physical therapy discharge
              and full recovery, one kit at a time.
            </p>
            <div className="footer-signup">
              <input type="email" placeholder="Your email address" />
              <button type="button">Stay Updated</button>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="site-footer-column">
              <p className="site-footer-label">{column.title}</p>
              <div className="site-footer-links">
                {column.links.map((link) => (
                  <a key={link} href="#footer">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="site-footer-bottom">
          <p>
            © 2026 Bloom Recovery Kits · Terms of Use · Privacy Policy · Terms
            of Sale
          </p>
          <span>Los Angeles, CA</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
