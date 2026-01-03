"use client"

import { useFormik } from "formik"
import { CirclePlus, History, MessageSquareMore, MessageSquareShare, Mic, Palette, Search, Send, Settings, User } from "lucide-react"
import { useEffect, useState } from "react"

type Message = {
  role: "user" | "assistant"
  text: string
  timeStamp: string
}

const initialValues = {
  text: ""
}

const formatTime = (rawDate: string) => {
  const date = new Date(rawDate)
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
}


const demoMessages: Message[] = [
  { role: "user", text: "Hi, how y are doing", timeStamp: new Date().toISOString() },
  { role: "assistant", text: "Hi, how y are doing", timeStamp: new Date().toISOString() },
  { role: "user", text: "Hi, how y are doing", timeStamp: new Date().toISOString() },
]

const page = () => {
  const [chatScreen, setChatScreen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(demoMessages)

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {

    }
  })

  const handleSubmit = () => {
    const text = formik.values.text.trim()

    if (!text) return

    const message: Message = {
      text,
      role: "user",
      timeStamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, message])

    formik.resetForm()
  }

  if (true) {
    return (
      <div className="bg-black h-screen grid grid-cols-12">
        <div className="col-span-2 border-[#212121] border-r-2 h-full">
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
          <div className="flex h-8/10 bg-red-400 flex-col p-4">
            {messages.map((message, index) => (
              <div key={index} className={`${message?.role === "assistant" ? "self-start" : "self-end"} bg-[#181818] flex flex-col mt-2 text-white p-2.5 rounded-lg text-sm`}>{message?.text} <span className="ml-auto text-xs mt-1">{formatTime(message?.timeStamp)}</span></div>
            ))}
          </div>

          <div className="top-0 mt-auto mb-3">
            <div className="bg-[#181818] mx-auto h-11 overflow-hidden w-7/10 rounded-lg! flex items-center px-2 gap-2">
              <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><CirclePlus className="h-4 w-4  text-white cursor-pointer" /></button>
              <textarea className="w-full py-2 resize-none mx-auto h-full text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none" onChange={formik.handleChange} name="text" value={formik.values.text} />
              <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><Mic className="h-4 w-4  text-white cursor-pointer" /></button>
              <button type="submit" onClick={handleSubmit} className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><Send className="h-4 w-4  text-white cursor-pointer" /></button>
            </div>
          </div>
          <p className="text-[#929294]! text-xs text-center mb-2">Ai prompt generator can make mistakes. Check important info. </p>
        </div>
        <div className="col-span-2 border-[#212121] border-l-2 h-full">

        </div>
      </div>
    )
  }

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
          <form>
            <div className="bg-[#181818] mx-auto h-11 overflow-hidden w-7/10 rounded-lg! flex items-center px-2 gap-2">
              <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><CirclePlus className="h-4 w-4  text-white cursor-pointer" /></button>
              <textarea className="w-full py-2 resize-none mx-auto h-full text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none" onChange={formik.handleChange} name="text" value={formik.values.text} />
              <button className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><Mic className="h-4 w-4  text-white cursor-pointer" /></button>
              <button type="submit" className="bg-[#282727] h-8 w-8 p-2 rounded-lg"><Send className="h-4 w-4  text-white cursor-pointer" /></button>
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