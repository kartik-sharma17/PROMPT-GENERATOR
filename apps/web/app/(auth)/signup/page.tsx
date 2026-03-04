"use client"

import { CustomInput, CustomPasswordInput } from "@/@core"
import { useSignupMutation } from "@/reduxConfig/service/authService"
import { registerSchema } from "@/zodSchema"
import { useFormik } from "formik"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { toFormikValidationSchema } from "zod-formik-adapter"

const initialValues = {
  full_name: "",
  email: "",
  role: "user",
  phone: "",
  password: ""
}

const page = () => {
  const [signupApi, { isLoading }] = useSignupMutation()
  const navigate = useRouter()

  const formik = useFormik({
    initialValues,
    validationSchema: toFormikValidationSchema(registerSchema),
    onSubmit: async (values) => {
      try {
        const response = await signupApi(values).unwrap()
        toast.success(response?.message || "Verification is Send to your Register Mail Id")
        setTimeout(() => {
          navigate.replace("/verifying-account")
        }, 3000)
      }
      catch (exception: any) {
        toast.error(exception?.data?.message || "something went wrong, please try again")
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
        <h1 className="mb-7 text-5xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          Prompt Smarter. Create Faster.
        </h1>

        <div className="bg-(--bg-main) border-white rounded-(--custom-radius) p-10 border-rou text-center">
          <form onSubmit={formik.handleSubmit}>
            <h3 className="text-white text-2xl mb-2">Create Your Account</h3>
            <h6 className="text-[#929294] text-sm mb-7"> Create an account and start your journey with us</h6>
            <CustomInput customClass="w-85" name="full_name" placeholder="Enter Your Full Name" formik={formik} label="Full Name" />

            <CustomInput customClass="w-85" name="email" placeholder="Enter Your Email" formik={formik} label="Email" />

            <CustomInput customClass="w-85" name="phone" placeholder="Enter Your Phone" formik={formik} label="Phone No." />

            <CustomPasswordInput customClass="w-85" name="password" placeholder="Create Your Password" formik={formik} label="Password" />

            <button type="submit" disabled={isLoading} className="text-white flex gap-2 justify-center items-center mt-6 bg-linear-to-r from-emerald-400 to-cyan-500 w-full p-2.5 rounded-md text-sm">{isLoading && <LoaderCircle className="animate-spin w-4 h-4" />}Register</button>

            <hr className="border-[#6b6b6b] mt-10" />
            <p className="text-[#929294] text-xs mt-5">
              Already have an account ?{" "}
              <Link href="/login" className="text-emerald-300! font-medium hover:underline!">
                Login
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