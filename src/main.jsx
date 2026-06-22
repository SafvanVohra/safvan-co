import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import "./app.css";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
  { label: "Insights", path: "/insights" },
  { label: "Contact", path: "/contact" },
];

const services = [
  {
    number: "01",
    title: "Audit & Assurance",
    text: "Statutory audit, tax audit, internal audit, management audit and control reviews.",
  },
  {
    number: "02",
    title: "GST & Indirect Tax",
    text: "GST registration, returns, reconciliations, notices, refunds and advisory.",
  },
  {
    number: "03",
    title: "Income Tax & TDS",
    text: "Business tax filing, advance tax planning, TDS returns, assessments and appeals support.",
  },
  {
    number: "04",
    title: "Accounting & Payroll",
    text: "Monthly bookkeeping, MIS reporting, payroll, PF, ESI and vendor compliance checks.",
  },
  {
    number: "05",
    title: "ROC & MCA Compliance",
    text: "Company incorporation, annual filings, board documentation and secretarial coordination.",
  },
  {
    number: "06",
    title: "Virtual CFO",
    text: "Cash-flow planning, dashboards, budgeting, investor reports and profitability reviews.",
  },
];

const detailedServices = [
  {
    title: "Audit & Assurance",
    text: "Independent reviews that strengthen governance, internal controls and stakeholder confidence.",
    items: ["Statutory audit and tax audit", "Internal audit and SOP reviews", "Stock audit and revenue assurance", "Due diligence and special purpose reports"],
  },
  {
    title: "GST & Indirect Tax",
    text: "Registration, returns and reconciliations handled with strong documentation discipline.",
    items: ["GST registration and amendments", "GSTR filing and input credit reconciliation", "E-way bill and e-invoicing support", "GST notices, refunds and advisory"],
  },
  {
    title: "Income Tax & TDS",
    text: "Tax planning and compliance for companies, partnerships, LLPs, proprietors and directors.",
    items: ["ITR filing and tax computation", "Advance tax and MAT advisory", "TDS/TCS returns and corrections", "Assessment and appeal coordination"],
  },
  {
    title: "Accounting, MIS & Payroll",
    text: "Clean books, practical reporting and reliable monthly finance operations.",
    items: ["Bookkeeping and bank reconciliation", "Monthly MIS and cash-flow reports", "Payroll processing, PF and ESI support", "Vendor, debtor and inventory reports"],
  },
  {
    title: "ROC, MCA & Startup Compliance",
    text: "Entity setup and annual company compliance with careful documentation and calendar tracking.",
    items: ["Company, LLP and partnership setup", "Annual ROC filings and registers", "Board resolutions and event-based filings", "MSME, Shop Act, IEC and professional tax support"],
  },
  {
    title: "Virtual CFO & Advisory",
    text: "Strategic finance support for owners who need better numbers without building a full finance team.",
    items: ["Budgeting and runway planning", "Profitability and unit economics review", "Investor and lender reporting", "Business restructuring and valuation support"],
  },
];

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return [path, navigate];
}

