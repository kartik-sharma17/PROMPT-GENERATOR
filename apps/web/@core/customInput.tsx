import { Input } from "@/components/ui/input"

export const CustomInput = (props: any) => {
    const { placeholder, label, formik, name, required = true, customClass } = props
    return (
        <div className="flex flex-col items-start mb-4">
            {label && (<label className="text-[#929294] text-sm ml-1! mb-1!">{label} {required && (<span className="text-red-600"> *</span>)}</label>)}
            <Input name={name} className={`text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none px-3! py-5! rounded-lg! bg-[#1C1D21] border-transparent ${formik.errors[name] && ("border-red-600")} ${customClass && (customClass)}`} onChange={formik.handleChange} value={formik.values[name]} placeholder={placeholder} />
        </div>
    )
}
