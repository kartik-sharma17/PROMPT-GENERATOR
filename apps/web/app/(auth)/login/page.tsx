"use client"

import { CustomInput, CustomPasswordInput } from "@/@core"
import { useLoginMutation } from "@/redux/service/authService"
import { setCredentials } from "@/redux/slice/authSlice"
import { loginSchema } from "@/zodSchema"
import { useFormik } from "formik"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { toFormikValidationSchema } from "zod-formik-adapter"

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
    <div className="h-screen overflow-hidden relative">
      <img
        src="/assets/img/loginBG.jpg"
        alt="Login Background"
        className="h-auto w-screen object-contain"
      />
      <div className="absolute h-full w-full top-0 flex flex-col justify-center items-center">
        <h1 className="mb-3 text-5xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          Prompt Smarter. Create Faster.
        </h1>

        <h3 className="mb-10 text-lg bg-linear-to-r to-emerald-300 from-cyan-300 bg-clip-text text-transparent">
          Your all-in-one AI prompt generation platform.
        </h3>

        <div className="bg-(--bg-main) border-white rounded-(--custom-radius) p-10 border-rou text-center">
          <form onSubmit={formik.handleSubmit}>
            <h3 className="text-white text-2xl mb-2">Welcome Back</h3>
            <h6 className="text-[#929294] text-sm mb-7">Login to Your Account To Continue</h6>
            <CustomInput customClass="w-85" name="email" placeholder="Enter Your Email" formik={formik} label="Email" />

            <CustomPasswordInput customClass="w-85" name="password" placeholder="Enter Your Password" formik={formik} label="Password" />

            <div className="w-full flex justify-end mt-2">
              <Link
                href="#"
                className="text-xs text-[#929294]!"
              >
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={isLoading} className="flex items-center justify-center text-white mt-6 bg-linear-to-r gap-2 from-emerald-400 to-cyan-500 w-full p-2.5 rounded-md text-sm">{isLoading && <LoaderCircle className="animate-spin w-4 h-4" />} Login</button>

            <hr className="border-[#6b6b6b] mt-10" />
            <p className="text-[#929294] text-xs mt-5">
              Don’t have an account ?{" "}
              <Link href="/signup" className="text-emerald-300! font-medium hover:underline!">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
      {/* <div className="absolute top-0">
        <img src="/assets/img/logo.webp" className="h-auto w-20" alt="" />
      </div> */}
    </div>
  )
}

export default page