function useReveal(path) {
  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach((item, index) => {
      item.classList.remove("is-visible");
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [path]);
}

function Link({ children, className, href, navigate }) {
  return (
    <a
      className={className}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}

function Header({ path, navigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (nextPath) => {
    setIsOpen(false);
    navigate(nextPath);
  };

  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
      <Link className="brand" href="/" navigate={go}>
        <span className="brand-mark">V</span>
        <span>
          <strong>Vohra & Co.</strong>
          <small>Chartered Accountants</small>
        </span>
      </Link>

      <button
        className={`nav-toggle ${isOpen ? "is-open" : ""}`}
        type="button"
        aria-expanded={isOpen}
        aria-controls="site-nav"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span></span>
        <span></span>
        <span></span>
        <span className="sr-only">Open navigation</span>
      </button>

      <nav className={`site-nav ${isOpen ? "is-open" : ""}`} id="site-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            navigate={go}
            className={path === item.path ? "active" : ""}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" href="/" navigate={navigate}>
            <span className="brand-mark">V</span>
            <span>
              <strong>Vohra & Co.</strong>
              <small>Chartered Accountants</small>
            </span>
          </Link>
          <p>Audit, tax, GST, accounting and advisory services for Indian businesses.</p>
        </div>
        <div>
          <h3>Pages</h3>
          {navItems.slice(1).map((item) => (
            <Link key={item.path} href={item.path} navigate={navigate}>
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <h3>Contact</h3>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <a href="mailto:hello@vohraca.in">hello@vohraca.in</a>
          <span>Mumbai | Delhi | Bengaluru</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Vohra & Co. Chartered Accountants.</span>
        <span>Professional guidance subject to engagement terms.</span>
      </div>
    </footer>
  );
}

function PageHero({ eyebrow, title, text }) {
  return (
    <section className="page-hero">
      <div className="container reveal">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}

function Home({ navigate }) {
  return (
    <>
      <section className="hero hero-home">
        <div className="hero-overlay"></div>
        <div className="container hero-content reveal">
          <span className="eyebrow">Chartered accountants for growth-focused Indian businesses</span>
          <h1 className="firm-title">Vohra & Co.</h1>
          <p>Premium tax, audit, compliance, accounting and CFO support for companies that want clarity before complexity becomes costly.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/contact" navigate={navigate}>Book a consultation</Link>
            <Link className="button button-secondary" href="/services" navigate={navigate}>Explore services</Link>
          </div>
          <div className="hero-metrics" aria-label="Firm highlights">
            <div><strong>250+</strong><span>Business clients served</span></div>
            <div><strong>14</strong><span>Core service areas</span></div>
            <div><strong>99%</strong><span>On-time compliance focus</span></div>
          </div>
        </div>
      </section>

      <section className="section intro-band">
        <div className="container split-grid">
          <div className="reveal">
            <span className="eyebrow">Built for founders, SMEs and established companies</span>
            <h2>One firm for your finance, tax and regulatory backbone.</h2>
          </div>
          <p className="lead reveal">We combine statutory discipline with business-first advisory, so your books stay clean, your filings stay timely and every major decision has reliable numbers behind it.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">Services</span>
              <h2>Complete CA services for businesses in India</h2>
            </div>
            <Link href="/services" navigate={navigate}>View all services</Link>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card reveal" key={service.title}>
                <span className="icon-pill">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="container split-grid">
          <div className="image-panel reveal">
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" alt="Financial planning desk with laptop and charts" />
          </div>
          <div className="reveal">
            <span className="eyebrow">Why businesses choose us</span>
            <h2>Precise compliance. Clear numbers. Calm decisions.</h2>
            <div className="feature-list">
              <div><strong>Partner-led reviews</strong><span>Every important filing and report is reviewed by senior professionals.</span></div>
              <div><strong>Monthly compliance rhythm</strong><span>GST, TDS, payroll and accounting deadlines are tracked through a single workflow.</span></div>
              <div><strong>Readable reporting</strong><span>Dashboards and MIS reports are designed for action, not just record keeping.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">Industries</span>
              <h2>Focused support across business models</h2>
            </div>
          </div>
          <div className="industry-strip reveal">
            {["Startups", "Manufacturing", "Trading", "E-commerce", "Real estate", "Healthcare", "Professional services", "Exporters"].map((industry) => (
              <span key={industry}>{industry}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section muted-section">
        <div className="container">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">Process</span>
              <h2>How engagements work</h2>
            </div>
          </div>
          <div className="process-grid">
            {[
              ["1", "Discovery", "We map your entity structure, current filings, books, risk points and growth plans."],
              ["2", "Compliance Setup", "We create a filing calendar, document checklist and monthly reporting workflow."],
              ["3", "Execution", "Our team manages filings, reconciliations, reporting and advisory checkpoints."],
              ["4", "Review", "You receive clear dashboards, exception notes and senior review calls."],
            ].map(([step, title, text]) => (
              <div className="process-step reveal" key={title}>
                <span>{step}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-wrap reveal">
          <div>
            <span className="eyebrow">Ready to organize your finance function?</span>
            <h2>Get a CA team that keeps your business compliant and decision-ready.</h2>
          </div>
          <Link className="button button-primary" href="/contact" navigate={navigate}>Start with a consultation</Link>
        </div>
      </section>
    </>
  );
}

function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="End-to-end CA services for Indian companies, LLPs and founders."
        text="From registrations and monthly compliance to audit, tax strategy and board-ready finance reporting."
      />
      <section className="section">
        <div className="container service-detail-grid">
          {detailedServices.map((service) => (
            <article className="detail-card reveal" key={service.title}>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
              <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      <section className="section dark-section">
        <div className="container">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">Engagement plans</span>
              <h2>Choose the right level of support</h2>
            </div>
          </div>
          <div className="plan-grid">
            <article className="plan-card reveal"><h3>Compliance Core</h3><p>For small businesses that need clean monthly filings and accounting oversight.</p><span>GST, TDS, accounting, payroll checklist</span></article>
            <article className="plan-card featured reveal"><h3>Growth Partner</h3><p>For teams that need compliance plus MIS, tax planning and quarterly review meetings.</p><span>Compliance, MIS, tax advisory, reviews</span></article>
            <article className="plan-card reveal"><h3>CFO Office</h3><p>For founder-led companies that need financial strategy, dashboards and board reporting.</p><span>Virtual CFO, forecasts, controls, reporting</span></article>
          </div>
        </div>
      </section>
    </>
  );
}

function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A modern CA firm built around trust, speed and clarity."
        text="We help Indian businesses stay compliant, investor-ready and financially organised through a senior-led advisory model."
      />
      <section className="section">
        <div className="container split-grid">
          <div className="image-panel reveal">
            <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80" alt="Finance team discussing reports in a meeting room" />
          </div>
          <div className="reveal">
            <span className="eyebrow">Our approach</span>
            <h2>We treat compliance as a business system, not a last-minute scramble.</h2>
            <p className="lead">Vohra & Co. Chartered Accountants works with entrepreneurs, family businesses and corporate finance teams that need dependable execution and sharper advisory.</p>
            <div className="values-grid">
              <div><strong>Accuracy</strong><span>Reconciled books and reviewed filings.</span></div>
              <div><strong>Responsiveness</strong><span>Practical answers and visible progress.</span></div>
              <div><strong>Confidentiality</strong><span>Secure handling of sensitive financial data.</span></div>
              <div><strong>Commercial thinking</strong><span>Advice shaped by real business constraints.</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section muted-section">
        <div className="container">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">Leadership</span>
              <h2>Senior expertise across tax, audit and finance operations</h2>
            </div>
          </div>
          <div className="team-grid">
            <article className="team-card reveal"><div className="avatar">AV</div><h3>CA Amaan Vohra</h3><p>Managing Partner, direct tax and business advisory.</p></article>
            <article className="team-card reveal"><div className="avatar">RV</div><h3>CA Raza Vohra</h3><p>Partner, audit, assurance and internal controls.</p></article>
            <article className="team-card reveal"><div className="avatar">SV</div><h3>CA Sana Vohra</h3><p>Partner, GST, payroll and outsourced finance.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}

function Insights({ navigate }) {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Useful finance and compliance thinking for Indian business owners."
        text="Simple, boardroom-ready explainers for tax, GST, audit readiness and finance operations."
      />
      <section className="section">
        <div className="container insight-grid">
          {[
            ["GST", "How to keep input tax credit reconciled every month", "A practical checklist for purchase matching, vendor follow-ups and exception tracking.", "Discuss GST review"],
            ["Audit", "Audit readiness starts before year end", "Close books faster with fixed asset schedules, confirmations, reconciliations and SOP evidence.", "Plan audit support"],
            ["Founder finance", "The monthly MIS every founder should read", "Revenue, margins, cash runway, receivables and statutory dues in one compact dashboard.", "Build an MIS pack"],
          ].map(([tag, title, text, action]) => (
            <article className="insight-card reveal" key={title}>
              <span>{tag}</span>
              <h2>{title}</h2>
              <p>{text}</p>
              <Link href="/contact" navigate={navigate}>{action}</Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section muted-section">
        <div className="container split-grid">
          <div className="reveal">
            <span className="eyebrow">Compliance calendar</span>
            <h2>A calmer monthly rhythm for recurring statutory work.</h2>
            <p className="lead">Actual due dates may vary by entity type, notifications and extensions. We track deadlines inside each engagement and confirm applicability before every filing cycle.</p>
          </div>
          <div className="calendar-card reveal">
            <div><strong>Monthly</strong><span>GST returns, TDS payment, payroll, PF/ESI checks</span></div>
            <div><strong>Quarterly</strong><span>TDS returns, advance tax review, MIS deep dive</span></div>
            <div><strong>Annual</strong><span>Audit, ITR, ROC filings, tax planning and records closure</span></div>
          </div>
        </div>
      </section>
    </>
  );
}

function Contact() {
  const [status, setStatus] = useState("We usually respond within one business day.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBase = useMemo(() => {
    return import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("Sending your enquiry...");

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      service: formData.get("service")?.toString().trim(),
      message: formData.get("message")?.toString().trim(),
    };

    try {
      const response = await fetch(`${apiBase}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit enquiry.");
      }

      event.currentTarget.reset();
      setStatus("Thank you. Your enquiry has been sent successfully.");
    } catch (error) {
      setStatus(error.message || "Could not send right now. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what your business needs next."
        text="Share your compliance, audit, tax or finance operations requirement. We will respond with the right next step."
      />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-panel reveal">
            <span className="eyebrow">Reach us</span>
            <h2>Book a confidential consultation.</h2>
            <div className="contact-list">
              <a href="tel:+919876543210"><strong>Phone</strong><span>+91 98765 43210</span></a>
              <a href="mailto:hello@vohraca.in"><strong>Email</strong><span>hello@vohraca.in</span></a>
              <a href="https://wa.me/919876543210"><strong>WhatsApp</strong><span>Start a quick chat</span></a>
              <div><strong>Offices</strong><span>Mumbai | Delhi | Bengaluru</span></div>
            </div>
          </div>

          <form className="contact-form reveal" onSubmit={handleSubmit}>
            <label>Full name<input type="text" name="name" placeholder="Your name" required /></label>
            <label>Work email<input type="email" name="email" placeholder="you@company.com" required /></label>
            <label>Phone<input type="tel" name="phone" placeholder="+91" required /></label>
            <label>
              Service required
              <select name="service" required>
                <option value="">Select a service</option>
                <option>Audit & Assurance</option>
                <option>GST & Indirect Tax</option>
                <option>Income Tax & TDS</option>
                <option>Accounting & Payroll</option>
                <option>ROC & MCA Compliance</option>
                <option>Virtual CFO</option>
              </select>
            </label>
            <label className="full-field">Message<textarea name="message" rows="5" placeholder="Tell us about your business and timeline" required></textarea></label>
            <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send enquiry"}</button>
            <p className="form-note">{status}</p>
          </form>
        </div>
      </section>
    </>
  );
}

function App() {
  const [path, navigate] = useRoute();
  const normalizedPath = ["/", "/services", "/about", "/insights", "/contact"].includes(path) ? path : "/";

  useReveal(normalizedPath);

  return (
    <>
      <Header path={normalizedPath} navigate={navigate} />
      <main>
        {normalizedPath === "/" && <Home navigate={navigate} />}
        {normalizedPath === "/services" && <Services />}
        {normalizedPath === "/about" && <About />}
        {normalizedPath === "/insights" && <Insights navigate={navigate} />}
        {normalizedPath === "/contact" && <Contact />}
      </main>
      <Footer navigate={navigate} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
