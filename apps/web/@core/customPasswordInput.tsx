import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export const CustomPasswordInput = (props: any) => {
    const {
        placeholder,
        label,
        formik,
        name,
        required = true,
        customClass,
    } = props;

    const [show, setShow] = useState(false);
    const hasError = formik.touched[name] && formik.errors[name];

    return (
        <div className="flex flex-col items-start w-full">
            {label && (
                <label className="text-[#929294] text-sm ml-1 mb-1">
                    {label}
                    {required && <span className="text-red-600"> *</span>}
                </label>
            )}

            <div className="relative w-full">
                <Input
                    type={show ? "text" : "password"}
                    name={name}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={placeholder}
                    className={`
            text-white px-3 py-5 rounded-lg bg-[#1C1D21]
            focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none
            border ${hasError ? "border-red-600" : "border-transparent"}
            pr-10
            ${customClass ?? ""}
          `}
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

        </div>
    );
};
