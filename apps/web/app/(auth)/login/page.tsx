"use client"

import { CustomInput, CustomPasswordInput } from "@/@core"
import { useLoginMutation } from "@/reduxConfig/service/authService"
import { setCredentials } from "@/reduxConfig/slice/authSlice"
import { loginSchema } from "@/zodSchema"
import { useFormik } from "formik"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { toFormikValidationSchema } from "zod-formik-adapter"
import { motion } from "framer-motion";
import Cookies from "js-cookie"

const initialValues = {
  email: "",
  password: ""
}

const page = () => {
  const [loginApi, { isLoading }] = useLoginMutation()
  const navigate = useRouter()
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: async (values) => {
      try {
        const response = await loginApi(values).unwrap()
        toast.success(response?.message || "Login Successfully")
        dispatch(setCredentials({
          user: response?.data,
          token: response?.data?.token
        }))
        Cookies.set("token", response?.data?.token, {
          expires: 7,
          path: "/",
        });
        setTimeout(() => {
          navigate.replace("/")
        }, 3000)
      }
      catch (exception: any) {
        toast.error(exception?.data?.message || "Something went wrong")
      }
    }
  })

  return (
    <div
      className="h-screen overflow-hidden relative flex flex-col justify-center items-center"
      style={{ background: "var(--sec-bg, #0d0f14)" }}
    >
      {/* Particle canvas */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,255,170,0.2) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Horizontal moving particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: "rgba(0,255,170,0.3)",
              top: `${Math.random() * 100}%`,
              left: "-5%",
            }}
            animate={{
              x: ["0vw", "110vw"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Ambient glow blobs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(99,247,168,0.06)", zIndex: 0 }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "rgba(34,211,238,0.05)", zIndex: 0 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        {/* Card */}
        <div
          className="w-full max-w-md p-8 rounded-2xl text-center"
          style={{
            background: "rgba(28,29,33,0.75)",
            border: "1px solid rgba(99,247,168,0.12)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 0 40px rgba(99,247,168,0.05), 0 8px 32px rgba(0,0,0,0.4)"
          }}
        >
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(99,247,168,0.08)",
                border: "1px solid rgba(99,247,168,0.2)",
                color: "#63f7a8"
              }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure Login
            </span>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <h3 className="text-white text-2xl font-bold mb-1">Welcome Back</h3>
            <h6 className="text-[#929294] text-sm mb-6">Login to your account to continue</h6>

            <CustomInput
              customClass="w-full"
              name="email"
              placeholder="Enter Your Email"
              formik={formik}
              label="Email"
            />

            <CustomPasswordInput
              customClass="w-full"
              name="password"
              placeholder="Enter Your Password"
              formik={formik}
              label="Password"
            />

            <div className="w-full flex justify-end mt-1 mb-2">
              <Link href="#" className="text-xs text-[#929294] hover:text-emerald-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center text-black font-semibold mt-4 w-full p-3 rounded-xl text-sm gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              style={{
                background: "linear-gradient(to right, #34d399, #22d3ee)",
                boxShadow: "0 0 20px rgba(99,247,168,0.25)"
              }}
            >
              {isLoading && <LoaderCircle className="animate-spin w-4 h-4" />}
              Login
            </button>

            <hr className="border-[#2a2b30] mt-8 mb-5" />
            <p className="text-[#929294] text-xs">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-emerald-400 font-medium hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default page