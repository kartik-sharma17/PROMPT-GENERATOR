import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { AIModelCard } from './AIModelCard'
import { TypingInput } from './TypingInput'
import { PromptOutput } from './PromptOutput'
import { ArrowRight } from 'lucide-react'

interface Step {
  number: string
  title: string
  description: string
  component: React.ReactNode
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Select AI Model',
    description: "Pick the AI you're using — ChatGPT, Gemini, Claude, or others.",
    component: <AIModelCard />,
  },
  {
    number: '02',
    title: 'Describe Your Use Case',
    description: 'Explain what you want — content, code, marketing, or ideas.',
    component: <TypingInput />,
  },
  {
    number: '03',
    title: 'Generate Perfect Prompt',
    description: 'Get a high-quality, model-optimized prompt instantly.',
    component: <PromptOutput />,
  },
]

function StepCard({ step, index }: { step: Step; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 150)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      )}
    >
      {/* Step header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/10 border border-[#00FF88]/30 flex items-center justify-center">
            <span className="text-[#00FF88] font-bold text-lg font-mono">
              {step.number}
            </span>
          </div>

          {/* Glow */}
          <div className="absolute inset-0 bg-[#00FF88]/20 blur-xl rounded-full -z-10" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#F1F4F7] mb-1">
            {step.title}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 relative">
        {step.component}

        {index < steps.length - 1 && (
          <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 z-20">
            <div className="w-16 h-[2px] bg-gradient-to-r from-[#00FF88]/50 to-transparent" />
            <ArrowRight className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00FF88]/50" />
          </div>
        )}
      </div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="gradient-orb w-[600px] h-[600px] bg-[#00FF88]/20 -top-40 -left-40" />
        <div className="gradient-orb w-[500px] h-[500px] bg-[#00FF88]/10 top-1/2 right-0 translate-x-1/2" />
        <div className="gradient-orb w-[400px] h-[400px] bg-[#00FF88]/15 bottom-0 left-1/3" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(#00FF88 1px, transparent 1px),
              linear-gradient(90deg, #00FF88 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Orbiting particles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
          <div className="absolute w-2 h-2 bg-[#00FF88]/40 rounded-full animate-orbit" />
          <div
            className="absolute w-1.5 h-1.5 bg-[#00FF88]/30 rounded-full animate-orbit-reverse"
            style={{ animationDelay: '-5s' }}
          />
          <div
            className="absolute w-1 h-1 bg-[#00FF88]/50 rounded-full animate-orbit"
            style={{ animationDelay: '-10s' }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text-sm text-[#00FF88] font-medium">
              Simple 3-Step Process
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-[#F1F4F7]">How It </span>
            <span className="neon-text">Works</span>
          </h2>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Generate optimized prompts for any AI model in just a few steps.
            <br className="hidden md:block" />
            No expertise required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#00FF88] text-black font-semibold text-lg transition-all duration-300 hover:scale-105 animate-pulse-glow">
            <span>Try It Free</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />

            <div className="absolute inset-0 rounded-2xl bg-[#00FF88]/50 blur-xl -z-10 opacity-50 group-hover:opacity-80 transition-opacity" />
          </button>

          <p className="mt-4 text-sm text-white/60">
            No credit card required • Start generating in seconds
          </p>
        </div>
      </div>
    </section>
  )
}
