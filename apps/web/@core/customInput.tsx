import { Input } from "@/components/ui/input"

export const CustomInput = (props: any) => {
    const { placeholder, label, formik } = props
    return (
        <div className="flex flex-col items-start">
            {label && (<label className="text-[#929294]">{label}</label>)}
            <Input placeholder={placeholder} />
        </div>
    )
}
