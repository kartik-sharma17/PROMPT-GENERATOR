"use client"

import { TypingIndicator } from "@/@core/typeIndicator"
import { useChatMutation } from "@/reduxConfig/service/chatService"
import { useDeleteHistoryMutation, useGetHistoryQuery, useGetMessagesMutation } from "@/reduxConfig/service/historyService"
import { useCreateProjectMutation, useDeleteProjectMutation, useGetProjectQuery, useUpdateProjectMutation } from "@/reduxConfig/service/projectService"
import { useGetConstraintsQuery,Constraint } from "@/reduxConfig/service/constraintsService"

import { useFormik } from "formik"
import {
  ChevronRight, CircleCheck, CirclePlus, History, MessageSquareMore,
  MessageSquareShare, Mic, Palette, Pencil, Search, Send, Settings,
  Trash2, User, X, Zap, Shield, Bot, MoreHorizontal
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = {
  role: "user" | "assistant"
  text: string
  timeStamp: string
}

type HistoryItem = {
  historyId: string
  title: string
  updatedAt: string
  projectId?: string | null
  constraints?: string[] | null
}

type ProjectData = {
  projectId: string
  projectName: string
  projectDescription: string
  technologiesUsed: string[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const initialValues = { text: "" }

const projectInitialValues = {
  projectName: "",
  projectDescription: "",
  technologiesUsed: "",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (rawDate: string) => {
  const date = new Date(rawDate)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const formatHistoryDate = (rawDate: string) => {
  const date = new Date(rawDate)
  return date.toLocaleDateString([], { month: "short", day: "numeric" })
}

// ─── Component ────────────────────────────────────────────────────────────────

const Page = () => {
  const [chatScreen, setChatScreen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null)
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null)
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // Project state
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null)

  // Constraint modal
  const [showConstraintsModal, setShowConstraintsModal] = useState(false)

  // History "show all" modal
  const [showAllHistoryModal, setShowAllHistoryModal] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── API hooks ──
  const [chatApi, { isLoading }] = useChatMutation()
  const { data: projectsData, refetch: refetchProjects } = useGetProjectQuery({})
  const [createProject, { isLoading: isCreatingProject }] = useCreateProjectMutation()
  const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation()
  const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation()
  const { data: historyData, refetch: refetchHistory } = useGetHistoryQuery({})
  const [deleteHistory] = useDeleteHistoryMutation()
  const [getMessages, { isLoading: isLoadingMessages }] = useGetMessagesMutation()
  const { data: constraintsData } = useGetConstraintsQuery()

  const projects: ProjectData[] = projectsData?.data || []
  const histories: HistoryItem[] = historyData?.data || []
  const constraints: Constraint[] = constraintsData?.data || []

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // ── Formiks ──

  const formik = useFormik({
    initialValues,
    onSubmit: () => { },
  })

  const projectFormik = useFormik({
    initialValues: projectInitialValues,
    onSubmit: async (values) => {
      const technologiesUsed = values.technologiesUsed
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      if (editingProject) {
        const payload = {
          projectId: editingProject.projectId,
          projectName: values.projectName,
          projectDescription: values.projectDescription,
          technologiesUsed,
        }
        try {
          await updateProject(payload).unwrap()
          refetchProjects()
          setShowProjectModal(false)
          setEditingProject(null)
          projectFormik.resetForm()
        } catch (err) {
          console.log("Error updating project", err)
        }
      } else {
        const payload = {
          projectName: values.projectName,
          projectDescription: values.projectDescription,
          technologiesUsed,
        }
        try {
          await createProject(payload).unwrap()
          refetchProjects()
          setShowProjectModal(false)
          projectFormik.resetForm()
        } catch (err) {
          console.log("Error creating project", err)
        }
      }
    },
  })

  // ── Handlers ──

  const handleSubmit = async () => {
    const text = formik.values.text.trim()
    if (!text) return

    const userMessage: Message = {
      text,
      role: "user",
      timeStamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    formik.resetForm()

    const payload: {
      content: string
      role: string
      historyId?: string
      projectId?: string
      constraints?: string[]
    } = { content: text, role: "user" }

    if (currentHistoryId) payload.historyId = currentHistoryId
    if (selectedProjectId) payload.projectId = selectedProjectId
    if (selectedConstraints.length > 0) payload.constraints = selectedConstraints

    try {
      const response = await chatApi(payload).unwrap()
      const reply = response?.data?.reply || "Something went wrong, please try again"
      const returnedHistoryId = response?.data?.historyId

      if (!currentHistoryId && returnedHistoryId) {
        setCurrentHistoryId(returnedHistoryId)
        setActiveHistoryId(returnedHistoryId)
        refetchHistory()
      }

      const assistantMessage: Message = {
        text: reply,
        role: "assistant",
        timeStamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (exception) {
      console.log("Something went wrong while calling the API", exception)
    }
  }

  const handleStartChat = () => {
    if (!chatScreen) setChatScreen(true)
    handleSubmit()
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentHistoryId(null)
    setActiveHistoryId(null)
    setSelectedProjectId(null)
    setSelectedConstraints([])
    setChatScreen(false)
  }

  /** Load messages for a history item — also restores project + constraints */
  const handleHistoryClick = async (historyId: string) => {
    try {
      const response = await getMessages({ historyId }).unwrap()
      const fetchedMessages: Message[] = (response?.data || [])
        .slice()
        .reverse()
        .map((msg: any) => ({
          text: msg.content,
          role: msg.role as "user" | "assistant",
          timeStamp: msg.created_at,
        }))

      setMessages(fetchedMessages)
      setCurrentHistoryId(historyId)
      setActiveHistoryId(historyId)
      setChatScreen(true)

      // ── Task 2: Restore project + constraints from history ──
      const historyItem = histories.find((h) => h.historyId === historyId)
      if (historyItem) {
        setSelectedProjectId(historyItem.projectId ?? null)
        setSelectedConstraints(historyItem.constraints ?? [])
      }
    } catch (err) {
      console.log("Error fetching messages", err)
    }
  }

  const handleDeleteHistory = async (e: React.MouseEvent, historyId: string) => {
    e.stopPropagation()
    try {
      await deleteHistory(historyId).unwrap()
      refetchHistory()
      if (activeHistoryId === historyId) handleNewChat()
    } catch (err) {
      console.log("Error deleting history", err)
    }
  }

  // ── Task 1: Toggle constraint by ID ──
  const handleConstraintToggle = (id: string) => {
    setSelectedConstraints((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleAddProjectClick = () => {
    setEditingProject(null)
    projectFormik.resetForm()
    setShowProjectModal(true)
  }

  const handleEditProjectClick = (project: ProjectData) => {
    setEditingProject(project)
    projectFormik.setValues({
      projectName: project.projectName,
      projectDescription: project.projectDescription,
      technologiesUsed: project.technologiesUsed.join(", "),
    })
    setShowProjectModal(true)
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId).unwrap()
      refetchProjects()
    } catch (err) {
      console.log("Error deleting project", err)
    }
  }

  // ── Derived ──
  const CONSTRAINTS_PREVIEW_COUNT = 2
  const visibleConstraints = constraints.slice(0, CONSTRAINTS_PREVIEW_COUNT)
  const hasMoreConstraints = constraints.length > CONSTRAINTS_PREVIEW_COUNT

  // ── Shared sub-components ──

  const HistoryList = () => (
    <div className="p-3 overflow-y-auto flex-1">
      <p className="text-sm text-[#929294] flex gap-2 items-center mb-2">
        <History className="w-4 h-4 text-[#929294]" /> History
      </p>

      {histories.length === 0 && (
        <p className="text-[#555] text-xs mt-3">No history yet.</p>
      )}

      {histories.map((item) => (
        <div
          key={item.historyId}
          onClick={() => handleHistoryClick(item.historyId)}
          className={`group flex items-center justify-between gap-2 my-1 p-2 rounded-lg cursor-pointer transition-colors ${activeHistoryId === item.historyId ? "bg-[#1a2e1a] border border-[#00e57a]/20" : "hover:bg-[#1e1e1e]"}`}
        >
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs truncate">{item.title}</p>
            <p className="text-[#555] text-[10px] mt-0.5">{formatHistoryDate(item.updatedAt)}</p>
          </div>
          <button
            onClick={(e) => handleDeleteHistory(e, item.historyId)}
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-[#282727] h-6 w-6 flex items-center justify-center rounded"
          >
            <Trash2 className="h-3 w-3 text-red-400" />
          </button>
        </div>
      ))}
    </div>
  )

  // ── Project Modal ──
  const ProjectModal = () => (
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

  // ── Task 1: Constraints Full Modal ──
  const ConstraintsModal = () => (
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
          {constraints.map((c) => {
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

  // ─── Constraint bar above input ───────────────────────────────────────────
  const ConstraintsBar = () => (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] border-b-0 gap-1.5 mx-auto flex flex-wrap w-7/10 rounded-t-xl p-2 items-center">
      <Shield className="h-3 w-3 text-[#00e57a] shrink-0" />
      <span className="text-[#555] text-[10px] mr-1">Constraints:</span>

      {constraints.length === 0 && (
        <span className="text-[#444] text-[10px] italic">None available</span>
      )}

      {visibleConstraints.map((c) => {
        const isSelected = selectedConstraints.includes(c.id)
        return (
          <button
            key={c.id}
            onClick={() => handleConstraintToggle(c.id)}
            className={`flex gap-1.5 items-center px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all ${isSelected
              ? "bg-[#00e57a]/10 border-[#00e57a]/40 text-[#00e57a]"
              : "bg-[#1a1a1a] border-[#2a2a2a] text-[#929294] hover:border-[#444] hover:text-white"
              }`}
          >
            {isSelected && <CircleCheck className="h-3 w-3" />}
            {c.name}
          </button>
        )
      })}

      {hasMoreConstraints && (
        <button
          onClick={() => setShowConstraintsModal(true)}
          className="flex gap-1 items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-[#929294] hover:border-[#00e57a]/40 hover:text-[#00e57a] transition-all"
        >
          <MoreHorizontal className="h-3 w-3" />
          {constraints.length - CONSTRAINTS_PREVIEW_COUNT} more
        </button>
      )}

      {selectedConstraints.length > 0 && (
        <span className="ml-auto text-[10px] text-[#00e57a] font-medium">
          {selectedConstraints.length} active
        </span>
      )}
    </div>
  )

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAT SCREEN
  // ─────────────────────────────────────────────────────────────────────────────

  if (chatScreen) {
    const activeProject = projects.find((p) => p.projectId === selectedProjectId)

    return (
      <div className="bg-[#0a0a0a] h-screen grid grid-cols-12">
        {/* Left Panel */}
        <div className="col-span-2 border-[#1a1a1a] border-r h-full flex flex-col bg-[#0d0d0d]">
          <div className="h-14 border-b border-[#1a1a1a] flex items-center px-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#00e57a]/15 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-[#00e57a]" />
              </div>
              <span className="text-white text-xs font-semibold">PromptGen</span>
            </div>
          </div>

          <div className="p-3 border-b border-[#1a1a1a]">
            <button
              onClick={handleNewChat}
              className="w-full flex gap-2 items-center justify-center text-xs font-medium text-black bg-[#00e57a] hover:bg-[#00cc6a] transition-colors p-2 rounded-lg"
            >
              <MessageSquareShare className="w-3.5 h-3.5" /> New Chat
            </button>
          </div>

          <div className="p-3 border-b border-[#1a1a1a]">
            {[
              { icon: Search, label: "Search" },
              { icon: User, label: "My Profile" },
              { icon: Settings, label: "Settings" },
              { icon: Palette, label: "Theme" },
            ].map(({ icon: Icon, label }) => (
              <button key={label} className="text-[#929294] hover:text-white text-xs my-2 flex gap-2 items-center w-full transition-colors">
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          <HistoryList />
        </div>

        {/* Center — Chat */}
        <div className="col-span-8 h-full flex flex-col bg-[#0a0a0a]">
          {/* Chat Header */}
          <div className="border-b border-[#1a1a1a] h-14 flex items-center justify-between px-6 bg-[#0d0d0d]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00e57a]/30 to-[#00e57a]/10 border border-[#00e57a]/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-[#00e57a]" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">AI Prompt Assistant</p>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00e57a] animate-pulse" />
                  <p className="text-[#00e57a] text-[10px]">Online</p>
                </div>
              </div>
            </div>

            {activeProject && (
              <div className="flex items-center gap-2 bg-[#0d2018] border border-[#00e57a]/20 rounded-lg px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-[#00e57a]" />
                <span className="text-[#00e57a] text-[11px] font-medium truncate max-w-[120px]">
                  {activeProject.projectName}
                </span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex flex-col p-6 flex-1 overflow-y-auto gap-4">
            {isLoadingMessages ? (
              <div className="flex justify-center mt-10">
                <div className="flex items-center gap-2 text-[#929294] text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00e57a] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00e57a] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00e57a] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "assistant" ? "self-start" : "self-end flex-row-reverse"} max-w-[72%]`}
                >
                  {/* Avatar */}
                  {message.role === "assistant" ? (
                    <div className="shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-[#00e57a]/30 to-[#00e57a]/10 border border-[#00e57a]/20 flex items-center justify-center mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-[#00e57a]" />
                    </div>
                  ) : (
                    <div className="shrink-0 h-7 w-7 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center mt-0.5">
                      <User className="h-3.5 w-3.5 text-[#929294]" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${message.role === "assistant"
                        ? "bg-[#141414] border border-[#1e1e1e] text-[#e8e8e8] rounded-tl-sm"
                        : "bg-[#00e57a]/10 border border-[#00e57a]/20 text-white rounded-tr-sm"
                        }`}
                    >
                      {message.text}
                    </div>
                    <span className={`text-[10px] text-[#444] ${message.role === "user" ? "text-right" : "text-left"}`}>
                      {formatTime(message.timeStamp)}
                    </span>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3 self-start max-w-[72%]">
                <div className="shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-[#00e57a]/30 to-[#00e57a]/10 border border-[#00e57a]/20 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-[#00e57a]" />
                </div>
                <div className="bg-[#141414] border border-[#1e1e1e] px-4 py-3 rounded-2xl rounded-tl-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-6 pb-4 pt-2">
            {/* ── Task 1: Constraints bar ── */}
            <ConstraintsBar />

            <div className="bg-[#111] border border-[#1e1e1e] mx-auto w-7/10 rounded-b-xl rounded-t-none flex flex-col px-3 py-2.5 gap-2">
              <textarea
                className="w-full resize-none text-white text-sm focus:outline-none bg-transparent placeholder:text-[#444] min-h-[40px] max-h-[120px]"
                onChange={formik.handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                name="text"
                value={formik.values.text}
                placeholder="Type a message..."
                rows={1}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors">
                    <CirclePlus className="h-3.5 w-3.5 text-[#666]" />
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors">
                    <Mic className="h-3.5 w-3.5 text-[#666]" />
                  </button>
                  {selectedConstraints.length > 0 && (
                    <span className="text-[10px] text-[#00e57a] bg-[#00e57a]/10 border border-[#00e57a]/20 px-2 py-0.5 rounded-full">
                      {selectedConstraints.length} constraint{selectedConstraints.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !formik.values.text.trim()}
                  className="h-8 px-4 flex items-center gap-1.5 rounded-lg bg-[#00e57a] hover:bg-[#00cc6a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-black text-xs font-semibold"
                >
                  <Send className="h-3 w-3" />
                  Send
                </button>
              </div>
            </div>

            <p className="text-[#333] text-[10px] text-center mt-2">
              AI prompt generator can make mistakes. Check important info.
            </p>
          </div>
        </div>

        {/* Right Panel — Projects */}
        <div className="col-span-2 border-[#1a1a1a] border-l h-full flex flex-col bg-[#0d0d0d]">
          <div className="border-[#1a1a1a] border-b h-14 flex items-center px-3">
            <p className="text-[#929294] text-xs font-medium">Projects</p>
          </div>
          <div className="p-2">
            <button
              onClick={handleAddProjectClick}
              className="bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] hover:border-[#00e57a]/30 w-full flex gap-2 items-center justify-center text-white p-2 rounded-lg text-xs transition-all"
            >
              <CirclePlus className="h-3.5 w-3.5 text-[#00e57a]" /> Add Project
            </button>
          </div>

          <div className="p-2 flex flex-col gap-2 overflow-y-auto flex-1">
            {projects.map((project) => {
              const isActive = selectedProjectId === project.projectId
              return (
                <div
                  key={project.projectId}
                  onClick={() => setSelectedProjectId(isActive ? null : project.projectId)}
                  className={`p-2.5 rounded-lg cursor-pointer border transition-all ${isActive
                    ? "bg-[#0d2018] border-[#00e57a]/30"
                    : "bg-[#141414] border-[#1e1e1e] hover:border-[#2a2a2a]"
                    }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className={`text-xs font-medium truncate ${isActive ? "text-[#00e57a]" : "text-white"}`}>
                      {project.projectName}
                    </p>
                    {isActive && (
                      <div className="shrink-0 h-3.5 w-3.5 rounded-full bg-[#00e57a] flex items-center justify-center">
                        <svg className="h-2 w-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-[#666] text-[10px] truncate leading-relaxed">{project.projectDescription}</p>
                  <div className="flex gap-1 mt-2 justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditProjectClick(project) }}
                      className="bg-[#1e1e1e] h-6 w-6 flex items-center justify-center rounded hover:bg-[#2a2a2a] transition-colors"
                    >
                      <Pencil className="h-2.5 w-2.5 text-[#929294]" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.projectId) }}
                      disabled={isDeletingProject}
                      className="bg-[#1e1e1e] h-6 w-6 flex items-center justify-center rounded hover:bg-[#2a2a2a] transition-colors"
                    >
                      <Trash2 className="h-2.5 w-2.5 text-red-400" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {showProjectModal && <ProjectModal />}
        {showConstraintsModal && <ConstraintsModal />}
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LANDING / HOME SCREEN
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="bg-[#0a0a0a] h-screen grid grid-cols-12"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,229,122,0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0,229,122,0.02) 0%, transparent 40%)`
      }}
    >
      {/* Left Panel — history preview on landing */}
      <div className="col-span-2 border-[#1a1a1a] border-r h-full flex flex-col bg-[#0d0d0d]">
        <div className="h-14 border-b border-[#1a1a1a] flex items-center px-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#00e57a]/15 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-[#00e57a]" />
            </div>
            <span className="text-white text-xs font-semibold">PromptGen</span>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="text-white text-xs flex my-3 gap-2 items-center hover:text-[#929294] transition-colors w-full text-left"
          >
            <MessageSquareShare className="w-3.5 h-3.5 text-white" /> New Chat
          </button>
        </div>

        <div className="p-3 overflow-y-auto flex-1">
          <p className="text-sm text-[#929294] flex gap-2 items-center mb-2">
            <History className="w-4 h-4 text-[#929294]" /> Recent
          </p>

          {histories.length === 0 && (
            <p className="text-[#555] text-xs mt-3">Start a conversation to see history here.</p>
          )}

          {histories.slice(0, 4).map((item) => (
            <div
              key={item.historyId}
              onClick={() => handleHistoryClick(item.historyId)}
              className="group flex items-center justify-between gap-2 my-1 p-2 rounded-lg cursor-pointer hover:bg-[#1e1e1e] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs truncate">{item.title}</p>
                <p className="text-[#555] text-[10px] mt-0.5">{formatHistoryDate(item.updatedAt)}</p>
              </div>
              <button
                onClick={(e) => handleDeleteHistory(e, item.historyId)}
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-[#282727] h-6 w-6 flex items-center justify-center rounded"
              >
                <Trash2 className="h-3 w-3 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Center — Landing */}
      <div className="col-span-8 h-full flex flex-col justify-center items-center">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="h-14 w-14 mx-auto mb-4 rounded-2xl bg-[#00e57a]/15 border border-[#00e57a]/20 flex items-center justify-center">
            <Zap className="h-7 w-7 text-[#00e57a]" />
          </div>
          <h2 className="text-white font-bold text-3xl mb-2 tracking-tight">Good To See You!</h2>
          <p className="text-[#929294] text-sm">I&apos;m available 24/7 — ask me anything about your prompts.</p>
        </div>

        {/* Input card */}
        <div className="w-full max-w-2xl px-4">
          <div className="rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden shadow-2xl">
            <textarea
              className="w-full p-4 pb-2 resize-none text-white text-sm focus:outline-none bg-transparent placeholder:text-[#444] min-h-[56px]"
              onChange={formik.handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleStartChat()
                }
              }}
              name="text"
              value={formik.values.text}
              placeholder="Ask me anything..."
              rows={2}
            />
            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <div className="flex items-center gap-1.5">
                <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors">
                  <CirclePlus className="h-3.5 w-3.5 text-[#666]" />
                </button>
                <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1a1a1a] hover:bg-[#222] transition-colors">
                  <Mic className="h-3.5 w-3.5 text-[#666]" />
                </button>
              </div>
              <button
                onClick={handleStartChat}
                disabled={isLoading || !formik.values.text.trim()}
                className="h-8 px-4 flex items-center gap-1.5 rounded-lg bg-[#00e57a] hover:bg-[#00cc6a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-black text-xs font-bold"
              >
                <Send className="h-3 w-3" />
                Start Chat
              </button>
            </div>
          </div>
        </div>

        {/* Recent history */}
        {histories.length > 0 && (
          <div className="w-full max-w-2xl px-4 mt-8">
            <p className="text-[#555] text-xs mb-3 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Recent conversations
            </p>
            <div className="flex flex-col gap-2">
              {histories.slice(0, 3).map((item) => (
                <button
                  key={item.historyId}
                  onClick={() => handleHistoryClick(item.historyId)}
                  className="bg-[#0d0d0d] hover:bg-[#111] border border-[#1a1a1a] hover:border-[#2a2a2a] transition-all flex items-center justify-between gap-3 text-left w-full p-3 rounded-xl group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquareMore className="h-3.5 w-3.5 text-[#444] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-white text-xs truncate block">{item.title}</span>
                      {(item.projectId || (item.constraints && item.constraints.length > 0)) && (
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.projectId && (
                            <span className="text-[#00e57a] text-[9px] bg-[#00e57a]/10 px-1.5 py-0.5 rounded-full">project</span>
                          )}
                          {item.constraints && item.constraints.length > 0 && (
                            <span className="text-[#929294] text-[9px] bg-[#1a1a1a] px-1.5 py-0.5 rounded-full">
                              {item.constraints.length} constraint{item.constraints.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#444] text-[10px]">{formatHistoryDate(item.updatedAt)}</span>
                    <ChevronRight className="h-3 w-3 text-[#444] group-hover:text-[#929294] transition-colors" />
                  </div>
                </button>
              ))}

              {histories.length > 3 && (
                <button
                  onClick={() => setShowAllHistoryModal(true)}
                  className="text-[#555] hover:text-[#929294] transition-colors text-xs flex items-center gap-1.5 mt-1 mx-auto"
                >
                  <History className="h-3.5 h-3.5" />
                  Show all {histories.length} conversations
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right spacer */}
      <div className="col-span-2 h-full" />

      {/* All History Modal */}
      {showAllHistoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl w-full max-w-lg max-h-[70vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-[#929294]" />
                <h3 className="text-white text-sm font-semibold">All Conversations</h3>
                <span className="text-[#555] text-xs">({histories.length})</span>
              </div>
              <button onClick={() => setShowAllHistoryModal(false)} className="text-[#929294] hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-1">
              {histories.map((item) => (
                <button
                  key={item.historyId}
                  onClick={() => { setShowAllHistoryModal(false); handleHistoryClick(item.historyId) }}
                  className="group flex items-center justify-between gap-3 w-full text-left p-3 rounded-lg hover:bg-[#111] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquareMore className="h-3.5 w-3.5 text-[#444] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white text-xs truncate">{item.title}</p>
                      <p className="text-[#444] text-[10px] mt-0.5">{formatHistoryDate(item.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        handleDeleteHistory(e, item.historyId)
                        if (histories.length <= 1) setShowAllHistoryModal(false)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#1e1e1e] h-6 w-6 flex items-center justify-center rounded"
                    >
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </button>
                    <ChevronRight className="h-3.5 w-3.5 text-[#444] group-hover:text-[#929294] transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page