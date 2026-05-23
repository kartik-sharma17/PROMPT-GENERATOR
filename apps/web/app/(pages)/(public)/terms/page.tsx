"use client"

import { Navbar } from "@/@comp"
import { Footer } from "@/@comp"
import { useRouter } from "next/navigation"

const EFFECTIVE_DATE = "May 23, 2026"
const CONTACT_EMAIL = "support.clarix@gmail.com"
const WEBSITE = "https://www.clarixai.in"

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      {
        subtitle: null,
        text: `By accessing or using Clarix AI (available at ${WEBSITE}), creating an account, or clicking "Get Started" or "Start for Free", you confirm that you have read, understood, and agree to be bound by these Terms of Service ("Terms") and our Privacy Policy, which is incorporated by reference.`,
      },
      {
        subtitle: null,
        text: "If you do not agree to these Terms, you must not access or use the service. If you are using Clarix AI on behalf of an organisation, you represent that you have the authority to bind that organisation to these Terms.",
      },
    ],
  },
  {
    id: "description",
    title: "Description of Service",
    content: [
      {
        subtitle: null,
        text: "Clarix AI is an AI-powered prompt optimisation platform that transforms your ideas into structured, high-quality prompts for AI models including ChatGPT, Gemini, Claude, Midjourney, Stable Diffusion, and others (`Service`). The Service is provided on a subscription basis with a limited free tier.",
      },
      {
        subtitle: null,
        text: "We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice. We are not liable to you or any third party for any modification, suspension, or discontinuation of the Service.",
      },
    ],
  },
  {
    id: "accounts",
    title: "User Accounts",
    content: [
      {
        subtitle: "Registration",
        text: "You must provide accurate, current, and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account.",
      },
      {
        subtitle: "Account Security",
        text: "You agree to notify us immediately at legal@clarixai.in if you suspect any unauthorised use of your account. We are not liable for any loss arising from your failure to keep your credentials secure.",
      },
      {
        subtitle: "One Account Per Person",
        text: "You may not create multiple accounts to circumvent usage limits, access free tiers repeatedly, or abuse promotional offers. We reserve the right to merge or terminate duplicate accounts.",
      },
      {
        subtitle: "Age Requirement",
        text: "You must be at least 13 years of age to use Clarix AI. By creating an account, you confirm you meet this requirement. If you are between 13 and 18, you must have parental consent.",
      },
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    content: [
      {
        subtitle: null,
        text: "You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not use Clarix AI to:",
      },
      {
        subtitle: "Prohibited Content",
        text: "Generate prompts or content that is illegal, defamatory, obscene, harassing, threatening, or that infringes any third-party intellectual property rights.",
      },
      {
        subtitle: "Malicious Use",
        text: "Attempt to reverse-engineer, decompile, or extract source code from the Service; introduce malware, viruses, or any harmful code; or interfere with the integrity or performance of our servers.",
      },
      {
        subtitle: "Automated Scraping",
        text: "Use bots, crawlers, or scripts to scrape, reproduce, or systematically download any portion of the Service without our prior written permission.",
      },
      {
        subtitle: "Misrepresentation",
        text: "Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity.",
      },
      {
        subtitle: null,
        text: "We reserve the right to terminate accounts that violate these rules, without refund, and to report illegal activity to the appropriate authorities.",
      },
    ],
  },
  {
    id: "subscriptions",
    title: "Subscriptions & Payments",
    content: [
      {
        subtitle: "Plans",
        text: "Clarix AI offers a free tier with limited daily prompts and paid subscription plans (Pro, Premium, and their annual equivalents) with expanded limits and features. Plan details, including pricing in Indian Rupees (₹), are described on our pricing page and are subject to change with 14 days' notice.",
      },
      {
        subtitle: "Billing",
        text: "Paid subscriptions are billed in advance on a monthly or annual basis through Razorpay. By subscribing, you authorise Razorpay to charge your selected payment method for the applicable subscription fee.",
      },
      {
        subtitle: "Taxes",
        text: "Subscription prices are exclusive of applicable taxes. GST or other taxes, where applicable, will be added at checkout as required by Indian law.",
      },
      {
        subtitle: "Cancellation",
        text: "You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period. You will continue to have access to paid features until that date.",
      },
      {
        subtitle: "Refunds",
        text: "We do not offer refunds for partial billing periods. If you believe you have been incorrectly charged, contact us within 7 days of the charge at legal@clarixai.in and we will investigate promptly.",
      },
      {
        subtitle: "Free Trial",
        text: "Where a free trial is offered, it will automatically convert to a paid subscription at the end of the trial period unless cancelled beforehand. You will receive a reminder email before conversion.",
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: [
      {
        subtitle: "Our IP",
        text: "All software, design, algorithms, trademarks, logos, and content comprising the Clarix AI platform are owned by or licensed to us and are protected by applicable intellectual property laws. You may not copy, reproduce, or distribute any part of the Service without our written consent.",
      },
      {
        subtitle: "Your Content",
        text: "You retain full ownership of the prompts you input and the outputs generated for you. By using the Service, you grant us a limited, non-exclusive, royalty-free licence to process your content solely to provide and improve the Service. We do not claim ownership over your prompts or outputs.",
      },
      {
        subtitle: "Feedback",
        text: "If you submit feedback, suggestions, or ideas about the Service, you grant us the right to use that feedback without restriction or compensation to you.",
      },
    ],
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    content: [
      {
        subtitle: null,
        text: "The Service integrates with third-party AI providers (e.g. OpenAI, Google, Anthropic) and payment processors (Razorpay). Your use of these integrations is also subject to the respective third party's terms and policies. We are not responsible for the practices, content, or availability of any third-party service.",
      },
      {
        subtitle: null,
        text: "The Service may contain links to external websites. These links are provided for convenience only. We do not endorse and are not responsible for the content of linked websites.",
      },
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: [
      {
        subtitle: "As-Is Basis",
        text: 'The Service is provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.',
      },
      {
        subtitle: "AI Output Accuracy",
        text: "AI-generated prompts and outputs may be inaccurate, incomplete, or unsuitable for your specific use case. You are solely responsible for reviewing and validating any output before use. Do not rely on AI-generated content for legal, medical, financial, or safety-critical decisions.",
      },
      {
        subtitle: "Uptime",
        text: "We do not guarantee that the Service will be available at all times. We may experience downtime for maintenance, updates, or reasons beyond our control. We will endeavour to notify you in advance of planned outages.",
      },
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: [
      {
        subtitle: null,
        text: "To the fullest extent permitted by applicable law, Clarix AI and its directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, goodwill, or business interruption — arising from your use of or inability to use the Service, even if advised of the possibility of such damages.",
      },
      {
        subtitle: null,
        text: "Our total aggregate liability to you for any claim arising out of or related to these Terms shall not exceed the greater of (a) the total amount you paid to us in the 3 months preceding the claim, or (b) ₹500.",
      },
    ],
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: [
      {
        subtitle: null,
        text: "You agree to indemnify, defend, and hold harmless Clarix AI, its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses — including legal fees — arising out of or related to your use of the Service, your violation of these Terms, or your violation of any third-party rights.",
      },
    ],
  },
  {
    id: "termination",
    title: "Termination",
    content: [
      {
        subtitle: null,
        text: "We may suspend or terminate your access to the Service immediately, without prior notice, if you materially breach these Terms or if we reasonably believe your use of the Service poses a risk to us, other users, or third parties.",
      },
      {
        subtitle: null,
        text: "You may terminate your account at any time by contacting us or using the account deletion option in your settings. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination (including ownership, disclaimers, and limitation of liability) will continue to apply.",
      },
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law & Disputes",
    content: [
      {
        subtitle: null,
        text: "These Terms are governed by and construed in accordance with the laws of India, without regard to conflict of law principles.",
      },
      {
        subtitle: null,
        text: "Any dispute arising out of or in connection with these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be subject to the exclusive jurisdiction of the courts located in India.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    content: [
      {
        subtitle: null,
        text: "We may revise these Terms from time to time. When we make material changes, we will notify you by email or via a prominent notice on the website at least 14 days before the changes take effect. Your continued use of the Service after the effective date of the revised Terms constitutes your acceptance of the changes.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    content: [
      {
        subtitle: null,
        text: `If you have any questions about these Terms, please contact us at ${CONTACT_EMAIL}. We aim to respond to all enquiries within 3 business days.`,
      },
    ],
  },
]

export default function TermsPage() {
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
          Terms of{" "}
          <span className="gradient-text-animated">Service</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Please read these terms carefully before using Clarix AI. They govern
          your access to and use of our platform.
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
            Questions about these terms?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="underline transition-colors"
              style={{ color: "hsl(var(--theme-primary))" }}
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <button
            onClick={() => router.push("/privacy")}
            className="text-xs text-gray-500 hover:text-white transition-colors underline"
          >
            Read our Privacy Policy →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}