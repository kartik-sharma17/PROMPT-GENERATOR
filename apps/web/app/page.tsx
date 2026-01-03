"use client"

import { useFormik } from "formik"
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
      <div className="bg-(--bg-main)">
        Second Page
      </div>
    )
  }

  return (
    <div className="bg-black h-screen grid grid-cols-12">
      <div className="col-span-2 bg-[#212121] h-full">

      </div>
      <div className="col-span-12 md:col-span-8 h-full">
        {/* messages div */}
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-white mb-2 text-2xl text-center">Good To See You!</h2>
          <h4 className="text-white mb-2 text-lg text-center">How Can I be an Assistance?</h4>
          <p className="text-[#929294]! text-sm mb-4 text-center">i,am available 24/7 for you, ask me <br /> anything.</p>
          <input className="bg-[#181818] mx-auto text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none px-3! py-2! w-7/10 rounded-lg! border-transparent" onChange={formik.handleChange} name="text" value={formik.values.text} />
        </div>
      </div>
      <div className="col-span-2 bg-[#212121] h-full">

      </div>
    </div>
  )


}

export default page