import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

const navLinks = ["Memberships", "How it works", "Why BLOOM", "Accessories"];

const featureCards = [
  {
    eyebrow: "Recovery",
    title: "Quantify how your body is feeling",
    body: "Daily recovery, strain, and sleep signals give you a clear read on readiness before you train or push harder.",
  },
  {
    eyebrow: "Healthspan",
    title: "Extend your prime for years to come",
    body: "A future-facing block inspired by Bloom Recovery health and longevity positioning, presented with a more editorial visual treatment.",
  },
  {
    eyebrow: "Sleep",
    title: "Optimize your sleep",
    body: "A dedicated sleep panel keeps the page aligned with Bloom Recovery’s strongest message: recovery starts with better rest.",
  },
  {
    eyebrow: "Heart Health",
    title: "Stay connected to your heart health",
    body: "A continuous stream of wellness metrics is framed as a premium, low-friction wearable experience.",
  },
];

const collectionCards = [
  {
    name: "Knee Recovery Kit",
    tone: "Soft compression, guided mobility, and post-session recovery support.",
  },
  {
    name: "Shoulder Recovery Kit",
    tone: "Targeted tools for upper-body tension, stability, and restoration.",
  },
  {
    name: "Sleep Recovery Kit",
    tone: "Evening rituals and calming accessories for higher-quality recovery.",
  },
  {
    name: "Black Recovery Kit",
    tone: "A premium, giftable edition with a darker visual identity.",
  },
];

const plans = [
  {
    name: "Bloom One",
    slug: "bloom-one",
    subtitle:
      "Professional-grade fitness insights at an accessible starting point.",
    accent: "Core performance",
    perks: [
      "Bloom Band with extended battery life",
      "Sleep, strain, and recovery insights",
      "Personalized coaching",
      "VO2 max and heart rate zones",
    ],
  },
  {
    name: "Bloom Peak",
    slug: "bloom-peak",
    subtitle:
      "Health, fitness, and longevity features for users who want deeper guidance.",
    accent: "Most balanced",
    perks: [
      "Everything in One",
      "Healthspan and pace of aging",
      "Health Monitor alerts",
      "Real-time stress tracking",
    ],
  },
  {
    name: "Bloom Life",
    slug: "bloom-life",
    subtitle: "The medical-grade tier with the strongest health-forward story.",
    accent: "Medical insights",
    perks: [
      "Everything in Peak",
      "Bloom MG hardware",
      "Daily blood pressure insights",
      "ECG and irregular rhythm notifications",
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
  const leftOverlayOpacity = useTransform(
    smoothProgress,
    [0, 0.29, 0.77],
    [0, 0, 1],
  );
  const textOpacity = useTransform(smoothProgress, [0, 0.29, 0.77], [1, 1, 1]);
  const textColor = useTransform(
    smoothProgress,
    [0, 0.29, 0.77],
    ["#17141f", "#17141f", "#000000"],
  );
  const textY = useTransform(smoothProgress, [0, 1], ["-5%", "-7%"]);

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
            <div className="hero-content">
              <motion.div
                className="hero-copy"
                style={{ opacity: textOpacity, y: textY }}
              >
                <motion.div
                  className="hero-copy-fade"
                  style={{ opacity: leftOverlayOpacity }}
                />
                <motion.p className="eyebrow" style={{ color: textColor }}>
                  Unlock human performance and healthspan
                </motion.p>
                <motion.h1 style={{ color: textColor }}>
                  The wearable designed for lasting progress
                </motion.h1>
                <div className="hero-copy-spacer" aria-hidden="true" />
              </motion.div>

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
            </div>
          </section>
        </section>

        <section
          ref={nextSectionRef}
          className="section-grid"
          id="how-it-works"
        >
          <div className="intro-grid">
            <div className="section-heading">
              <p className="eyebrow">Complete view of your recovery</p>
              <h2>
                Everything you need to start feeling better, presented as one
                considered system.
              </h2>
              <p className="section-copy">
                Bloom Recovery pairs premium recovery tools, guided routines,
                and beautifully designed kits so the experience feels
                restorative before you even open the box.
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
              <p className="eyebrow">Inside the kit</p>
              <h2>Recovery gear that feels complete from day one.</h2>
              <p className="section-copy">
                Each Bloom Recovery set is built to feel useful immediately: a
                premium core product, supporting accessories, and a visual
                system designed to make your routine feel more intentional and
                less clinical.
              </p>

              <div className="bundle-points">
                <article>
                  <strong>Structured routine</strong>
                  <p>
                    Clear, repeatable tools for prehab, cooldown, and ongoing
                    maintenance.
                  </p>
                </article>
                <article>
                  <strong>Gift-ready presentation</strong>
                  <p>
                    Packaging designed to feel elevated enough for launch,
                    retail, and gifting.
                  </p>
                </article>
                <article>
                  <strong>Soft-touch product language</strong>
                  <p>
                    Pastel-led accessories and materials that feel premium
                    without feeling sterile.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="collection-section" id="accessories">
          <div className="section-heading">
            <p className="eyebrow">Recovery collection</p>
            <h2>One launch system, four signature kits.</h2>
            <p className="section-copy">
              The packaging system scales across use cases while keeping the
              Bloom Recovery identity consistent, giftable, and easy to
              recognize.
            </p>
          </div>

          <div className="collection-hero-card">
            <img
              src="/videos/4boxes.png"
              alt="Four Bloom Recovery kits in different colors"
            />
          </div>

          <div className="collection-grid">
            {collectionCards.map((collection) => (
              <article key={collection.name} className="collection-card">
                <h3>{collection.name}</h3>
                <p>{collection.tone}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="membership-section" id="memberships">
          <div className="section-heading">
            <p className="eyebrow">Choose a membership</p>
            <h2>Pick the Bloom Recovery tier that matches your routine.</h2>
            <p className="section-copy">
              Memberships combine physical kits, digital guidance, and
              progressively deeper recovery insight. The system is designed to
              scale from simple habit-building to full premium care.
            </p>
          </div>

          <div className="plan-layout">
            <div className="plan-grid">
              {plans.map((plan) => (
                <article key={plan.name} className="plan-card">
                  <span className="plan-accent">{plan.accent}</span>
                  <h3>{plan.name}</h3>
                  <p className="plan-subtitle">{plan.subtitle}</p>
                  <ul>
                    {plan.perks.map((perk) => (
                      <li key={perk}>{perk}</li>
                    ))}
                  </ul>
                  <div className="plan-actions">
                    <Link className="button button-primary plan-link" to={`/subscribe/${plan.slug}`}>
                      Choose tier
                    </Link>
                    <a href="#footer">Learn more</a>
                  </div>
                </article>
              ))}
            </div>

            <aside className="membership-aside">
              <img
                src="/videos/soft_box_natural.png"
                alt="Bloom Recovery product box in a natural lifestyle setting"
              />
              <div className="membership-aside-copy">
                <p className="eyebrow">Launch story</p>
                <h3>
                  Recovery that feels calmer, softer, and easier to stick with.
                </h3>
                <p>
                  The visual identity leans warm and restorative so the launch
                  page sells not just function, but the feeling of slowing down
                  and recovering well.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="site-footer-copy">
          <p className="eyebrow">Clone project</p>
          <h2>Bloom Recovery launch page</h2>
          <p>
            A cleaner launch narrative built around your product photography,
            packaging system, and premium recovery positioning.
          </p>
        </div>
        <Link className="button button-primary" to="/subscribe/bloom-one">
          Launch trial CTA
        </Link>
      </footer>
    </div>
  );
}

export default LandingPage;
