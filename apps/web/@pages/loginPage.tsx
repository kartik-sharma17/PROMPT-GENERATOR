import { CustomInput } from "@/@core"
import { useFormik } from "formik"

const initialValues = {
  email: "",
  password: ""
}

export const LoginPage = () => {

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log(values)
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
        <h1 className="text-white">AI Prompt Generator</h1>
        <h3 className="text-white">AI Prompt Generator</h3>
        <div className="bg-(--bg-main) border-white border-1 p-5! border-rou text-center">
          <form>
            <h3 className="text-white">Welcome Back</h3>
            <h6 className="text-white">Login to Your Account To Continue</h6>
            <CustomInput label={"email"} />
          </form>
        </div>
      </div>
    </div>
  )
}
