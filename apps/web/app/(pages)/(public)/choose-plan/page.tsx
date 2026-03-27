"use client"

import { useGetPlansQuery, useSubscribeMutation, useVerifyPaymentMutation } from "@/reduxConfig/service/subscriptionService"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LoaderCircle, Zap, Check, Crown, Sparkles } from "lucide-react"
import { motion } from "framer-motion";
import { loadRazorpay } from "@/lib/loadRazorpay"


/* ── Plan icon based on index ── */
const planIcons = [Zap, Sparkles, Crown]

/* ── Plan card ── */
function PlanCard({
    plan,
    index,
    isLoading,
    onChoose,
}: {
    plan: { id: string; name: string; price: number; duration: number; dailyLimit: number }
    index: number
    isLoading: boolean
    onChoose: (id: string) => void
}) {
    const Icon = planIcons[index % planIcons.length]
    const isPopular = index === 1
    const isFree = plan.price === 0

    return (
        <div
            className="relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            style={{
                background: isPopular
                    ? "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(34,211,238,0.08))"
                    : "rgba(28,29,33,0.75)",
                border: isPopular
                    ? "1px solid rgba(99,247,168,0.35)"
                    : "1px solid rgba(99,247,168,0.1)",
                backdropFilter: "blur(18px)",
                boxShadow: isPopular
                    ? "0 0 40px rgba(99,247,168,0.1), 0 8px 32px rgba(0,0,0,0.4)"
                    : "0 8px 32px rgba(0,0,0,0.3)",
            }}
        >
            {/* Popular badge */}
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-black"
                        style={{ background: "linear-gradient(to right, #34d399, #22d3ee)" }}
                    >
                        <Crown size={10} /> Most Popular
                    </span>
                </div>
            )}

            {/* Icon + Name */}
            <div className="flex items-center gap-3 mb-4 mt-2">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                        background: "rgba(99,247,168,0.1)",
                        border: "1px solid rgba(99,247,168,0.2)",
                    }}
                >
                    <Icon size={18} style={{ color: "#63f7a8" }} />
                </div>
                <h3 className="text-white font-bold text-lg">{plan.name}</h3>
            </div>

            {/* Price */}
            <div className="mb-5">
                {isFree ? (
                    <p
                        className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent"
                    >
                        Free
                    </p>
                ) : (
                    <div className="flex items-end gap-1">
                        <span className="text-[#929294] text-lg font-medium">₹</span>
                        <p
                            className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent"
                        >
                            {plan.price}
                        </p>
                        <span className="text-[#929294] text-sm mb-1.5">
                            / {plan.duration} mo
                        </span>
                    </div>
                )}
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                <li className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span
                        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(99,247,168,0.15)" }}
                    >
                        <Check size={10} style={{ color: "#63f7a8" }} />
                    </span>
                    {plan.duration} {plan.duration === 1 ? "month" : "months"} access
                </li>
                <li className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span
                        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(99,247,168,0.15)" }}
                    >
                        <Check size={10} style={{ color: "#63f7a8" }} />
                    </span>
                    {plan.dailyLimit === -1 ? "Unlimited daily prompts" : `${plan.dailyLimit} prompts / day`}
                </li>
                <li className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span
                        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(99,247,168,0.15)" }}
                    >
                        <Check size={10} style={{ color: "#63f7a8" }} />
                    </span>
                    All AI model support
                </li>
            </ul>

            {/* CTA */}
            <button
                disabled={isLoading}
                onClick={() => onChoose(plan.id)}
                className="w-full p-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                style={
                    isPopular
                        ? {
                            background: "linear-gradient(to right, #34d399, #22d3ee)",
                            color: "#000",
                            boxShadow: "0 0 20px rgba(99,247,168,0.3)",
                        }
                        : {
                            background: "rgba(99,247,168,0.08)",
                            border: "1px solid rgba(99,247,168,0.2)",
                            color: "#63f7a8",
                        }
                }
            >
                {isLoading && <LoaderCircle className="animate-spin w-4 h-4" />}
                {isFree ? "Get Started Free" : "Choose Plan →"}
            </button>
        </div>
    )
}

const page = () => {
    const { data: plansData, isLoading: plansLoading, isError } = useGetPlansQuery(undefined)
    const [subscribeMutation, { isLoading: subscribing }] = useSubscribeMutation()
    const [verifyPayment, { isLoading: verifyPaymentLoading }] = useVerifyPaymentMutation()
    const navigate = useRouter()

    const plans: { id: string; name: string; price: number; duration: number; dailyLimit: number }[] =
        plansData?.data || []

    const handleChoosePlan = async (planId: string) => {
        try {
            const loaded = await loadRazorpay();
            if (!loaded) {
                alert("Razorpay failed to load.");
                return;
            }
            const response = await subscribeMutation(planId).unwrap()

            // Free plan — subscription activated directly
            if (!response?.data?.id) {
                toast.success(response?.message || "Plan activated successfully!")
                setTimeout(() => navigate.replace("/"), 2000)
                return
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                amount: response?.data?.amount,
                currency: "INR",
                name: "Prompter",
                description: "Subscription Payment",
                order_id: response?.data?.id,
                handler: async function (RazorpayResponse: any) {
                    console.log("this is the response = ", RazorpayResponse)
                    const payload = {
                        ...RazorpayResponse,
                        "razorpayResponse": RazorpayResponse
                    }

                    try {
                        const response = await verifyPayment(payload).unwrap();
                        console.log(response)
                        toast.success(response?.message || "Your plan is active now")
                    }
                    catch (exception: any) {
                        toast.error(exception?.data?.detail?.message || "Something went wrong, please try again")
                    }
                },
                prefill: {
                    name: "Kartik",
                    email: "user@gmail.com"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (exception: any) {
            console.log("this is a res = ", exception)
            toast.error(exception?.data?.detail?.message || "Something went wrong, please try again")
        }
    }

    return (
        <div
            className="min-h-screen relative flex flex-col items-center py-16 px-4"
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

            {/* Ambient blobs */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
                style={{ background: "rgba(99,247,168,0.05)", zIndex: 0 }}
            />

            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
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
                        Choose Your Plan
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-3">
                    Start with the{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                        right plan
                    </span>
                </h1>
                <p className="text-[#929294] text-center text-base max-w-xl mb-12">
                    Pick a plan that fits your workflow. Upgrade or downgrade anytime.
                </p>

                {/* Plans grid */}
                {plansLoading ? (
                    <div className="flex flex-col items-center gap-4 mt-10">
                        <LoaderCircle
                            className="animate-spin w-10 h-10"
                            style={{ color: "#63f7a8" }}
                        />
                        <p className="text-[#929294] text-sm">Fetching plans...</p>
                    </div>
                ) : isError ? (
                    <p className="text-red-400 text-sm mt-10">
                        Failed to load plans. Please refresh and try again.
                    </p>
                ) : (
                    <div className={`grid gap-6 w-full ${plans.length === 1 ? "max-w-xs" : plans.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-2xl" : "grid-cols-1 md:grid-cols-3"}`}>
                        {plans.map((plan, index) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                index={index}
                                isLoading={subscribing}
                                onChoose={handleChoosePlan}
                            />
                        ))}
                    </div>
                )}

                {/* Footer note */}
                <p className="text-[#555] text-xs mt-10 text-center">
                    No hidden fees · Cancel anytime · Secure payments via Razorpay
                </p>
            </div>
        </div>
    )
}

export default page