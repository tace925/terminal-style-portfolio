import { FormEvent, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light";
type FormStatus = "idle" | "sending" | "sent" | "error";

type Project = {
  id: string;
  method: string;
  title: string;
  category: "management" | "property" | "portfolio" | "payments";
  stack: string[];
  description: string;
  links: { label: string; href: string }[];
  note?: string;
};

const FORM_ENDPOINT = "https://formspree.io/f/mwkgyqaw";

const navItems = [
  { label: "// home", href: "#home" },
  { label: "// about", href: "#about" },
  { label: "// work", href: "#work" },
  { label: "// playground", href: "#playground" },
  { label: "// connect", href: "#connect" },
];

const filters = [
  { label: "all", value: "all" },
  { label: "management", value: "management" },
  { label: "property", value: "property" },
  { label: "portfolio", value: "portfolio" },
  { label: "payments", value: "payments" },
] as const;

const projects: Project[] = [
  {
    id: "kag-katoloni",
    method: "KAGKatoloni",
    title: "KAG Katoloni Guest House and Church Management System",
    category: "payments",
    stack: ["JavaScript", "Firebase Firestore", "Firebase Auth", "M-Pesa"],
    description:
      "Full booking system for Mountain of the Lord Prayer Center, Katoloni, covering room selection, dynamic pricing, guest booking lookup, and a multi-portal admin system for Admin, Bishop, Protocol, and Disciple Classes. Includes real Firebase authentication and audit logging.",
    links: [{ label: "open deployment", href: "https://kag-katoloni.vercel.app/" }],
  },
  {
    id: "pronest",
    method: "ProNest",
    title: "ProNest",
    category: "property",
    stack: ["JavaScript", "Responsive UI", "Vercel"],
    description:
      "Property and rental-style management platform focused on clean browsing flows, responsive presentation, and fast deployment. The current description is based on the live URL naming and should be adjusted if the project scope has changed.",
    links: [{ label: "open deployment", href: "https://pro-nest-nine.vercel.app/" }],
    note: "Title and scope inferred from URL only - confirm the final case-study wording.",
  },
  {
    id: "fine-villa",
    method: "FineVilla",
    title: "Fine Villa",
    category: "property",
    stack: ["JavaScript", "HTML/CSS", "Vercel"],
    description:
      "Villa rental and property showcase experience with a straightforward public-facing presentation. Built to make property details, visuals, and contact paths easy to scan on mobile and desktop.",
    links: [{ label: "open deployment", href: "https://fine-villa.vercel.app/" }],
    note: "Title and scope inferred from URL only - confirm the final case-study wording.",
  },
  {
    id: "pc-kinyanjui",
    method: "PCKinyanjuiInstituteManagement",
    title: "P.C. Kinyanjui Institute Management System",
    category: "management",
    stack: ["JavaScript", "Admin Dashboard", "Data Management"],
    description:
      "Institute management dashboard designed around admin workflows, records, and day-to-day operational visibility. The project translates school-management needs into a focused browser-based control surface.",
    links: [
      {
        label: "open deployment",
        href: "https://p-c-kinyanjui-institute-management.vercel.app/",
      },
    ],
    note: "Title and scope inferred from URL only - confirm the final case-study wording.",
  },
  {
    id: "paul-investment",
    method: "PaulInvestmentPortfolio",
    title: "Paul's Investment Portfolio",
    category: "portfolio",
    stack: ["HTML/CSS", "JavaScript", "Dark Mode", "Metrics UI"],
    description:
      "Professional portfolio site for investor Paul Mutuku Kingo'la with metrics, testimonials, dark mode, and a clean executive presentation that keeps credibility and contact actions visible.",
    links: [{ label: "open deployment", href: "https://paul-investment-portfolio.vercel.app/" }],
  },
  {
    id: "mess-system",
    method: "MessSystem",
    title: "Mess System",
    category: "management",
    stack: ["JavaScript", "Management System", "Vercel"],
    description:
      "Dining hall and mess management system for tracking meal-service operations. Built as a practical management interface rather than a marketing page.",
    links: [{ label: "open deployment", href: "https://mess-system-ashen.vercel.app/" }],
    note: "Title and scope inferred from URL only - confirm the final case-study wording.",
  },
];

const codeFaintLines = [
  "public class INFORMATION {",
  "  public string name = \"Tevin Mulinge Mutuku\";",
  "  enum LANGUAGES { JavaScript, TypeScript, Python, Cpp }",
  "  enum SERVICES { React, Firebase, Supabase, PostgreSQL }",
  "  enum PAYMENTS { MPesa, Paystack }",
  "}",
];

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem("portfolio_theme") === "light" ? "light" : "dark";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [progress, setProgress] = useState(0);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [openProject, setOpenProject] = useState(projects[0].id);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    window.localStorage.setItem("portfolio_theme", theme);
    document.body.style.background = theme === "dark" ? "#050506" : "#faf7ee";
    document.body.style.color = theme === "dark" ? "#f4efe0" : "#15120d";
  }, [theme]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, percentage)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    if (!filteredProjects.some((project) => project.id === openProject)) {
      setOpenProject(filteredProjects[0]?.id ?? "");
    }
  }, [filteredProjects, openProject]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("sending");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Formspree rejected the submission.");
      }

      form.reset();
      setFormStatus("sent");
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <main className={`site-shell ${theme}`}>
      <div className="fixed left-0 top-0 z-50 h-1 bg-[var(--gold)] transition-[width] duration-150" style={{ width: `${progress}%` }} />

      <nav className="fixed left-1/2 top-4 z-40 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 px-2 sm:top-6">
        <div className="tab-bar mx-auto flex items-end justify-center overflow-x-auto rounded-t-[28px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--panel)_88%,transparent)] px-2 pt-2 shadow-2xl shadow-black/20 backdrop-blur-xl">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-tab shrink-0 rounded-t-2xl px-3 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--muted)] transition hover:bg-[var(--tab-hover)] hover:text-[var(--text)] sm:px-5"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <button
        type="button"
        onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        className="fixed bottom-5 right-5 z-40 border border-[var(--line)] bg-[var(--panel)] px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--text)] shadow-xl shadow-black/20 transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
      >
        {theme === "dark" ? "dark mode" : "light mode"}
      </button>

      <section id="home" className="hero-plane relative flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-32 sm:px-10 lg:px-16">
        <div className="code-atmosphere" aria-hidden="true">
          {codeFaintLines.map((line, index) => (
            <span key={line} style={{ animationDelay: `${index * 0.55}s` }}>
              {line}
            </span>
          ))}
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
          <div className="max-w-4xl">
            <p className="mb-8 font-mono text-sm leading-7 text-[var(--comment)] sm:text-base">
              /// &lt;summary&gt;
              <br />
              /// Full Stack Developer from Nairobi building practical,
              <br className="hidden sm:block" />
              /// user-focused systems with clean code and real payment flows.
              <br />
              /// &lt;/summary&gt;
            </p>

            <h1 className="brand-title max-w-5xl text-[clamp(3.7rem,13vw,11rem)] font-black uppercase leading-[0.82] tracking-[-0.09em] text-[var(--text)]">
              Tevin
              <span className="block pl-[0.05em]">Mulinge</span>
              <span className="block pl-[0.18em]">Mutuku</span>
            </h1>

            <div className="mt-8 h-10 overflow-hidden font-mono text-xl text-[var(--gold)] sm:text-3xl">
              <span className="typing-text inline-block whitespace-nowrap">Full Stack Developer</span>
            </div>
          </div>

          <div className="hidden font-mono text-sm leading-7 text-[var(--muted)] lg:block">
            <pre className="hero-code whitespace-pre-wrap text-right">
{`namespace Nairobi.Web;

public sealed class BuildLoop {
  public bool ships = true;
  public string focus = "systems that work";
  private string[] tools = { "React", "TypeScript", "Firebase", "Supabase" };
}`}
            </pre>
          </div>
        </div>
      </section>

      <section id="about" className="section-wrap">
        <div className="section-heading">
          <p className="section-kicker">// about</p>
          <h2>information.class</h2>
        </div>

        <TerminalWindow filename="information.class">
          <pre className="code-block">
            <CodeLine level={0} token="public class" value=" INFORMATION" suffix=" {" />
            <CodeLine level={1} token="public string" value=" name" suffix={' = "Tevin Mulinge Mutuku";'} />
            <CodeLine level={1} token="public string" value=" role" suffix={' = "Full Stack Developer";'} />
            <CodeLine level={1} token="public string" value=" base" suffix={' = "Nairobi, Kenya";'} />
            <br />
            <CodeLine level={1} token="public enum" value=" LANGUAGES" suffix=" {" />
            <CodeLine level={2} value="JavaScript, TypeScript, Python, Cpp, HTML5, CSS3" />
            <CodeLine level={1} suffix="}" />
            <br />
            <CodeLine level={1} token="public enum" value=" SERVICES" suffix=" {" />
            <CodeLine level={2} value="React, NodeJS, REST_APIs, Supabase, Firebase, PostgreSQL" />
            <CodeLine level={2} value="Vercel, Netlify, GitHub, JSON_Storage, Responsive_Design" />
            <CodeLine level={1} suffix="}" />
            <br />
            <CodeLine level={1} token="public enum" value=" PAYMENTS" suffix=" {" />
            <CodeLine level={2} value="MPesa, Paystack" />
            <CodeLine level={1} suffix="}" />
            <CodeLine level={0} suffix="}" />
          </pre>
        </TerminalWindow>
      </section>

      <section id="work" className="section-wrap">
        <div className="section-heading">
          <p className="section-kicker">// work</p>
          <h2>case studies stay in scroll</h2>
          <p>
            Click a method signature to expand the project in place. Filtering targets the same
            <code className="mx-2 font-mono text-[var(--gold)]">.code-project</code>
            blocks.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`filter-button ${activeFilter === filter.value ? "is-active" : ""}`}
            >
              filter::{filter.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredProjects.map((project) => {
            const isOpen = openProject === project.id;

            return (
              <article key={project.id} className="code-project border-y border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setOpenProject(isOpen ? "" : project.id)}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left font-mono transition hover:text-[var(--gold)]"
                  aria-expanded={isOpen}
                  aria-controls={`${project.id}-panel`}
                >
                  <span>
                    <span className="text-[var(--keyword)]">public void</span>{" "}
                    <span className="text-[var(--function)]">{project.method}</span>
                    <span className="text-[var(--muted)]">()</span>
                  </span>
                  <span className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    {isOpen ? "collapse" : "expand"}
                  </span>
                </button>

                <div id={`${project.id}-panel`} className={`project-panel ${isOpen ? "open" : ""}`}>
                  <div className="pb-7 pl-0 sm:pl-8">
                    <h3 className="mb-3 text-2xl font-semibold tracking-tight text-[var(--text)]">{project.title}</h3>
                    <p className="mb-4 font-mono text-sm text-[var(--muted)]">stack: {project.stack.join(" / ")}</p>
                    <p className="max-w-4xl text-base leading-8 text-[var(--soft)]">{project.description}</p>
                    {project.note && <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-[var(--warning)]">// {project.note}</p>}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {project.links.map((link) => (
                        <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="code-link">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="playground" className="section-wrap">
        <div className="section-heading">
          <p className="section-kicker">// playground</p>
          <h2>debug notes and build loops</h2>
          <p>Small habits from the workbench: test the flow, ship the path, then clean the trace.</p>
        </div>

        <div className="playground-lines font-mono text-sm leading-8 sm:text-base">
          <p><span>01</span> if (idea.isMessy) refactor("one reliable user path");</p>
          <p><span>02</span> while (paymentFlow.pending) verify(MPesa, Paystack, callbacks);</p>
          <p><span>03</span> deploy.to(["Vercel", "Netlify"]).then(() =&gt; monitor.logs());</p>
          <p><span>04</span> remember("fixed a segfault at 3am; celebrated with cold chai");</p>
        </div>
      </section>

      <section id="connect" className="section-wrap pb-28">
        <div className="section-heading">
          <p className="section-kicker">// connect</p>
          <h2>media.class</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <TerminalWindow filename="media.class">
            <pre className="code-block">
              <CodeLine level={0} token="public enum" value=" MEDIA" suffix=" {" />
              <CodeComment level={1} label="EMAIL" href="mailto:tevinmulinge@gmail.com" value="tevinmulinge@gmail.com" />
              <CodeComment level={1} label="GITHUB" href="https://github.com/tace925" value="github.com/tace925" />
              <CodeComment level={1} label="TWITTER" href="https://twitter.com/tace925" value="twitter.com/tace925" />
              <CodeComment level={1} label="PHONE" href="tel:+254743936403" value="+254 743 936 403" />
              <CodeLine level={0} suffix="}" />
            </pre>
          </TerminalWindow>

          <form onSubmit={handleSubmit} className="contact-form border border-[var(--line)] bg-[var(--panel)] p-5 font-mono shadow-2xl shadow-black/10 sm:p-7">
            <label>
              <span>// your name</span>
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              <span>// email</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              <span>// message</span>
              <textarea name="message" required rows={5} />
            </label>
            <button type="submit" disabled={formStatus === "sending"} className="submit-button">
              {formStatus === "sending" ? "submitting..." : "submit via Formspree"}
            </button>
            {formStatus === "sent" && <p className="form-note text-[var(--success)]">// Message queued successfully.</p>}
            {formStatus === "error" && <p className="form-note text-[var(--warning)]">// Submission failed. Check the Formspree endpoint.</p>}
          </form>
        </div>
      </section>
    </main>
  );
}

function TerminalWindow({ filename, children }: { filename: string; children: React.ReactNode }) {
  return (
    <div className="terminal-window overflow-hidden border border-[var(--line)] bg-[var(--terminal)] shadow-2xl shadow-black/20">
      <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3 font-mono text-xs text-[var(--muted)]">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 uppercase tracking-[0.18em]">{filename}</span>
      </div>
      <div className="overflow-x-auto p-5 sm:p-7">{children}</div>
    </div>
  );
}

function CodeLine({ level, token, value, suffix = "" }: { level: number; token?: string; value?: string; suffix?: string }) {
  return (
    <span className="block">
      <span aria-hidden="true">{"  ".repeat(level)}</span>
      {token && <span className="text-[var(--keyword)]">{token}</span>}
      {value && <span className="text-[var(--function)]">{value}</span>}
      {suffix && <span className="text-[var(--soft)]">{suffix}</span>}
    </span>
  );
}

function CodeComment({ level, label, value, href }: { level: number; label: string; value: string; href: string }) {
  return (
    <span className="block">
      <span aria-hidden="true">{"  ".repeat(level)}</span>
      <span className="text-[var(--comment)]">// {label} = </span>
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="text-[var(--gold)] underline-offset-4 hover:underline">
        "{value}"
      </a>
    </span>
  );
}