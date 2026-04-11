"use client";

import { motion, useInView } from "framer-motion";
import {
  Zap,
  FolderOpen,
  Save,
  SlidersHorizontal,
  Bot,
  ShieldCheck,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
  Globe,
  Target,
  Lightbulb,
} from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

// ── Floating dot ──────────────────────────────────────────────────────────────
const Dot = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.span
    className="absolute rounded-full pointer-events-none"
    style={{
      width: 3,
      height: 3,
      background: "color-mix(in srgb, var(--theme-primary-raw) 30%, transparent)",
      top: y,
      left: x,
    }}
    animate={{ y: [0, -16, 0], opacity: [0.15, 0.65, 0.15] }}
    transition={{ duration: 4 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const DOTS = Array.from({ length: 30 }, (_, i) => ({
  delay: (i * 0.37) % 3,
  x: `${(i * 13 + 7) % 100}%`,
  y: `${(i * 17 + 5) % 100}%`,
}));

// ── Animated section reveal ───────────────────────────────────────────────────
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
    style={{
      background: "color-mix(in srgb, var(--theme-primary-raw) 7%, transparent)",
      border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 18%, transparent)",
      color: "var(--theme-primary-raw)",
    }}
  >
    <span
      className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
      style={{ background: "var(--theme-primary-raw)" }}
    />
    {children}
  </span>
);

// ── Feature Card ──────────────────────────────────────────────────────────────
const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className="group relative p-6 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10, 20, 14, 0.6)",
        border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 10%, rgba(255,255,255,0.04))",
        backdropFilter: "blur(12px)",
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--theme-primary-raw) 6%, transparent) 0%, transparent 60%)",
        }}
      />

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: "color-mix(in srgb, var(--theme-primary-raw) 12%, transparent)",
          border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 22%, transparent)",
        }}
      >
        <div style={{ color: "var(--theme-primary-raw)" }}>{icon}</div>
      </div>

      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: "#6b8a7a" }}>
        {description}
      </p>
    </motion.div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({
  value,
  label,
  delay = 0,
}: {
  value: string;
  label: string;
  delay?: number;
}) => (
  <Reveal delay={delay} className="text-center">
    <div
      className="p-6 rounded-2xl"
      style={{
        background: "rgba(10, 20, 14, 0.6)",
        border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 10%, rgba(255,255,255,0.04))",
      }}
    >
      <p
        className="text-4xl font-bold mb-1"
        style={{ color: "var(--theme-primary-raw)" }}
      >
        {value}
      </p>
      <p className="text-sm" style={{ color: "#6b8a7a" }}>
        {label}
      </p>
    </div>
  </Reveal>
);

