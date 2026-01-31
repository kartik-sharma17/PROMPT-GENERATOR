import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const sampleTexts = [
  'Write a blog post about AI trends...',
  'Generate marketing copy for...',
  'Create a Python script that...',
  'Explain quantum computing to...',
]

const floatingTags = [
  { text: 'Marketing', delay: 0 },
  { text: 'Code', delay: 0.5 },
  { text: 'Creative', delay: 1 },
  { text: 'Analysis', delay: 1.5 },
  { text: 'Research', delay: 2 },
]

export function TypingInput() {
  const [currentText, setCurrentText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [visibleTags, setVisibleTags] = useState<number[]>([])

  useEffect(() => {
    const targetText = sampleTexts[textIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < targetText.length) {
          setCurrentText(targetText.slice(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (charIndex > 0) {
          setCurrentText(targetText.slice(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setTextIndex((textIndex + 1) % sampleTexts.length)
        }
      }
    }, isDeleting ? 30 : 80)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, textIndex])

  useEffect(() => {
    floatingTags.forEach((tag, index) => {
      setTimeout(() => {
        setVisibleTags(prev => [...prev, index])
      }, tag.delay * 1000 + 500)
    })
  }, [])

  return (
    <div className="glass-card p-6 relative z-10">
      {/* Floating tags */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
        {floatingTags.map((tag, index) => (
          <span
            key={tag.text}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/20',
              'transition-all duration-500',
              visibleTags.includes(index)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            )}
            style={{ transitionDelay: `${tag.delay * 100}ms` }}
          >
            {tag.text}
          </span>
        ))}
      </div>

      {/* Input simulation */}
      <div className="relative">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0F0F0F]/80 border border-white/10">
          {/* Icon */}
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>

          {/* Typed text */}
          <div className="flex-1 min-h-[48px]">
            <p className="text-white/90 font-mono text-sm leading-relaxed">
              {currentText}
              <span className="typing-cursor" />
            </p>
          </div>
        </div>

        {/* Glow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-[#00FF88]/20 blur-xl rounded-full" />
      </div>
    </div>
  )
}
