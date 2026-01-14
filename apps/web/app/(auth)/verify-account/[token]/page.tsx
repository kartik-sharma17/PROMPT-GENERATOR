"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useVerifyAccountQuery } from "@/redux/service/authService"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/redux/slice/authSlice"
import { LoaderCircle } from "lucide-react"

const page = () => {
    const [timeLeft, setTimeLeft] = useState(5)
    const { token } = useParams<{ token: string }>()
    const { data, isLoading, error, isError, isSuccess } = useVerifyAccountQuery(token, {
        skip: !token,
    })
    const dispatch = useDispatch()
    const route = useRouter()

    useEffect(() => {
        if (timeLeft === 0) route.replace("/")

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Account Verify Successfully")
            dispatch(setCredentials({
                user: data?.data,
                token: data?.data?.token
            }))
        }
        if (isError) {
            toast.error(error?.data?.message || "Something went wrong, please try again")
        }
    }, [data, isSuccess, isError, error])

    return (
        <div className="h-screen overflow-hidden relative">
            <img
                src="/assets/img/loginBG.jpg"
                alt="Login Background"
                className="h-auto w-screen object-contain"
            />
            {
                isLoading ? <div className="absolute h-full w-full top-0 flex flex-col justify-center items-center">
                    <h1 className="mb-3 text-5xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent flex gap-4 items-center">
                        <LoaderCircle className="animate-spin w-14 h-14 text-emerald-400" /> Verifying Your Account
                    </h1>
                </div> :
                    isSuccess ?
                        <div className="absolute h-full w-full top-0 flex flex-col justify-center items-center">
                            <h1 className="mb-3 text-5xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                                Congratulations Your Account is Verified Now
                            </h1>

                            <h3 className="mb-10 text-lg bg-linear-to-r to-emerald-300 from-cyan-300 bg-clip-text text-transparent">
                                You are Redirecting in {timeLeft}
                            </h3>
                        </div>
                        :
                        <div className="absolute h-full w-full top-0 flex flex-col justify-center items-center">
                            <h1 className="mb-3 text-5xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                                Account Verification Failed, Please Try Again
                            </h1>

                            <button onClick={() => { route.replace("/signup") }} className="text-white px-10 mt-5 bg-linear-to-r from-emerald-400 to-cyan-500 p-2.5 rounded-md text-sm">Try Again</button>
                        </div>
            }
        </div>
    )
}

export default page