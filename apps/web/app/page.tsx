"use client"

import { CTASection, HeroSection, HowItWorks, Navbar, PricingSection } from "@/@comp"
import { Footer } from "@/@comp"
import { Rocket, ThumbsDown, Timer } from "lucide-react"
import { useRouter } from "next/navigation"


const page = () => {

  const route = useRouter()

  return (
    <div className="bg-(--sec-bg) text-white">
      <Navbar/>
      {/* hero section */}
      <HeroSection/>

      {/* demo video section */}
      {/* <div className="p-10 px-15 my-10">
        <div className="h-150 bg-[#63F7A8] rounded-(--custom-radius)">

        </div>
      </div> */}

      {/* ── Problem Section ── */}
      <section className="max-w-7xl mx-auto my-10 py-16 px-6">

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
            The Real Problem
          </span>
        </div>

        {/* headline */}
        <h2 className="text-center text-4xl md:text-5xl font-bold leading-tight mb-4">
          AI doesn&apos;t fail —{" "}
          <span className="gradient-text-animated">prompts do.</span>
        </h2>
        <p className="text-center text-gray-400 text-lg max-w-2xl mx-auto mb-14">
          AI models are incredibly powerful, but they rely entirely on how you
          communicate with them. Poor prompts = poor results. Every time.
        </p>

        {/* stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div
            className="glass-card glass-card-hover p-6 flex flex-col justify-between min-h-52 relative overflow-hidden"
          >
            {/* subtle green tint top-left */}
            <div
              className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
              style={{ background: "hsl(var(--glow) / 0.08)" }}
            />
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-400 leading-snug max-w-[65%]">
                of users get poor AI results due to bad prompts
              </p>
              <span
                className="flex items-center justify-center w-9 h-9 rounded-xl text-lg"
                style={{
                  background: "hsl(var(--glow) / 0.15)",
                  color: "hsl(var(--theme-primary))",
                  border: "1px solid hsl(var(--glow) / 0.25)",
                }}
              >
                <ThumbsDown className="w-4 h-4" />
              </span>
            </div>
            <span
              className="text-7xl font-bold mt-4 neon-glow"
              style={{ color: "hsl(var(--theme-primary))" }}
            >
              82%
            </span>
          </div>

          {/* Card 2 */}
          <div
            className="glass-card glass-card-hover p-6 flex flex-col justify-between min-h-52 relative overflow-hidden"
          >
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
              style={{ background: "hsl(var(--glow) / 0.08)" }}
            />
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-400 leading-snug max-w-[65%]">
                less time spent on revisions with optimized prompts
              </p>
              <span
                className="flex items-center justify-center w-9 h-9 rounded-xl text-lg"
                style={{
                  background: "hsl(var(--glow) / 0.15)",
                  color: "hsl(var(--theme-primary))",
                  border: "1px solid hsl(var(--glow) / 0.25)",
                }}
              >
                <Timer className="w-4 h-4"/>
              </span>
            </div>
            <span
              className="text-7xl font-bold mt-4 neon-glow"
              style={{ color: "hsl(var(--theme-primary))" }}
            >
              3×
            </span>
          </div>

          {/* Card 3 */}
          <div
            className="glass-card glass-card-hover p-6 flex flex-col justify-between min-h-52 relative overflow-hidden"
          >
            <div
              className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
              style={{ background: "hsl(var(--glow) / 0.08)" }}
            />
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-400 leading-snug max-w-[65%]">
                boost in output quality with well-crafted prompts
              </p>
              <span
                className="flex items-center justify-center w-9 h-9 rounded-xl text-lg"
                style={{
                  background: "hsl(var(--glow) / 0.15)",
                  color: "hsl(var(--theme-primary))",
                  border: "1px solid hsl(var(--glow) / 0.25)",
                }}
              >
                <Rocket className="w-4 h-4"/>
              </span>
            </div>
            <span
              className="text-7xl font-bold mt-4 neon-glow"
              style={{ color: "hsl(var(--theme-primary))" }}
            >
              70%
            </span>
          </div>

        </div>
      </section>

      {/* ── Solution Section ── */}
      <section className="max-w-7xl mx-auto my-10 py-16 px-6">
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">

          {/* Left — copy */}
          <div className="flex flex-col gap-6">

            {/* badge */}
            <span
              className="breathing-glow self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
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
              The Solution
            </span>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              One Tool.{" "}
              <span className="gradient-text-animated">Perfect Prompts.</span>{" "}
              Every Time.
            </h2>

            <p className="text-gray-400 text-base leading-relaxed">
              Describe your idea once, and our AI-powered engine instantly turns
              it into optimized prompts for ChatGPT, Gemini, Claude, and more —
              no prompt engineering expertise required.
            </p>

            {/* feature bullets */}
            <ul className="flex flex-col gap-3">
              {[
                { icon: "✦", text: "Analyzes your intent and goals automatically" },
                { icon: "✦", text: "Tailors prompts for each AI model's strengths" },
                { icon: "✦", text: "Get high-quality results in seconds, not hours" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-sm text-gray-300">
                  <span
                    className="flex-shrink-0 text-xs"
                    style={{ color: "hsl(var(--theme-primary))" }}
                  >
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={()=>{route.push("/generate")}}
                className="shimmer neon-glow-box self-start px-8 py-3 rounded-xl font-semibold text-sm text-black cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95"
                style={{ background: "hsl(var(--theme-primary))" }}
              >
                Start for Free
              </button>
              <p className="text-gray-500 text-xs mt-3">
                No credit card required · Cancel anytime
              </p>
            </div>
          </div>

          {/* Right — visual card stack */}
          <div className="relative flex items-center justify-center">

            {/* glow blob */}
            <div
              className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none"
              style={{ background: "hsl(var(--glow) / 0.12)" }}
            />

            {/* main image card */}
            <div
              className="glass-card relative z-10 overflow-hidden rounded-2xl w-full"
              style={{ border: "1px solid hsl(var(--glow) / 0.2)" }}
            >
              <img
                src="/assets/img/girlpic.webp"
                className="w-full h-auto object-cover"
                alt="Person using Prompter"
              />

              {/* floating stat pill */}
              <div
                className="absolute bottom-4 left-4 right-4 glass-card flex items-center gap-3 px-4 py-3"
                style={{ borderColor: "hsl(var(--glow) / 0.3)" }}
              >
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "hsl(var(--theme-primary))" }}
                  >
                    Prompt Generated
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Optimized for ChatGPT · 0.3s
                  </p>
                </div>
                <span
                  className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "hsl(var(--glow) / 0.15)",
                    color: "hsl(var(--theme-primary))",
                  }}
                >
                  ✓ Ready
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works section */}
      <HowItWorks />

      {/* featues section */}
      {/* <FeaturesSection/> */}

      {/* pricing section */}
      <PricingSection/>

      {/* CTA Section */}
      <CTASection/>

      <Footer/>

    </div>
  )
}

export default page