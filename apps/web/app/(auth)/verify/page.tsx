"use client"

import { useEffect, useState } from "react"

const page = () => {

    const [mail, setmail] = useState("contactkartikforwork@gmail.com")
    const [timeLeft, setTimeLeft] = useState(120)
    const [sendMail, setSendMail] = useState(false)

    useEffect(() => {
        if (timeLeft === 0) return

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    return (
        <div className="h-screen overflow-hidden relative">
            <img
                src="/assets/img/loginBG.jpg"
                alt="Login Background"
                className="h-auto w-screen object-contain"
            />
            <div className="absolute h-full w-full top-0 flex flex-col justify-center items-center">
                <h1 className="mb-3 text-5xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                    Verify Your Account.
                </h1>

                <h3 className="mb-10 text-lg bg-linear-to-r to-emerald-300 from-cyan-300 bg-clip-text text-transparent">
                    Please click on a link send to {mail} to verify your account.
                </h3>

                <button type="submit" disabled={sendMail} className="text-white px-10 bg-linear-to-r from-emerald-400 to-cyan-500 p-2.5 rounded-md text-sm">Resend Verification Link in {timeLeft}</button>

            </div>
            {/* <div className="absolute top-0">
        <img src="/assets/img/logo.webp" className="h-auto w-20" alt="" />
      </div> */}
        </div>
    )
}

export default page