import { Shield, X } from "lucide-react"

export const ConstraintsModal = ({ constraints, selectedConstraints, setSelectedConstraints, setShowConstraintsModal, handleConstraintToggle }: any) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#111] border border-[#222] rounded-xl w-full max-w-lg max-h-[70vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#1e1e1e]">
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#00e57a]" />
                    <h3 className="text-white text-sm font-semibold">Prompt Constraints</h3>
                    {selectedConstraints.length > 0 && (
                        <span className="bg-[#00e57a]/15 text-[#00e57a] text-[10px] font-medium px-2 py-0.5 rounded-full">
                            {selectedConstraints.length} selected
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setShowConstraintsModal(false)}
                    className="text-[#929294] hover:text-white transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-2">
                {constraints.length === 0 && (
                    <p className="text-[#555] text-xs text-center py-8">No constraints available.</p>
                )}
                {constraints.map((c: any) => {
                    const isSelected = selectedConstraints.includes(c.id)
                    return (
                        <button
                            key={c.id}
                            onClick={() => handleConstraintToggle(c.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${isSelected
                                ? "bg-[#0d2018] border-[#00e57a]/40"
                                : "bg-[#161616] border-[#1e1e1e] hover:border-[#2a2a2a]"
                                }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className={`text-xs font-medium truncate ${isSelected ? "text-[#00e57a]" : "text-white"}`}>
                                        {c.name}
                                    </p>
                                    <p className="text-[#666] text-[11px] mt-0.5 leading-relaxed line-clamp-2">
                                        {c.description}
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
            </div>

            <div className="p-3 border-t border-[#1e1e1e] flex gap-2">
                <button
                    onClick={() => setSelectedConstraints([])}
                    className="flex-1 text-[#929294] hover:text-white text-xs p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                    Clear all
                </button>
                <button
                    onClick={() => setShowConstraintsModal(false)}
                    className="flex-1 bg-[#00e57a] hover:bg-[#00cc6a] text-black text-xs font-semibold p-2 rounded-lg transition-colors"
                >
                    Apply ({selectedConstraints.length})
                </button>
            </div>
        </div>
    </div>
)