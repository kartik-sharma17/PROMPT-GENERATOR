"use client"

import { TypingIndicator } from "@/@core/typeIndicator"
import { useChatMutation } from "@/reduxConfig/service/chatService"
import { useCreateProjectMutation, useDeleteProjectMutation, useGetProjectQuery, useUpdateProjectMutation } from "@/reduxConfig/service/projectService"
import { useFormik } from "formik"
import { CircleCheck, CirclePlus, History, MessageSquareMore, MessageSquareShare, Mic, Palette, Pencil, Search, Send, Settings, Trash2, User, X } from "lucide-react"
import { useEffect, useState } from "react"

type Message = {
  role: "user" | "assistant"
  text: string
  timeStamp: string
}
type ProjectName = {
  projectName: string
}
type PromptConstraintsType = {
  label: string,
  toolTipLabel: string,
  key: string
}
type ProjectData = {
  projectId: string
  projectName: string
  projectDescription: string
  technologiesUsed: string[]
}

const initialValues = {
  text: ""
}

const projectInitialValues = {
  projectName: "",
  projectDescription: "",
  technologiesUsed: "",
}

const formatTime = (rawDate: string) => {
  const date = new Date(rawDate)
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
}

const promptConstraints: PromptConstraintsType[] = [
  { label: "don't change variable name", toolTipLabel: "don't change variable name", key: "don't_change_variable_name" },
  { label: "don't change logic", toolTipLabel: "don't change logic", key: "don't_change_logic" },
]

