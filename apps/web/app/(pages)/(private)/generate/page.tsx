"use client"

import { TypingIndicator } from "@/@core/typeIndicator"
import { useChatMutation } from "@/reduxConfig/service/chatService"
import { useDeleteHistoryMutation, useGetHistoryQuery, useGetMessagesMutation } from "@/reduxConfig/service/historyService"
import { useCreateProjectMutation, useDeleteProjectMutation, useGetProjectQuery, useUpdateProjectMutation } from "@/reduxConfig/service/projectService"
import { useFormik } from "formik"
import { ChevronRight, CircleCheck, CirclePlus, History, MessageSquareMore, MessageSquareShare, Mic, Palette, Pencil, Search, Send, Settings, Trash2, User, X } from "lucide-react"
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
}

type ProjectData = {
  projectId: string
  projectName: string
  projectDescription: string
  technologiesUsed: string[]
}

type PromptConstraintsType = {
  label: string
  toolTipLabel: string
  key: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const initialValues = { text: "" }

const projectInitialValues = {
  projectName: "",
  projectDescription: "",
  technologiesUsed: "",
}

const promptConstraints: PromptConstraintsType[] = [
  { label: "don't change variable name", toolTipLabel: "don't change variable name", key: "don't_change_variable_name" },
  { label: "don't change logic", toolTipLabel: "don't change logic", key: "don't_change_logic" },
]

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
  const [selectConstraints, setSelectedConstraints] = useState<string[]>([])

  // Project state
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null)

  // History "show all" modal (landing screen)
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

  const projects: ProjectData[] = projectsData?.data || []
  const histories: HistoryItem[] = historyData?.data || []

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

  /**
   * Core chat send handler.
   * - First message: sends without historyId → backend creates new history
   * - Subsequent messages: sends with currentHistoryId so messages go into same history
   */
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

    // Build payload — only include historyId after the first message
    const payload: { content: string; role: string; historyId?: string } = { content: text, role: "user" }
    if (currentHistoryId) {
      payload.historyId = currentHistoryId
    }

    try {
      const response = await chatApi(payload).unwrap()
      const reply = response?.data?.reply || "Something went wrong, please try again"
      const returnedHistoryId = response?.data?.historyId

      // Store historyId from first response so all following messages go there
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

  /** Start a brand new chat session */
  const handleNewChat = () => {
    setMessages([])
    setCurrentHistoryId(null)
    setActiveHistoryId(null)
    setChatScreen(false)
  }

  /** Load messages for a history item and switch to chat view */
  const handleHistoryClick = async (historyId: string) => {
    try {
      const response = await getMessages({ historyId }).unwrap()
      const fetchedMessages: Message[] = (response?.data || [])
        .slice()
        .reverse() // API returns newest first, we want oldest first
        .map((msg: any) => ({
          text: msg.content,
          role: msg.role as "user" | "assistant",
          timeStamp: msg.created_at,
        }))

      setMessages(fetchedMessages)
      setCurrentHistoryId(historyId)
      setActiveHistoryId(historyId)
      setChatScreen(true)
    } catch (err) {
      console.log("Error fetching messages", err)
    }
  }

  const handleDeleteHistory = async (e: React.MouseEvent, historyId: string) => {
    e.stopPropagation() // prevent triggering handleHistoryClick
    try {
      await deleteHistory(historyId).unwrap()
      refetchHistory()
      // If we deleted the active history, reset
      if (activeHistoryId === historyId) {
        handleNewChat()
      }
    } catch (err) {
      console.log("Error deleting history", err)
    }
  }

  const handleConstraintsClick = (key: string) => {
    if (selectConstraints.includes(key)) {
      setSelectedConstraints(selectConstraints.filter((v) => v !== key))
      return
    }
    setSelectedConstraints((prev) => [...prev, key])
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

  // ── Shared sub-components ──

  /** Left panel history list — used in both chat and landing screen */
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
          className={`group flex items-center justify-between gap-2 my-1 p-2 rounded-lg cursor-pointer transition-colors ${activeHistoryId === item.historyId
              ? "bg-[#282727]"
              : "hover:bg-[#1e1e1e]"
            }`}
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
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
            <X className="h-4 w-4 text-[#929294]" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[#929294] text-xs mb-1 block">Project Name</label>
            <input
              className="bg-[#282727] text-white text-sm w-full p-2.5 rounded-lg focus:outline-none"
              name="projectName"
              value={projectFormik.values.projectName}
              onChange={projectFormik.handleChange}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label className="text-[#929294] text-xs mb-1 block">Description</label>
            <textarea
              className="bg-[#282727] text-white text-sm w-full p-2.5 rounded-lg focus:outline-none resize-none h-20"
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
              className="bg-[#282727] text-white text-sm w-full p-2.5 rounded-lg focus:outline-none"
              name="technologiesUsed"
              value={projectFormik.values.technologiesUsed}
              onChange={projectFormik.handleChange}
              placeholder="React, Node.js, MongoDB"
            />
          </div>
          <button
            onClick={() => projectFormik.handleSubmit()}
            disabled={isCreatingProject || isUpdatingProject}
            className="bg-white text-black text-sm font-medium p-2.5 rounded-lg mt-1 disabled:opacity-50"
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

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAT SCREEN
  // ─────────────────────────────────────────────────────────────────────────────

  if (chatScreen) {
    return (
      <div className="bg-black h-screen grid grid-cols-12">
        {/* Left Panel */}
        <div className="col-span-2 border-[#212121] border-r h-full flex flex-col">
          <div className="h-15 border-b border-[#212121]" />

          {/* Nav */}
          <div className="p-3">
            <button
              onClick={handleNewChat}
              className="text-white text-sm flex my-3 gap-2 items-center hover:text-[#929294] transition-colors w-full text-left"
            >
              <MessageSquareShare className="w-4 h-4 text-white" /> New Chat
            </button>
            <p className="text-white text-sm my-3 flex gap-2 items-center">
              <Search className="w-4 h-4 text-white" /> Search
            </p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">
              <User className="w-4 h-4 text-white" /> My Profile
            </p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">
              <Settings className="w-4 h-4 text-white" /> Setting
            </p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">
              <Palette className="w-4 h-4 text-white" /> Theme
            </p>
          </div>

          {/* History list */}
          <HistoryList />
        </div>

        {/* Center — Chat */}
        <div className="col-span-12 md:col-span-8 h-full overflow-y-auto flex flex-col">
          <div className="border-b border-[#212121] h-15" />

          {/* Messages */}
          <div className="flex flex-col p-4 flex-1">
            {isLoadingMessages ? (
              <div className="flex justify-center mt-10">
                <p className="text-[#929294] text-sm">Loading messages...</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`${message.role === "assistant" ? "self-start" : "self-end"
                    } bg-[#181818] max-w-[70%] flex flex-col mt-2 text-white p-2.5 rounded-lg text-sm`}
                >
                  {message.text}
                  <span className="ml-auto text-xs mt-1 text-[#929294]">
                    {formatTime(message.timeStamp)}
                  </span>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex ms-4 mt-2">
                <TypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="mt-auto mb-3">
            <div className="bg-[#2e2e2e] h-10 gap-1 mx-auto flex w-7/10 rounded-t-lg p-1">
              {promptConstraints.map((data, index) => (
                <button
                  key={index}
                  onClick={() => handleConstraintsClick(data.key)}
                  className={`bg-[#181818] flex gap-2 items-center ${selectConstraints.includes(data.key) ? "text-green-500" : "text-white"
                    } p-1 rounded-lg text-xs px-4`}
                >
                  {selectConstraints.includes(data.key) && (
                    <CircleCheck className="h-4 w-4 text-green-500 cursor-pointer" />
                  )}
                  {data.label}
                </button>
              ))}
            </div>
            <div className="bg-[#181818] mx-auto h-11 overflow-hidden w-7/10 rounded-lg flex items-center px-2 gap-2">
              <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg">
                <CirclePlus className="h-4 w-4 text-white cursor-pointer" />
              </button>
              <textarea
                className="w-full py-2 resize-none mx-auto h-full text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none bg-transparent"
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
              />
              <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg">
                <Mic className="h-4 w-4 text-white cursor-pointer" />
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-[#282727] h-8 w-8 p-2 rounded-lg disabled:opacity-50"
              >
                <Send className="h-4 w-4 text-white cursor-pointer" />
              </button>
            </div>
          </div>

          <p className="text-[#929294] text-xs text-center mb-4">
            AI prompt generator can make mistakes. Check important info.
          </p>
        </div>

        {/* Right Panel — Projects */}
        <div className="col-span-2 border-[#212121] border-l h-full flex flex-col">
          <div className="border-[#212121] border-b h-15" />
          <div className="p-2">
            <button
              onClick={handleAddProjectClick}
              className="bg-[#181818] w-full flex gap-2 items-center justify-center text-white p-2.5 rounded-lg text-xs px-6"
            >
              <CirclePlus className="h-4 w-4 text-white cursor-pointer" /> Add Project
            </button>
          </div>

          <div className="p-2 flex flex-col gap-2 overflow-y-auto flex-1">
            {projects.map((project) => (
              <div key={project.projectId} className="bg-[#181818] p-2 rounded-lg">
                <p className="text-white text-xs font-medium truncate">{project.projectName}</p>
                <p className="text-[#929294] text-xs truncate mt-0.5">{project.projectDescription}</p>
                <div className="flex gap-1 mt-1.5 justify-end">
                  <button
                    onClick={() => handleEditProjectClick(project)}
                    className="bg-[#282727] h-6 w-6 flex items-center justify-center rounded"
                  >
                    <Pencil className="h-3 w-3 text-white cursor-pointer" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.projectId)}
                    disabled={isDeletingProject}
                    className="bg-[#282727] h-6 w-6 flex items-center justify-center rounded"
                  >
                    <Trash2 className="h-3 w-3 text-red-400 cursor-pointer" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showProjectModal && <ProjectModal />}
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LANDING / HOME SCREEN
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-black h-screen grid grid-cols-12">
      {/* Left Panel — history preview on landing */}
      <div className="col-span-2 border-[#212121] border-r h-full flex flex-col">
        <div className="h-15 border-b border-[#212121]" />

        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="text-white text-sm flex my-3 gap-2 items-center hover:text-[#929294] transition-colors w-full text-left"
          >
            <MessageSquareShare className="w-4 h-4 text-white" /> New Chat
          </button>
        </div>

        {/* Show up to 4 recent histories on landing screen */}
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
      <div className="col-span-12 md:col-span-8 h-full">
        <div className="h-full flex flex-col justify-center">
          <img
            src="/assets/img/profile.jpeg"
            className="h-auto w-18 mb-2 mx-auto rounded-full"
            alt=""
          />
          <h2 className="text-white mb-2 text-2xl text-center">Good To See You!</h2>
          <h4 className="text-white mb-2 text-lg text-center">How Can I be an Assistance?</h4>
          <p className="text-[#929294] text-sm mb-6 text-center">
            I&apos;m available 24/7 for you, ask me <br /> anything.
          </p>

          <div className="bg-[#181818] mx-auto h-11 overflow-hidden w-7/10 rounded-lg flex items-center px-2 gap-2">
            <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg">
              <CirclePlus className="h-4 w-4 text-white cursor-pointer" />
            </button>
            <textarea
              className="w-full py-2 resize-none mx-auto h-full text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none bg-transparent"
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
            />
            <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg">
              <Mic className="h-4 w-4 text-white cursor-pointer" />
            </button>
            <button
              onClick={handleStartChat}
              disabled={isLoading}
              className="bg-[#282727] h-8 w-8 p-2 rounded-lg disabled:opacity-50"
            >
              <Send className="h-4 w-4 text-white cursor-pointer" />
            </button>
          </div>

          {/* Recent history chips — show up to 3, then "Show More" */}
          {histories.length > 0 && (
            <div className="w-7/10 mx-auto mt-8">
              <p className="text-[#929294] text-xs mb-3 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Recent conversations
              </p>
              <div className="flex flex-col gap-2">
                {histories.slice(0, 3).map((item) => (
                  <button
                    key={item.historyId}
                    onClick={() => handleHistoryClick(item.historyId)}
                    className="bg-[#181818] hover:bg-[#222] transition-colors flex items-center justify-between gap-3 text-left w-full p-3 rounded-lg group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquareMore className="h-3.5 w-3.5 text-[#555] shrink-0" />
                      <span className="text-white text-xs truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[#555] text-[10px]">{formatHistoryDate(item.updatedAt)}</span>
                      <ChevronRight className="h-3 w-3 text-[#555] group-hover:text-[#929294] transition-colors" />
                    </div>
                  </button>
                ))}

                {histories.length > 3 && (
                  <button
                    onClick={() => setShowAllHistoryModal(true)}
                    className="text-[#929294] hover:text-white transition-colors text-xs flex items-center gap-1.5 mt-1 mx-auto"
                  >
                    <History className="h-3.5 w-3.5" />
                    Show all {histories.length} conversations
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right spacer on landing */}
      <div className="col-span-2 h-full" />

      {/* ── All History Modal ── */}
      {showAllHistoryModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#181818] rounded-xl w-full max-w-lg max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#212121]">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-[#929294]" />
                <h3 className="text-white text-sm font-semibold">All Conversations</h3>
                <span className="text-[#555] text-xs">({histories.length})</span>
              </div>
              <button
                onClick={() => setShowAllHistoryModal(false)}
                className="text-[#929294] hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-1">
              {histories.map((item) => (
                <button
                  key={item.historyId}
                  onClick={() => {
                    setShowAllHistoryModal(false)
                    handleHistoryClick(item.historyId)
                  }}
                  className="group flex items-center justify-between gap-3 w-full text-left p-3 rounded-lg hover:bg-[#222] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquareMore className="h-3.5 w-3.5 text-[#555] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white text-xs truncate">{item.title}</p>
                      <p className="text-[#555] text-[10px] mt-0.5">{formatHistoryDate(item.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        handleDeleteHistory(e, item.historyId)
                        // close modal if it becomes empty
                        if (histories.length <= 1) setShowAllHistoryModal(false)
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#282727] h-6 w-6 flex items-center justify-center rounded"
                    >
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </button>
                    <ChevronRight className="h-3.5 w-3.5 text-[#555] group-hover:text-[#929294] transition-colors" />
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