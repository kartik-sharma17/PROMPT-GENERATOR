"use client"

import { TypingIndicator } from "@/@core/typeIndicator"
import { useChatMutation } from "@/reduxConfig/service/chatService"
import { useDeleteHistoryMutation, useGetHistoryQuery, useGetMessagesMutation } from "@/reduxConfig/service/historyService"
import { useCreateProjectMutation, useDeleteProjectMutation, useGetProjectQuery, useUpdateProjectMutation } from "@/reduxConfig/service/projectService"
import { useGetConstraintsQuery, Constraint } from "@/reduxConfig/service/constraintsService"
import { useGetAiModelsQuery, AiModel } from "@/reduxConfig/service/aiModelService"

import { useFormik } from "formik"
import {
  ChevronRight, CircleCheck, CirclePlus, History, MessageSquareMore,
  MessageSquareShare, Mic, Palette, Pencil, Search, Send, Settings,
  Trash2, User, X, Zap, Shield, Bot, MoreHorizontal,
  LogOut, Landmark, Copy, Check
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { logout } from "@/reduxConfig/slice/authSlice"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie";
import { AiModelModal, ConstraintsModal, ProjectModal } from "@/@comp/generatePage"
import { toast } from "sonner"

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
  modelId?: string | null
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

// ─── Prompt Parser ────────────────────────────────────────────────────────────

const parseMessage = (text: string): { before: string; prompt: string | null; after: string } => {
  const regex = /123321\s*([\s\S]*?)\s*123321/
  const match = text.match(regex)
  if (!match) return { before: text, prompt: null, after: "" }
  const idx = text.indexOf(match[0])
  return {
    before: text.slice(0, idx).trim(),
    prompt: match[1]?.trim() || null,
    after: text.slice(idx + match[0].length).trim(),
  }
}

// ─── PromptBlock ──────────────────────────────────────────────────────────────

const PromptBlock = ({ prompt }: { prompt: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const CopyBtn = () => (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-[10px] font-medium text-[#00e57a] hover:text-white transition-colors px-2.5 py-1 rounded-md bg-[#00e57a]/10 hover:bg-[#00e57a]/20 border border-[#00e57a]/25"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied!" : "Copy Prompt"}
    </button>
  )

  return (
    <div className="my-2 rounded-xl border border-[#00e57a]/30 bg-[#060e09] overflow-hidden shadow-lg shadow-[#00e57a]/5">
      {/* Top bar with label + copy */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#00e57a]/20 bg-[#0d2018]">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#00e57a] animate-pulse" />
          <span className="text-[#00e57a] text-[10px] font-semibold uppercase tracking-widest">Generated Prompt</span>
        </div>
        <CopyBtn />
      </div>

      {/* Prompt text */}
      <pre className="px-4 py-4 text-sm text-[#d4f5e2] whitespace-pre-wrap leading-relaxed font-mono">
        {prompt}
      </pre>

      {/* Bottom copy */}
      <div className="flex justify-end px-3 py-2 border-t border-[#00e57a]/20 bg-[#0d2018]">
        <CopyBtn />
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const Page = () => {
  const [chatScreen, setChatScreen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null)
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null)
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // ── AI Model state ──
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const [selectedModelName, setSelectedModelName] = useState("")
  const [isOtherModel, setIsOtherModel] = useState(false)
  const [showModelModal, setShowModelModal] = useState(false)

  const dispatch = useDispatch();
  const route = useRouter()

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
  const { data: aiModelsData } = useGetAiModelsQuery()

  const projects: ProjectData[] = projectsData?.data || []
  const histories: HistoryItem[] = historyData?.data || []
  const constraints: Constraint[] = constraintsData?.data || []
  const aiModels: AiModel[] = aiModelsData?.data || []

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
        } catch (err: any) {
          toast.error(err?.data?.detail?.message || "something went wrong, please try again")

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
        } catch (err: any) {
          toast.error(err?.data?.detail?.message || "something went wrong, please try again")
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
      modelId?: string
      modelName?: string
    } = { content: text, role: "user" }

    if (currentHistoryId) payload.historyId = currentHistoryId
    if (selectedProjectId) payload.projectId = selectedProjectId
    if (selectedConstraints.length > 0) payload.constraints = selectedConstraints
    // AI model — only one of modelId or modelName, not both
    if (selectedModelId) {
      payload.modelId = selectedModelId
    } else if (isOtherModel && selectedModelName.trim()) {
      payload.modelName = selectedModelName.trim()
    }

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
    } catch (exception: any) {
      toast.error(exception?.data?.detail?.message || "something went wrong, please try again")
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
    // Reset model
    setSelectedModelId(null)
    setSelectedModelName("")
    setIsOtherModel(false)
    setChatScreen(false)
  }

  const handleLogout = () => {
    localStorage.setItem("manualLogout", "true");
    dispatch(logout())
    Cookies.remove("token");
    route.push("/")
  }

  /** Load messages for a history item — also restores project + constraints + model */
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

      // Restore project + constraints + model from history
      const historyItem = histories.find((h) => h.historyId === historyId)
      if (historyItem) {
        setSelectedProjectId(historyItem.projectId ?? null)
        setSelectedConstraints(historyItem.constraints ?? [])
        // Task 2: auto-restore model
        if (historyItem.modelId) {
          setSelectedModelId(historyItem.modelId)
          setIsOtherModel(false)
          setSelectedModelName("")
        } else {
          setSelectedModelId(null)
          setIsOtherModel(false)
          setSelectedModelName("")
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.detail?.message || "something went wrong, please try again")
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

  // ── Constraint toggle ──
  const handleConstraintToggle = (id: string) => {
    setSelectedConstraints((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  // ── Model select (for the right-panel quick buttons) ──
  const handleModelSelect = (modelId: string) => {
    if (selectedModelId === modelId) {
      setSelectedModelId(null)
    } else {
      setSelectedModelId(modelId)
      setSelectedModelName("")
      setIsOtherModel(false)
    }
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
    } catch (err: any) {
      toast.error(err?.data?.detail?.message || "something went wrong, please try again")
    }
  }

  // ── Derived ──
  const CONSTRAINTS_PREVIEW_COUNT = 2
  const visibleConstraints = constraints.slice(0, CONSTRAINTS_PREVIEW_COUNT)
  const hasMoreConstraints = constraints.length > CONSTRAINTS_PREVIEW_COUNT

  const MODEL_PREVIEW_COUNT = 3
  const previewModels = aiModels.slice(0, MODEL_PREVIEW_COUNT)

  // The display name of whatever model is active
  const activeModelName = selectedModelId
    ? (aiModels.find((m) => m.id === selectedModelId)?.name ?? null)
    : isOtherModel && selectedModelName.trim()
      ? selectedModelName.trim()
      : null

  // Is the "show more" button in an active/highlighted state?
  // (either "Other" is selected, or a model beyond the first 3 is selected)
  const isMoreActive =
    isOtherModel ||
    (!!selectedModelId && !previewModels.some((m) => m.id === selectedModelId))

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


  // ── AI Model Modal ──


  // ── Constraints Bar (above chat input) ──
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

  // ── AI Model Section (right panel) ──
  const AiModelSection = () => (
    <div className="border-t border-[#1a1a1a] flex flex-col">
      {/* Section header */}
      <div className="h-10 flex items-center px-3 gap-2 border-b border-[#1a1a1a]">
        <Bot className="h-3.5 w-3.5 text-[#00e57a]" />
        <p className="text-[#929294] text-xs font-medium flex-1">AI Model</p>
        {activeModelName && (
          <div className="h-1.5 w-1.5 rounded-full bg-[#00e57a] animate-pulse shrink-0" />
        )}
      </div>

      {/* 2×2 grid: up to 3 model buttons + "Show More" always 4th */}
      <div className="p-2 grid grid-cols-2 gap-1.5">
        {previewModels.map((model) => {
          const isActive = selectedModelId === model.id
          return (
            <button
              key={model.id}
              onClick={() => handleModelSelect(model.id)}
              title={model.name}
              className={`aspect-square p-2 rounded-lg border transition-all flex flex-col items-center justify-center gap-1.5 ${isActive
                ? "bg-[#0d2018] border-[#00e57a]/40"
                : "bg-[#141414] border-[#1e1e1e] hover:border-[#2a2a2a]"
                }`}
            >
              {isActive ? (
                <div className="h-4 w-4 rounded-full bg-[#00e57a] flex items-center justify-center shrink-0">
                  <svg className="h-2.5 w-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <Bot className="h-3.5 w-3.5 text-[#555] shrink-0" />
              )}
              <span className={`text-[10px] font-medium w-full text-center truncate leading-tight px-1 ${isActive ? "text-[#00e57a]" : "text-[#929294]"}`}>
                {model.name}
              </span>
            </button>
          )
        })}

        {/* Empty placeholder slots so the "Show More" always lands in the 4th cell */}
        {Array.from({ length: Math.max(0, MODEL_PREVIEW_COUNT - previewModels.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-lg border border-[#141414] bg-[#0d0d0d]"
          />
        ))}

        {/* Show More — always 4th button */}
        <button
          onClick={() => setShowModelModal(true)}
          className={`aspect-square p-2 rounded-lg border transition-all flex flex-col items-center justify-center gap-1.5 ${isMoreActive
            ? "bg-[#0d2018] border-[#00e57a]/40"
            : "bg-[#141414] border-[#1e1e1e] hover:border-[#00e57a]/30"
            }`}
        >
          <MoreHorizontal className={`h-3.5 w-3.5 shrink-0 ${isMoreActive ? "text-[#00e57a]" : "text-[#555]"}`} />
          <span className={`text-[10px] font-medium text-center leading-tight ${isMoreActive ? "text-[#00e57a]" : "text-[#555]"}`}>
            {aiModels.length > MODEL_PREVIEW_COUNT
              ? `+${aiModels.length - MODEL_PREVIEW_COUNT} more`
              : "More"}
          </span>
        </button>
      </div>

      {/* Active model chip */}
      {activeModelName && (
        <div className="mx-2 mb-2 px-2.5 py-1.5 rounded-lg bg-[#0d2018] border border-[#00e57a]/20 flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#00e57a] shrink-0" />
          <span className="text-[#00e57a] text-[10px] truncate flex-1">{activeModelName}</span>
          <button
            onClick={() => {
              setSelectedModelId(null)
              setIsOtherModel(false)
              setSelectedModelName("")
            }}
            className="shrink-0 text-[#00e57a]/50 hover:text-[#00e57a] transition-colors"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
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
        <div className="col-span-2 border-[#1a1a1a] border-r max-h-screen flex flex-col bg-[#0d0d0d]">
          <div className="h-14 border-b border-[#1a1a1a] flex items-center px-3">
            <div className="flex items-center gap-2 w-full">
              <img className="h-auto w-30" src={`/clarixLogo.png`} />
            </div>
          </div>

          <div className="p-3 border-b border-[#1a1a1a]">
            <button
              onClick={handleNewChat}
              className="w-full flex gap-2 items-center justify-center text-xs bg-(--theme-primary-raw) font-medium text-black hover:bg-[#00cc6a] transition-colors p-2 rounded-lg"
            >
              <MessageSquareShare className="w-3.5 h-3.5" /> New Chat
            </button>
          </div>

          <div className="p-3 border-b border-[#1a1a1a]">
            <button
              onClick={handleLogout}
              className="text-white text-xs flex my-3 gap-2 items-center group hover:text-[#929294] transition-colors w-full text-left"
            >
              <LogOut className="w-3.5 h-3.5 text-white group-hover:text-[#929294] transition-colors" /> Logout
            </button>
            <button
              onClick={() => { route.push("/my-plan") }}
              className="text-white text-xs flex my-3 gap-2 items-center group hover:text-[#929294] transition-colors w-full text-left"
            >
              <Landmark className="w-3.5 h-3.5 text-white group-hover:text-[#929294] transition-colors" /> My plan
            </button>
          </div>

          <HistoryList />
        </div>

        {/* Center — Chat */}
        <div className="col-span-8 max-h-screen flex flex-col bg-[#0a0a0a]">
          {/* Chat Header */}
          <div className="border-b border-[#1a1a1a] h-14 flex items-center justify-between px-6 bg-[#0d0d0d]">
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
              messages.map((message, index) => {
                const parsed = message.role === "assistant" ? parseMessage(message.text) : null
                const hasPrompt = parsed?.prompt != null

                return (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === "assistant" ? "self-start" : "self-end flex-row-reverse"} ${hasPrompt ? "max-w-[85%] w-[85%]" : "max-w-[72%]"}`}
                  >
                    <div className="flex flex-col gap-1 w-full">
                      {message.role === "assistant" && parsed ? (
                        <div className="rounded-2xl rounded-tl-sm bg-[#141414] border border-[#1e1e1e] px-4 py-3 text-sm leading-relaxed text-[#e8e8e8]">
                          {parsed.before && (
                            <p className="whitespace-pre-wrap mb-2">{parsed.before}</p>
                          )}
                          {parsed.prompt && <PromptBlock prompt={parsed.prompt} />}
                          {parsed.after && (
                            <p className="whitespace-pre-wrap mt-2">{parsed.after}</p>
                          )}
                        </div>
                      ) : (
                        <pre
                          className="px-4 whitespace-pre-wrap py-3 rounded-2xl text-sm leading-relaxed bg-[#00e57a]/10 border border-[#00e57a]/20 text-white rounded-tr-sm"
                        >
                          {message.text}
                        </pre>
                      )}
                      <span className={`text-[10px] text-[#444] ${message.role === "user" ? "text-right" : "text-left"}`}>
                        {formatTime(message.timeStamp)}
                      </span>
                    </div>
                  </div>
                )
              })
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
                  {activeModelName && (
                    <span className="text-[10px] text-[#00e57a] bg-[#00e57a]/10 border border-[#00e57a]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Bot className="h-2.5 w-2.5" />
                      {activeModelName}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !formik.values.text.trim()}
                  className="h-8 px-4 flex items-center gap-1.5 rounded-lg bg-(--theme-primary-raw) hover:bg-[#00cc6a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-black text-xs font-semibold"
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

        {/* Right Panel — Projects + AI Model */}
        <div className="col-span-2 border-[#1a1a1a] border-l max-h-screen flex flex-col bg-[#0d0d0d] overflow-y-auto">
          {/* Projects header */}
          <div className="border-[#1a1a1a] border-b h-10 flex items-center px-3 sticky top-0 bg-[#0d0d0d] z-10">
            <p className="text-[#929294] text-xs font-medium">Projects</p>
          </div>

          {/* Add project button */}
          <div className="p-2 border-b border-[#1a1a1a]">
            <button
              onClick={handleAddProjectClick}
              className="bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] hover:border-[#00e57a]/30 w-full flex gap-2 items-center justify-center text-white p-2 rounded-lg text-xs transition-all"
            >
              <CirclePlus className="h-3.5 w-3.5 text-[#00e57a]" /> Add Project
            </button>
          </div>

          {/* Projects list — capped so AI Model section always visible */}
          <div className="p-2 flex flex-col gap-2 overflow-y-auto max-h-[35vh]">
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

          {/* AI Model Section */}
          <AiModelSection />
        </div>

        {showProjectModal && (
          <ProjectModal
            projectFormik={projectFormik}
            editingProject={editingProject}
            setShowProjectModal={setShowProjectModal}
            setEditingProject={setEditingProject}
            isCreatingProject={isCreatingProject}
            isUpdatingProject={isUpdatingProject}
          />
        )}
        {showConstraintsModal && (
          <ConstraintsModal
            constraints={constraints}
            selectedConstraints={selectedConstraints}
            setSelectedConstraints={setSelectedConstraints}
            setShowConstraintsModal={setShowConstraintsModal}
            handleConstraintToggle={handleConstraintToggle}
          />
        )}
        {showModelModal && (
          <AiModelModal
            aiModels={aiModels}
            selectedModelId={selectedModelId}
            setSelectedModelId={setSelectedModelId}
            isOtherModel={isOtherModel}
            setIsOtherModel={setIsOtherModel}
            selectedModelName={selectedModelName}
            setSelectedModelName={setSelectedModelName}
            setShowModelModal={setShowModelModal}
          />
        )}
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
          <div className="flex items-center gap-2 w-full">
            <img className="h-auto w-30" src={`/clarixLogo.png`} />
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="text-white text-xs flex my-3 gap-2 group items-center hover:text-[#929294] transition-colors w-full text-left"
          >
            <MessageSquareShare className="w-3.5 h-3.5 text-white group-hover:text-[#929294] transition-colors" /> New Chat
          </button>
          <button
            onClick={handleLogout}
            className="text-white text-xs flex my-3 gap-2 items-center group hover:text-[#929294] transition-colors w-full text-left"
          >
            <LogOut className="w-3.5 h-3.5 text-white group-hover:text-[#929294] transition-colors" /> Logout
          </button>
          <button
            onClick={() => { route.push("/my-plan") }}
            className="text-white text-xs flex my-3 gap-2 items-center group hover:text-[#929294] transition-colors w-full text-left"
          >
            <Landmark className="w-3.5 h-3.5 text-white group-hover:text-[#929294] transition-colors" /> My plan
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
                className="h-8 px-4 flex items-center gap-1.5 rounded-lg bg-(--theme-primary-raw) hover:bg-[#00cc6a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-black text-xs font-bold"
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
                      {(item.projectId || (item.constraints && item.constraints.length > 0) || item.modelId) && (
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.projectId && (
                            <span className="text-[#00e57a] text-[9px] bg-[#00e57a]/10 px-1.5 py-0.5 rounded-full">project</span>
                          )}
                          {item.constraints && item.constraints.length > 0 && (
                            <span className="text-[#929294] text-[9px] bg-[#1a1a1a] px-1.5 py-0.5 rounded-full">
                              {item.constraints.length} constraint{item.constraints.length > 1 ? "s" : ""}
                            </span>
                          )}
                          {item.modelId && (
                            <span className="text-[#00e57a] text-[9px] bg-[#00e57a]/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Bot className="h-2 w-2" /> model
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
                <div
                  key={item.historyId}
                  onClick={() => { setShowAllHistoryModal(false); handleHistoryClick(item.historyId) }}
                  className="group flex items-center justify-between gap-3 w-full text-left p-3 rounded-lg hover:bg-[#111] transition-colors cursor-pointer"
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
                        e.stopPropagation()
                        handleDeleteHistory(e, item.historyId)
                        if (histories.length <= 1) setShowAllHistoryModal(false)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#1e1e1e] h-6 w-6 flex items-center justify-center rounded"
                    >
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </button>
                    <ChevronRight className="h-3.5 w-3.5 text-[#444] group-hover:text-[#929294] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page