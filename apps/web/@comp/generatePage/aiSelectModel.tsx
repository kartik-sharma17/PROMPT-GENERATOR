import { Bot, X } from "lucide-react"
import { useState } from "react"

export const AiModelModal = ({aiModels,selectedModelId,setSelectedModelId,isOtherModel,setIsOtherModel,selectedModelName,setSelectedModelName,setShowModelModal}:any) => {
    // Local state so changes only commit when user hits Apply
    const [localSelectedId, setLocalSelectedId] = useState<string | null>(selectedModelId)
    const [localIsOther, setLocalIsOther] = useState(isOtherModel)
    const [localOtherInput, setLocalOtherInput] = useState(selectedModelName)

    const handleSelectModel = (id: string) => {
      if (localSelectedId === id) {
        setLocalSelectedId(null)
      } else {
        setLocalSelectedId(id)
        setLocalIsOther(false)
        setLocalOtherInput("")
      }
    }

    const handleSelectOther = () => {
      setLocalSelectedId(null)
      setLocalIsOther(true)
    }

    const handleApply = () => {
      if (localIsOther) {
        setSelectedModelId(null)
        setIsOtherModel(true)
        setSelectedModelName(localOtherInput)
      } else {
        setSelectedModelId(localSelectedId)
        setIsOtherModel(false)
        setSelectedModelName("")
      }
      setShowModelModal(false)
    }

    const handleClear = () => {
      setSelectedModelId(null)
      setIsOtherModel(false)
      setSelectedModelName("")
      setShowModelModal(false)
    }

    const hasSelection = localSelectedId || (localIsOther && localOtherInput.trim())

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#111] border border-[#222] rounded-xl w-full max-w-lg max-h-[70vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#1e1e1e]">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-[#00e57a]" />
              <h3 className="text-white text-sm font-semibold">Select AI Model</h3>
              {hasSelection && (
                <span className="bg-[#00e57a]/15 text-[#00e57a] text-[10px] font-medium px-2 py-0.5 rounded-full">
                  1 selected
                </span>
              )}
            </div>
            <button
              onClick={() => setShowModelModal(false)}
              className="text-[#929294] hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Model list */}
          <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-2">
            {aiModels.length === 0 && (
              <p className="text-[#555] text-xs text-center py-4">No AI models available.</p>
            )}

            {aiModels.map((m:any) => {
              const isSelected = localSelectedId === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelectModel(m.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${isSelected
                    ? "bg-[#0d2018] border-[#00e57a]/40"
                    : "bg-[#161616] border-[#1e1e1e] hover:border-[#2a2a2a]"
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${isSelected ? "text-[#00e57a]" : "text-white"}`}>
                        {m.name}
                      </p>
                      <p className="text-[#666] text-[11px] mt-0.5 leading-relaxed line-clamp-2">
                        {m.description}
                      </p>
                    </div>
                    <div className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-[#00e57a] border-[#00e57a]" : "border-[#333]"}`}>
                      {isSelected && (
                        <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}

            {/* Other option */}
            <button
              onClick={handleSelectOther}
              className={`w-full text-left p-3 rounded-lg border transition-all ${localIsOther
                ? "bg-[#0d2018] border-[#00e57a]/40"
                : "bg-[#161616] border-[#1e1e1e] hover:border-[#2a2a2a]"
                }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-medium ${localIsOther ? "text-[#00e57a]" : "text-white"}`}>
                    Other
                  </p>
                  <p className="text-[#666] text-[11px] mt-0.5">Enter a custom AI model name</p>
                  {localIsOther && (
                    <input
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      value={localOtherInput}
                      onChange={(e) => setLocalOtherInput(e.target.value)}
                      className="mt-2.5 w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#00e57a]/50 text-white text-xs p-2 rounded-lg outline-none transition-colors placeholder:text-[#444]"
                      placeholder="e.g. GPT-4o, Gemini Pro, Mistral…"
                    />
                  )}
                </div>
                <div className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${localIsOther ? "bg-[#00e57a] border-[#00e57a]" : "border-[#333]"}`}>
                  {localIsOther && (
                    <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#1e1e1e] flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 text-[#929294] hover:text-white text-xs p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-[#00e57a] hover:bg-[#00cc6a] text-black text-xs font-semibold p-2 rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    )
  }