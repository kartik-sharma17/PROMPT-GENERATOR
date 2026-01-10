"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useVerifyAccountQuery } from "@/redux/service/authService"
import { toast } from "sonner"

const page = () => {
    const [timeLeft, setTimeLeft] = useState(10)
    const { token } = useParams<{ token: string }>()
    const { data, isLoading, isError, isSuccess } = useVerifyAccountQuery(token, {
        skip: !token,
    })

    useEffect(() => {
        if (timeLeft === 0) return

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    useEffect(() => {
        console.log("this is a data => ", data)
        if (!data) return
        if (isSuccess) {
            toast.success("Account Verify Successfully")
        }
        if (isError) {
            toast.error("Something went wrong, please try again")
        }
    }, [data, isSuccess, isError])

    return (
        <div className="h-screen overflow-hidden relative">
            <img
                src="/assets/img/loginBG.jpg"
                alt="Login Background"
                className="h-auto w-screen object-contain"
            />
            <div className="absolute h-full w-full top-0 flex flex-col justify-center items-center">
                <h1 className="mb-3 text-5xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                    Congratulations Your Account is Verified Now
                </h1>

                <h3 className="mb-10 text-lg bg-linear-to-r to-emerald-300 from-cyan-300 bg-clip-text text-transparent">
                    You are Redirecting in {timeLeft}
                </h3>
            </div>
        </div>
    )
}

export default page