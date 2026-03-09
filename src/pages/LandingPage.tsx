import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

const navLinks = ["Memberships", "How it works", "Why BLOOM", "Accessories"];

const featureCards = [
  {
    eyebrow: "Guidance",
    title: "Know what to do after PT ends",
    body: "Bloom gives patients a structured plan so they know which exercises to do, when to do them, and how to keep progressing at home.",
  },
  {
    eyebrow: "Accountability",
    title: "Stay consistent when motivation drops",
    body: "Built-in progression, reminders, and routines help users keep going through the stretch when most people fall off after discharge.",
  },
  {
    eyebrow: "Confidence",
    title: "Reduce fear of doing recovery alone",
    body: "The system is designed to make patients feel more certain, more supported, and less likely to avoid movement out of fear of reinjury.",
  },
  {
    eyebrow: "Continuity",
    title: "Continue care beyond insurance coverage",
    body: "Bloom bridges the gap between formal therapy and full recovery with a premium continuation-of-care experience at home.",
  },
];

const collectionCards = [
  {
    name: "General Mobility Kit",
    tone: "Full-body mobility and movement restoration for patients recovering from general injury, overuse, or returning to activity after time off.",
  },
  {
    name: "Shoulder Recovery",
    tone: "Built for rotator cuff repair, labrum surgery, and shoulder impingement rehab with tools selected for shoulder-specific range-of-motion demands.",
  },
  {
    name: "Knee Recovery Kit",
    tone: "Designed for ACL reconstruction, total knee replacement, and meniscus recovery with tools shaped around common post-surgical knee protocols.",
  },
];

const plans = [
  {
    name: "General Mobility Kit",
    slug: "bloom-one",
    subtitle:
      "Full-body mobility and movement restoration for patients recovering from general injury, overuse, or returning to activity after time off.",
    accent: "$25 / month",
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
    accent: "Most popular",
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
    accent: "$25 / month",
    perks: [
      "Everything in General Mobility",
      "Resistance tubing for shoulder loading",
      "Door pulley for overhead mechanics",
      "Pec minor and trap massage protocol",
      "Shoulder-specific app guidance",
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
                    filter: useTransform(textBlur, (value) => `blur(${value}px)`),
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
                    transition={{ duration: 0.85, delay: 0.16, ease: "easeOut" }}
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
                Bloom Recovery bridges the gap between PT discharge and full
                recovery.
              </h2>
              <p className="section-copy">
                Patients leave physical therapy with handouts, uncertainty, and
                not enough support. Bloom replaces that drop-off with a guided
                at-home system built to reduce confusion, improve adherence, and
                help people keep progressing.
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
              <h2>More than equipment. A continuation-of-care system.</h2>
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

        <section className="collection-section" id="accessories">
          <div className="section-heading">
            <p className="eyebrow">Recovery collection</p>
            <h2>Three launch kits built around the recovery paths patients face most.</h2>
            <p className="section-copy">
              The launch collection includes a general mobility option plus
              knee- and shoulder-specific kits, giving Bloom a clearer clinical
              story and a more realistic path to product-market fit.
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
            <p className="eyebrow">Choose your kit</p>
            <h2>Built for your recovery. Specific to your injury.</h2>
            <p className="section-copy">
              Every kit ships with the Bloom app, a laminated exercise guide
              card, and a welcome setup. The tools change. The system stays
              consistent.
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
                  Bloom is built to make recovery feel structured, not abandoned.
                </h3>
                <p>
                  The product is positioned around confidence, accountability,
                  and continuation of care, giving patients a clearer next step
                  after discharge instead of leaving them on their own.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="site-footer-copy">
          <p className="eyebrow">Bloom Recovery</p>
          <h2>Structured recovery support for life after physical therapy.</h2>
          <p>
            Bloom Recovery helps patients continue progressing with guided
            routines, curated tools, and a digital system designed to reduce
            fear, confusion, and reinjury risk after discharge.
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
