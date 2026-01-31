import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AIModel {
  name: string
  icon: string
  color: string
}

const models: AIModel[] = [
  { name: 'ChatGPT', icon: '◉', color: 'from-emerald-400 to-teal-500' },
  { name: 'Claude', icon: '◈', color: 'from-orange-400 to-amber-500' },
  { name: 'Gemini', icon: '◇', color: 'from-blue-400 to-indigo-500' },
  { name: 'Llama', icon: '◆', color: 'from-purple-400 to-pink-500' },
]

export function AIModelCard() {
  const [selectedModel, setSelectedModel] = useState<string | null>('ChatGPT')
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)

  return (
    <div className="glass-card p-6 relative z-10">
      <div className="grid grid-cols-2 gap-3">
        {models.map(model => {
          const isSelected = selectedModel === model.name
          const isHovered = hoveredModel === model.name

          return (
            <button
              key={model.name}
              onClick={() => setSelectedModel(model.name)}
              onMouseEnter={() => setHoveredModel(model.name)}
              onMouseLeave={() => setHoveredModel(null)}
              className={cn(
                'relative flex items-center gap-3 p-4 rounded-xl transition-all duration-300',
                'border border-white/10 bg-[#0F0F0F]/70',
                'hover:scale-[1.02] hover:border-[#00FF88]/40',
                isSelected && 'border-[#00FF88] bg-[#00FF88]/10 neon-glow'
              )}
            >
              {/* Glow */}
              {(isSelected || isHovered) && (
                <div className="absolute inset-0 rounded-xl bg-[#00FF88]/5 animate-pulse" />
              )}

              {/* Icon */}
              <div
                className={cn(
                  'relative w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold',
                  'bg-gradient-to-br',
                  model.color,
                  'transition-transform duration-300',
                  (isSelected || isHovered) && 'scale-110'
                )}
              >
                {model.icon}
              </div>

              {/* Name */}
              <span
                className={cn(
                  'relative font-medium transition-colors duration-300',
                  isSelected ? 'text-[#00FF88]' : 'text-white/80'
                )}
              >
                {model.name}
              </span>

              {/* Selected dot */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
              )}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-sm text-white/60">
          Selected:{' '}
          <span className="text-[#00FF88] font-medium">
            {selectedModel || 'None'}
          </span>
        </p>
      </div>
    </div>
  )
}