const page = () => {
  const [chatScreen, setChatScreen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatApi, { isLoading }] = useChatMutation()
  const [selectConstraints, setSelectedConstraints] = useState<string[]>([])

  // Project state
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null)

  // Project API hooks
  const { data: projectsData, refetch: refetchProjects } = useGetProjectQuery({})
  const [createProject, { isLoading: isCreatingProject }] = useCreateProjectMutation()
  const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation()
  const [updateProject, { isLoading: isUpdatingProject }] = useUpdateProjectMutation()

  const projects: ProjectData[] = projectsData?.data || []

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {

    }
  })

  const projectFormik = useFormik({
    initialValues: projectInitialValues,
    onSubmit: async (values) => {
      const technologiesUsed = values.technologiesUsed
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      if (editingProject) {
        // Update project
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
        // Create project
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
    }
  })

  const handleSubmit = async () => {
    const text = formik.values.text.trim()

    if (!text) return

    const message: Message = {
      text,
      role: "user",
      timeStamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, message])

    // calling the api
    const payload = {
      "query": text
    }

    formik.resetForm()
    try {
      const response = await chatApi(payload).unwrap()
      const reply = response?.data?.reply || "Somethings went wrong please try again"
      const message: Message = {
        text: reply,
        role: "assistant",
        timeStamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, message])
    }
    catch (exception) {
      console.log("somethings went wrong while calling a api", exception)
    }
  }

  const handleStartChat = (e: any) => {
    if (!chatScreen) setChatScreen(true)
    handleSubmit()
  }

  const handleConstraintsClick = (key: string) => {
    if (selectConstraints.includes(key)) {
      setSelectedConstraints(selectConstraints.filter((value) => value !== key));
      return
    }
    setSelectedConstraints(prev => [...prev, key])
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

  // main chat screen
  if (chatScreen) {
    return (
      <div className="bg-black h-screen grid grid-cols-12">
        <div className="col-span-2 border-[#212121] border-r h-full">
          <div className="h-15 border-b border-[#212121]">

          </div>
          <div className="p-3">
            <p className="text-white text-sm flex my-3 gap-2 items-center"><MessageSquareShare className="w-4 h-4 text-white" /> New Chat</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center"><Search className="w-4 h-4 text-white" /> Search</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center"><User className="w-4 h-4 text-white" /> My Profile</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center"><Settings className="w-4 h-4 text-white" /> Setting</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center"><Palette className="w-4 h-4 text-white" /> Theme</p>
          </div>

          <div className="p-3 h-6/10 overflow-y-auto">
            <p className="text-sm text-[#929294] flex gap-2 items-center"><History className="w-4 h-4 text-[#929294]" />  History</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to Create React App....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">Why i am so good in flirt....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to play pubg like pro....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to Create React App....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to Create React App....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">Why i am so good in flirt....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to play pubg like pro....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to Create React App....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to Create React App....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">Why i am so good in flirt....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to play pubg like pro....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to Create React App....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to Create React App....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">Why i am so good in flirt....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to play pubg like pro....</p>
            <p className="text-white text-sm my-3 flex gap-2 items-center">How to Create React App....</p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8 h-full overflow-y-auto flex flex-col">
          <div className="border-b border-[#212121] h-15">

          </div>
          <div className="flex flex-col p-4">
            {messages.map((message, index) => (
              <div key={index} className={`${message?.role === "assistant" ? "self-start" : "self-end"} bg-[#181818] max-w-7/10 flex flex-col mt-2 text-white p-2.5 rounded-lg text-sm`}>{message?.text} <span className="ml-auto text-xs mt-1">{formatTime(message?.timeStamp)}</span></div>
            ))}
          </div>

          {isLoading && (
            <div className="flex ms-4">
              <TypingIndicator />
            </div>
          )}

          <div className="mt-auto mb-3">
            <div className="bg-[#2e2e2e] h-10 gap-1 mx-auto flex w-7/10 rounded-t-lg! p-1">
              {promptConstraints?.map((data, index) => (
                <button key={index} onClick={() => { handleConstraintsClick(data?.key) }} className={`bg-[#181818] flex gap-2 items-center ${selectConstraints.includes(data?.key) ? "text-green-500" : "text-white" }  p-1 rounded-lg text-xs px-4`}>{selectConstraints.includes(data?.key) && <CircleCheck className="h-4 w-4 text-green-500  cursor-pointer" />}{data?.label}</button>
              ))
              }
            </div>
            <div className="bg-[#181818] mx-auto h-11 overflow-hidden w-7/10 rounded-lg! flex items-center px-2 gap-2">
              <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><CirclePlus className="h-4 w-4  text-white cursor-pointer" /></button>
              <textarea className="w-full py-2 resize-none mx-auto h-full text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none" onChange={formik.handleChange} name="text" value={formik.values.text} />
              <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><Mic className="h-4 w-4  text-white cursor-pointer" /></button>
              <button type="submit" onClick={handleSubmit} className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><Send className="h-4 w-4  text-white cursor-pointer" /></button>
            </div>
          </div>
          <p className="text-[#929294]! text-xs text-center mb-20">Ai prompt generator can make mistakes. Check important info. </p>
        </div>

        {/* Right Panel - Projects */}
        <div className="col-span-2 border-[#212121] border-l h-full flex flex-col">
          <div className="border-[#212121] border-b h-15">

          </div>
          <div className="p-2">
            <button
              onClick={handleAddProjectClick}
              className="bg-[#181818] w-full flex gap-2 items-center justify-center text-white p-2.5 rounded-lg text-xs px-6"
            >
              <CirclePlus className="h-4 w-4 text-white cursor-pointer" /> Add Project
            </button>
          </div>

          {/* Project List */}
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

        {/* Add / Edit Project Modal */}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-sm font-semibold">
                  {editingProject ? "Edit Project" : "Add Project"}
                </h3>
                <button onClick={() => { setShowProjectModal(false); setEditingProject(null); projectFormik.resetForm() }}>
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
                  <label className="text-[#929294] text-xs mb-1 block">Technologies Used <span className="text-[#555]">(comma separated)</span></label>
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
                    : editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // starting chat screen
  return (
    <div className="bg-black h-screen grid grid-cols-12">
      <div className="col-span-2 h-full"></div>
      <div className="col-span-12 md:col-span-8 h-full">
        {/* messages div */}
        <div className="h-full flex flex-col justify-center">
          <img src="/assets/img/profile.jpeg" className="h-auto w-18 mb-2 mx-auto rounded-full" alt="" />
          <h2 className="text-white mb-2 text-2xl text-center">Good To See You!</h2>
          <h4 className="text-white mb-2 text-lg text-center">How Can I be an Assistance?</h4>
          <p className="text-[#929294]! text-sm mb-6 text-center">i, am available 24/7 for you, ask me <br /> anything.</p>
          <form onSubmit={formik.handleSubmit}>
            <div className="bg-[#181818] mx-auto h-11 overflow-hidden w-7/10 rounded-lg! flex items-center px-2 gap-2">
              <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><CirclePlus className="h-4 w-4  text-white cursor-pointer" /></button>
              <textarea className="w-full py-2 resize-none mx-auto h-full text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none" onChange={formik.handleChange} name="text" value={formik.values.text} />
              <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><Mic className="h-4 w-4  text-white cursor-pointer" /></button>
              <button onClick={handleStartChat} className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><Send className="h-4 w-4  text-white cursor-pointer" /></button>
            </div>
          </form>
          <div className="flex justify-evenly w-7/10 mx-auto mt-10">
            <button className="bg-[#181818] flex gap-2 items-center text-white p-2.5 rounded-lg text-xs px-6"><MessageSquareMore className="h-4 w-4 text-white cursor-pointer" /> Any Advice for me?</button>
            <button className="bg-[#181818] flex gap-2 items-center text-white p-2.5 rounded-lg text-xs px-6"><MessageSquareMore className="h-4 w-4 text-white cursor-pointer" /> Any Advice for me?</button>
            <button className="bg-[#181818] flex gap-2 items-center text-white p-2.5 rounded-lg text-xs px-6"><MessageSquareMore className="h-4 w-4 text-white cursor-pointer" /> Any Advice for me?</button>
          </div>
        </div>
      </div>
      <div className="col-span-2 h-full"></div>
    </div>
  )

}

export default page