"use client"

import { useFormik } from "formik"
import { CirclePlus, MessageSquareMore, Mic, Send } from "lucide-react"
import { useEffect, useState } from "react"

type Message = {
  role: "user" | "assistant"
  text: string
}

const initialValues = {
  text: ""
}

const page = () => {
  const [firstScreen, setFirstScreen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {

    }
  })

  useEffect(() => {
    setMessages(prev => [...prev, { role: "user", text: "Hi, how y are doing" }])
  }, [])

  if (firstScreen) {
    return (
      <div className="bg-black h-screen grid grid-cols-12">
        <div className="col-span-2 bg-[#212121] h-full">

        </div>
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
        <div className="col-span-2 bg-[#212121] h-full">

        </div>
      </div>
    )
  }

  return (
    <div className="bg-black h-screen grid grid-cols-12">
      <div className="col-span-2 h-full">

      </div>
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
      <div className="col-span-2 h-full">

      </div>
    </div>
  )


}

export default page