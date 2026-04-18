import { X } from "lucide-react"

export const ProjectModal = ({ editingProject, setShowProjectModal, setEditingProject, projectFormik, isCreatingProject, isUpdatingProject }: any) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#111] border border-[#222] rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-white text-sm font-semibold">
                    {editingProject ? "Edit Project" : "Add Project"}
                </h3>
                <button
                    onClick={() => {
                        setShowProjectModal(false)
                        setEditingProject(null)
                        projectFormik.resetForm()
                    }}
                >
                    <X className="h-4 w-4 text-[#929294] hover:text-white transition-colors" />
                </button>
            </div>

            <div className="flex flex-col gap-3">
                <div>
                    <label className="text-[#929294] text-xs mb-1 block">Project Name</label>
                    <input
                        className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm w-full p-2.5 rounded-lg focus:outline-none focus:border-[#00e57a]/50 transition-colors"
                        name="projectName"
                        value={projectFormik.values.projectName}
                        onChange={projectFormik.handleChange}
                        placeholder="Enter project name"
                    />
                </div>
                <div>
                    <label className="text-[#929294] text-xs mb-1 block">Description</label>
                    <textarea
                        className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm w-full p-2.5 rounded-lg focus:outline-none focus:border-[#00e57a]/50 transition-colors resize-none h-20"
                        name="projectDescription"
                        value={projectFormik.values.projectDescription}
                        onChange={projectFormik.handleChange}
                        placeholder="Enter project description"
                    />
                </div>
                <div>
                    <label className="text-[#929294] text-xs mb-1 block">
                        Technologies Used <span className="text-[#555]">(comma separated)</span>
                    </label>
                    <input
                        className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm w-full p-2.5 rounded-lg focus:outline-none focus:border-[#00e57a]/50 transition-colors"
                        name="technologiesUsed"
                        value={projectFormik.values.technologiesUsed}
                        onChange={projectFormik.handleChange}
                        placeholder="React, Node.js, MongoDB"
                    />
                </div>
                <button
                    onClick={() => projectFormik.handleSubmit()}
                    disabled={isCreatingProject || isUpdatingProject}
                    className="bg-[#00e57a] hover:bg-[#00cc6a] text-black text-sm font-semibold p-2.5 rounded-lg mt-1 disabled:opacity-50 transition-colors"
                >
                    {isCreatingProject || isUpdatingProject
                        ? "Saving..."
                        : editingProject
                            ? "Update Project"
                            : "Create Project"}
                </button>
            </div>
        </div>
    </div>
)