"use client"

import { Navbar } from "@/@comp"
import { Footer } from "@/@comp"
import { useRouter } from "next/navigation"

const EFFECTIVE_DATE = "May 23, 2026"
const CONTACT_EMAIL = "support.clarix@gmail.com"
const WEBSITE = "https://www.clarixai.in"

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: [
      {
        subtitle: "Account Information",
        text: "When you register for a Clarix AI account, we collect your name, email address, and a hashed password. If you sign up via a third-party OAuth provider (e.g. Google), we receive only the profile data that provider shares with us.",
      },
      {
        subtitle: "Usage & Prompt Data",
        text: "We collect the prompts you submit, the AI model you select, and the outputs generated. This data is used solely to deliver the service and to improve prompt quality. We do not sell or license your prompt data to third parties.",
      },
      {
        subtitle: "Payment Information",
        text: "All payments are processed by Razorpay. We do not store your card number, CVV, or bank account details on our servers. We only retain the transaction ID, plan details, and subscription status returned by Razorpay.",
      },
      {
        subtitle: "Technical & Log Data",
        text: "We automatically collect standard server logs including your IP address, browser type, operating system, referring URLs, pages visited, and the date and time of each request. This data is used for security, debugging, and aggregate analytics.",
      },
      {
        subtitle: "Cookies & Local Storage",
        text: "We use strictly necessary cookies to maintain your authenticated session and remember your preferences. We do not serve third-party advertising cookies. You can disable cookies in your browser settings, but some features of the service may not function correctly.",
      },
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: [
      {
        subtitle: null,
        text: "We use the information we collect for the following purposes:",
      },
      {
        subtitle: "Service Delivery",
        text: "To authenticate you, process your prompts, return generated results, and manage your subscription across billing cycles.",
      },
      {
        subtitle: "Service Improvement",
        text: "To analyse aggregate usage patterns, identify bugs, and improve the quality of our AI prompt optimisation engine. Individual prompt data is never used for training external AI models.",
      },
      {
        subtitle: "Communications",
        text: "To send you transactional emails (account creation, subscription receipts, password reset) and, with your consent, product updates or feature announcements. You can unsubscribe from marketing emails at any time.",
      },
      {
        subtitle: "Security & Fraud Prevention",
        text: "To detect and block abuse, unauthorised access, and violations of our Terms of Service.",
      },
      {
        subtitle: "Legal Obligations",
        text: "To comply with applicable laws, regulations, court orders, or lawful requests from governmental authorities.",
      },
    ],
  },
  {
    id: "data-sharing",
    title: "Data Sharing & Third Parties",
    content: [
      {
        subtitle: null,
        text: "We do not sell your personal data. We share it only in the following limited circumstances:",
      },
      {
        subtitle: "Payment Processor",
        text: "Razorpay receives the data necessary to process your payment. Their privacy practices are governed by Razorpay's Privacy Policy.",
      },
      {
        subtitle: "AI Model Providers",
        text: "Your prompts are transmitted to the AI providers you select (e.g. OpenAI, Google, Anthropic) solely to generate a response. Each provider's data handling is governed by their own terms. We recommend reviewing them before use.",
      },
      {
        subtitle: "Infrastructure Providers",
        text: "We use cloud hosting and monitoring services. These providers process data on our behalf under contractual data processing agreements and are not permitted to use your data for their own purposes.",
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose your information if required by law, to protect our legal rights, or to prevent imminent harm to any person.",
      },
      {
        subtitle: "Business Transfers",
        text: "In the event of a merger, acquisition, or sale of assets, your data may be transferred to the successor entity. We will notify you via email or a prominent notice on our website before your data becomes subject to a different privacy policy.",
      },
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: [
      {
        subtitle: null,
        text: "We retain your account and prompt data for as long as your account is active or as needed to provide the service. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law (e.g. financial records, which are retained for 7 years under Indian accounting regulations).",
      },
      {
        subtitle: null,
        text: "Aggregated, anonymised analytics data from which you cannot be identified may be retained indefinitely for product research.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: [
      {
        subtitle: null,
        text: "Subject to applicable law, you have the following rights regarding your personal data:",
      },
      {
        subtitle: "Access",
        text: "Request a copy of the personal data we hold about you.",
      },
      {
        subtitle: "Correction",
        text: "Request that we correct inaccurate or incomplete data.",
      },
      {
        subtitle: "Deletion",
        text: "Request deletion of your account and associated personal data.",
      },
      {
        subtitle: "Portability",
        text: "Request your data in a structured, machine-readable format.",
      },
      {
        subtitle: "Objection",
        text: "Object to processing of your data for direct marketing at any time.",
      },
      {
        subtitle: null,
        text: `To exercise any of these rights, email us at ${CONTACT_EMAIL}. We will respond within 30 days.`,
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    content: [
      {
        subtitle: null,
        text: "We implement industry-standard security measures including TLS encryption for data in transit, bcrypt hashing for passwords, and access controls limiting who within our team can access personal data. No method of transmission over the internet is 100% secure; while we strive to protect your data, we cannot guarantee absolute security.",
      },
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: [
      {
        subtitle: null,
        text: "Clarix AI is not directed at children under the age of 13. We do not knowingly collect personal data from anyone under 13. If you believe we have inadvertently collected such data, please contact us immediately and we will delete it promptly.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: [
      {
        subtitle: null,
        text: "We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email or by displaying a prominent notice on the website at least 14 days before the changes take effect. Your continued use of the service after the effective date constitutes acceptance of the revised policy.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    content: [
      {
        subtitle: null,
        text: `If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at ${CONTACT_EMAIL}. We are committed to resolving complaints about your privacy and our collection or use of your personal data.`,
      },
    ],
  },
]

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div className="bg-(--sec-bg) text-white min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-12 text-center">
        {/* badge */}
        <div className="flex justify-center mb-6">
          <span
            className="breathing-glow inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "hsl(var(--glass) / 60%)",
              border: "1px solid hsl(var(--glass-border) / 0.4)",
              color: "hsl(var(--theme-primary))",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full pulse-glow"
              style={{ background: "hsl(var(--theme-primary))" }}
            />
            Legal
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Privacy{" "}
          <span className="gradient-text-animated">Policy</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          We believe in being transparent about how we collect, use, and protect
          your data. This policy explains exactly that.
        </p>
        <p className="text-sm mt-4" style={{ color: "hsl(var(--theme-primary))" }}>
          Effective Date: {EFFECTIVE_DATE}
        </p>
      </section>

      {/* ── Table of Contents ── */}
      <section className="max-w-4xl mx-auto px-6 mb-12">
        <div
          className="glass-card p-6 rounded-2xl"
          style={{ border: "1px solid hsl(var(--glow) / 0.15)" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
            Contents
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
                >
                  <span
                    className="text-xs font-mono w-5 text-right flex-shrink-0"
                    style={{ color: "hsl(var(--theme-primary))" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="group-hover:underline">{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 flex flex-col gap-10">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            id={section.id}
            className="glass-card rounded-2xl p-8 scroll-mt-24"
            style={{ border: "1px solid hsl(var(--glow) / 0.1)" }}
          >
            {/* section header */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="flex-shrink-0 text-xs font-mono font-bold w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "hsl(var(--glow) / 0.12)",
                  color: "hsl(var(--theme-primary))",
                  border: "1px solid hsl(var(--glow) / 0.2)",
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
            </div>

            <div className="flex flex-col gap-4">
              {section.content.map((block, i) => (
                <div key={i}>
                  {block.subtitle && (
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "hsl(var(--theme-primary))" }}
                    >
                      {block.subtitle}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {block.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ── Bottom note ── */}
        <div className="text-center pt-6">
          <p className="text-gray-500 text-xs mb-4">
            Questions about this policy?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline transition-colors"
              style={{ color: "hsl(var(--theme-primary))" }}
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <button
            onClick={() => router.push("/terms")}
            className="text-xs text-gray-500 hover:text-white transition-colors underline"
          >
            Read our Terms of Service →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}