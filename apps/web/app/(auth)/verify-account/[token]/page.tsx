"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useVerifyAccountQuery } from "@/reduxConfig/service/authService"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/reduxConfig/slice/authSlice"
import { LoaderCircle, CheckCircle2, XCircle } from "lucide-react"
import Cookies from "js-cookie";

const page = () => {
    const [timeLeft, setTimeLeft] = useState(5)
    const { token } = useParams<{ token: string }>()
    const { data, isLoading, error, isError, isSuccess } = useVerifyAccountQuery(token, {
        skip: !token,
    })
    const dispatch = useDispatch()
    const route = useRouter()

    useEffect(() => {
        if (!isSuccess) return
        if (timeLeft === 0) {
            route.replace("/choose-plan")
            return
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [timeLeft, isSuccess])

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Account Verified Successfully")
            dispatch(
                setCredentials({
                    user: data?.data,
                    token: data?.data?.token,
                })
            );

            Cookies.set("token", data?.data?.token, { expires: 7, path: "/generate" });
        }
        if (isError) {
            toast.error((error as any)?.data?.message || "Something went wrong, please try again")
        }
    }, [data, isSuccess, isError, error])

    return (
        <div
            className="h-screen overflow-hidden relative flex flex-col justify-center items-center"
            style={{ background: "var(--sec-bg, #0d0f14)" }}
        >
            {/* Ambient glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none"
                style={{
                    background: "color-mix(in srgb, var(--theme-primary-raw) 6%, transparent)",
                    zIndex: 0,
                }}
            />

            <div className="relative z-10 flex flex-col items-center text-center px-6">
                {isLoading && (
                    <>
                        <LoaderCircle
                            className="animate-spin w-16 h-16 mb-6"
                            style={{ color: "var(--theme-primary-raw)" }}
                        />
                        <h1
                            className="text-4xl md:text-5xl font-bold mb-0"
                            style={{
                                background:
                                    "linear-gradient(to right, var(--theme-primary-raw), color-mix(in srgb, var(--theme-primary-raw) 50%, white))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Verifying Your Account
                        </h1>
                        <p className="text-[#929294] text-base mt-3">
                            Please wait while we verify your email…
                        </p>
                    </>
                )}

                {isSuccess && (
                    <>
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                            style={{
                                background: "color-mix(in srgb, var(--theme-primary-raw) 10%, transparent)",
                                border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 25%, transparent)",
                            }}
                        >
                            <CheckCircle2
                                className="w-10 h-10"
                                style={{ color: "var(--theme-primary-raw)" }}
                            />
                        </div>
                        <h1
                            className="text-4xl md:text-5xl font-bold mb-3"
                            style={{
                                background:
                                    "linear-gradient(to right, var(--theme-primary-raw), color-mix(in srgb, var(--theme-primary-raw) 50%, white))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Account Verified!
                        </h1>
                        <p className="text-[#929294] text-base mb-2">
                            Congratulations, your account is now active.
                        </p>
                        <p
                            className="text-sm font-medium"
                            style={{ color: "var(--theme-primary-raw)" }}
                        >
                            Redirecting to plans in {timeLeft}s…
                        </p>
                    </>
                )}

                {isError && (
                    <>
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                            style={{
                                background: "rgba(239,68,68,0.1)",
                                border: "1px solid rgba(239,68,68,0.25)",
                            }}
                        >
                            <XCircle className="w-10 h-10 text-red-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                            Verification Failed
                        </h1>
                        <p className="text-[#929294] text-base mb-6">
                            The link may have expired. Please try signing up again.
                        </p>
                        <button
                            onClick={() => route.replace("/signup")}
                            className="px-8 py-3 rounded-xl text-black text-sm font-semibold transition-all hover:scale-[1.02]"
                            style={{
                                background:
                                    "linear-gradient(to right, var(--theme-primary-raw), color-mix(in srgb, var(--theme-primary-raw) 50%, white))",
                                boxShadow:
                                    "0 0 20px color-mix(in srgb, var(--theme-primary-raw) 25%, transparent)",
                            }}
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default page