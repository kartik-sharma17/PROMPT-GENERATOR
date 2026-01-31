import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const promptLines = [
  'You are an expert content strategist with 10+ years',
  'of experience in digital marketing. Your task is to',
  'create a comprehensive blog post that engages readers',
  'while optimizing for SEO. Focus on actionable insights',
  'and include relevant examples from industry leaders.',
]

export function PromptOutput() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [visibleLines, setVisibleLines] = useState<number[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)

  const handleGenerate = () => {
    if (isGenerating) return

    setIsGenerating(true)
    setVisibleLines([])
    setHasGenerated(false)

    promptLines.forEach((_, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, index])

        if (index === promptLines.length - 1) {
          setTimeout(() => {
            setIsGenerating(false)
            setHasGenerated(true)
          }, 300)
        }
      }, (index + 1) * 400)
    })
  }

  // Auto-trigger for demo
  useEffect(() => {
    const timer = setTimeout(handleGenerate, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="glass-card p-6 relative z-10">
      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={cn(
          'w-full mb-4 px-6 py-3 rounded-xl font-semibold text-sm',
          'bg-[#00FF88] text-black',
          'transition-all duration-300 flex items-center justify-center gap-2',
          isGenerating
            ? 'opacity-70 cursor-not-allowed'
            : 'hover:scale-[1.02] animate-pulse-glow'
        )}
      >
        {isGenerating ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Generate Prompt
          </>
        )}
      </button>

      {/* Output */}
      <div className="relative rounded-xl bg-[#0F0F0F]/80 border border-white/10 p-4 min-h-[140px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
          <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
          <span className="text-xs text-white/60 font-mono">
            optimized_prompt.txt
          </span>

          {hasGenerated && (
            <span className="ml-auto text-xs text-[#00FF88] flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Ready
            </span>
          )}
        </div>

        {/* Prompt text */}
        <div className="space-y-1 font-mono text-xs">
          {promptLines.map((line, index) => (
            <p
              key={index}
              className={cn(
                'text-white/80 transition-all duration-500',
                visibleLines.includes(index)
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-4'
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Shimmer */}
        {isGenerating && (
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF88]/10 to-transparent animate-shimmer"
              style={{ backgroundSize: '200% 100%' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