// ── AI Model Pill ─────────────────────────────────────────────────────────────
const ModelPill = ({ name, delay = 0 }: { name: string; delay?: number }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
    style={{
      background: "color-mix(in srgb, var(--theme-primary-raw) 8%, rgba(255,255,255,0.02))",
      border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 20%, transparent)",
      color: "var(--theme-primary-raw)",
    }}
  >
    <Bot className="w-3 h-3" />
    {name}
  </motion.span>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const AboutPage = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "#080e0a" }}>
      {/* ── Floating dots ───────────────────────────────────────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {DOTS.map((d, i) => (
          <Dot key={i} {...d} />
        ))}
      </div>

      {/* ── Global ambient ──────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% -5%, color-mix(in srgb, var(--theme-primary-raw) 8%, transparent) 0%, transparent 65%)",
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge>Our Story</Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
        >
          We believe{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, var(--theme-primary-raw), color-mix(in srgb, var(--theme-primary-raw) 50%, white))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI doesn&apos;t fail.
          </span>
          <br />
          Prompts do.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 text-lg max-w-2xl leading-relaxed"
          style={{ color: "#6b8a7a" }}
        >
          We built a platform that bridges the gap between your ideas and the AI outputs you
          actually need — turning vague thoughts into precision-engineered prompts that get
          results every time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-wrap gap-2 justify-center"
        >
          {["ChatGPT", "Claude", "Gemini", "Grok", "Llama", "Mistral"].map((m, i) => (
            <ModelPill key={m} name={m} delay={i * 0.05} />
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="50K+" label="Prompts generated" delay={0} />
          <StatCard value="12K+" label="Active users" delay={0.1} />
          <StatCard value="6" label="AI models supported" delay={0.2} />
          <StatCard value="3×" label="Faster results" delay={0.3} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          MISSION
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        {/* Divider line */}
        <div
          className="h-px w-full mb-16"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in srgb, var(--theme-primary-raw) 25%, transparent), transparent)",
          }}
        />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <Badge>Our Mission</Badge>
            <h2 className="mt-5 text-4xl font-bold text-white leading-tight">
              Democratising the art of{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--theme-primary-raw), color-mix(in srgb, var(--theme-primary-raw) 50%, white))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                prompt engineering
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "#6b8a7a" }}>
              Prompt engineering is the hidden skill that separates people who get amazing AI
              results from those who don&apos;t. We believe that skill shouldn&apos;t be a
              gatekeeping barrier — it should be a tool available to everyone.
            </p>
            <p className="mt-3 text-base leading-relaxed" style={{ color: "#6b8a7a" }}>
              Our platform analyses your intent, understands your context, and automatically
              crafts prompts that are precision-tuned for whichever AI model you&apos;re using.
              No PhD required.
            </p>
          </Reveal>

          {/* Visual card */}
          <Reveal delay={0.15}>
            <div
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{
                background: "rgba(10, 20, 14, 0.7)",
                border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 12%, rgba(255,255,255,0.04))",
              }}
            >
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--theme-primary-raw) 8%, transparent) 0%, transparent 70%)",
                  filter: "blur(30px)",
                }}
              />
              {[
                { icon: <Target className="w-4 h-4" />, label: "Analyzes your goal" },
                { icon: <Lightbulb className="w-4 h-4" />, label: "Understands context" },
                { icon: <Sparkles className="w-4 h-4" />, label: "Crafts the perfect prompt" },
                { icon: <Bot className="w-4 h-4" />, label: "Optimizes for your AI model" },
                { icon: <Zap className="w-4 h-4" />, label: "Delivers results instantly" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 py-3"
                  style={{
                    borderBottom:
                      i < 4
                        ? "1px solid color-mix(in srgb, var(--theme-primary-raw) 6%, rgba(255,255,255,0.04))"
                        : undefined,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "color-mix(in srgb, var(--theme-primary-raw) 10%, transparent)",
                      color: "var(--theme-primary-raw)",
                    }}
                  >
                    {step.icon}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#a8c4b4" }}>
                    {step.label}
                  </span>
                  <span
                    className="ml-auto text-xs font-semibold"
                    style={{ color: "var(--theme-primary-raw)" }}
                  >
                    0{i + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <Reveal className="text-center mb-12">
          <Badge>What We&apos;ve Built</Badge>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold text-white leading-tight">
            Every feature you need to{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--theme-primary-raw), color-mix(in srgb, var(--theme-primary-raw) 50%, white))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              master AI
            </span>
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "#6b8a7a" }}>
            Built by people who were frustrated with bad AI results, for everyone who deserves
            better ones.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            delay={0}
            icon={<FolderOpen className="w-5 h-5" />}
            title="Project Management"
            description="Organise your work into projects. Add context, background info, and goals that persist across every prompt you generate — no repeating yourself."
          />
          <FeatureCard
            delay={0.07}
            icon={<Save className="w-5 h-5" />}
            title="Save & Reuse Prompts"
            description="Found a prompt that works perfectly? Save it with one click. Build your own library of high-performance prompts and reuse them anytime."
          />
          <FeatureCard
            delay={0.14}
            icon={<SlidersHorizontal className="w-5 h-5" />}
            title="Custom Constraints"
            description="Define constraints like tone, length, format, and audience. Our engine bakes these into every prompt automatically so outputs are always on-brand."
          />
          <FeatureCard
            delay={0.21}
            icon={<Bot className="w-5 h-5" />}
            title="Model-Specific Prompts"
            description="ChatGPT, Claude, Gemini, Grok — each model thinks differently. We tailor prompts for each model's unique strengths, quirks, and capabilities."
          />
          <FeatureCard
            delay={0.28}
            icon={<BarChart3 className="w-5 h-5" />}
            title="Prompt Analytics"
            description="Track which prompts perform best. See patterns across your work, identify what drives quality output, and continuously improve your approach."
          />
          <FeatureCard
            delay={0.35}
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Secure & Private"
            description="Your ideas and projects are yours. End-to-end encryption and strict data privacy means your intellectual property never leaves your control."
          />
          <FeatureCard
            delay={0.42}
            icon={<Globe className="w-5 h-5" />}
            title="Multi-Language Support"
            description="Generate prompts and receive outputs in your preferred language. Our engine understands nuance across 30+ languages."
          />
          <FeatureCard
            delay={0.49}
            icon={<Users className="w-5 h-5" />}
            title="Team Collaboration"
            description="Share projects, prompt libraries, and constraints with your team. Everyone stays aligned with a single source of truth for your AI strategy."
          />
          <FeatureCard
            delay={0.56}
            icon={<Sparkles className="w-5 h-5" />}
            title="One-Click Refinement"
            description="Not happy with a result? Tell us why and we'll refine the prompt instantly. Iterative improvement without starting from scratch."
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TEAM VALUES
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div
          className="h-px w-full mb-16"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in srgb, var(--theme-primary-raw) 25%, transparent), transparent)",
          }}
        />

        <Reveal className="text-center mb-12">
          <Badge>What Drives Us</Badge>
          <h2 className="mt-5 text-4xl font-bold text-white">Our core values</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Radical Simplicity",
              description:
                "Complex technology should feel simple. If you need a manual to use it, we haven't done our job.",
              delay: 0,
            },
            {
              title: "Results First",
              description:
                "We don't celebrate features — we celebrate outcomes. Every decision is measured by whether it helps you get better AI results.",
              delay: 0.1,
            },
            {
              title: "Continuous Improvement",
              description:
                "AI models evolve daily. Our platform evolves with them, constantly updating to leverage the latest capabilities.",
              delay: 0.2,
            },
          ].map((val) => (
            <Reveal key={val.title} delay={val.delay}>
              <div
                className="p-6 rounded-2xl h-full"
                style={{
                  background: "rgba(10, 20, 14, 0.5)",
                  border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 8%, rgba(255,255,255,0.04))",
                }}
              >
                <div
                  className="w-1 h-8 rounded-full mb-4"
                  style={{ background: "var(--theme-primary-raw)" }}
                />
                <h3 className="text-white font-semibold text-lg mb-2">{val.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b8a7a" }}>
                  {val.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <Reveal>
          <div
            className="p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: "rgba(10, 20, 14, 0.8)",
              border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 16%, transparent)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--theme-primary-raw) 8%, transparent) 0%, transparent 70%)",
              }}
            />
            {/* Top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in srgb, var(--theme-primary-raw) 60%, transparent), transparent)",
              }}
            />

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
              Ready to get results that actually matter?
            </h2>
            <p className="text-base mb-8 relative z-10" style={{ color: "#6b8a7a" }}>
              Join thousands of creators, developers, and teams who stopped settling for mediocre
              AI outputs.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, var(--theme-primary-raw) 0%, color-mix(in srgb, var(--theme-primary-raw) 50%, white) 100%)",
                  color: "#011a0d",
                  boxShadow: "0 0 28px color-mix(in srgb, var(--theme-primary-raw) 28%, transparent)",
                }}
              >
                Start Free Today
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 16%, rgba(255,255,255,0.06))",
                  color: "#a8c4b4",
                }}
              >
                Talk to Us
              </Link>
            </div>

            <p className="text-xs mt-5 relative z-10" style={{ color: "#3d5a4a" }}>
              No credit card required · Cancel anytime · Free plan available
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default AboutPage;