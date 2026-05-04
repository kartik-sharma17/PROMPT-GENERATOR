"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Check,
    Sparkles,
    Loader2,
    AlertCircle,
    Zap,
    ArrowLeft,
    CreditCard,
} from "lucide-react";
import {
    useGetPlansQuery,
    useSubscribeMutation,
    useVerifyPaymentMutation,
} from "@/reduxConfig/service/subscriptionService";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/reduxConfig/slice/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────
interface Plan {
    id: string;
    name: string;
    price: number;
    duration: number;
    dailyLimit: number;
}

// ── Plan metadata per index position ────────────────────────────────────────
const PLAN_META: Record<
    number,
    { description: string; popular: boolean; badge?: string; extraFeatures: string[] }
> = {
    0: {
        description: "Perfect for getting started",
        popular: false,
        extraFeatures: ["Email support", "Basic analytics"],
    },
    1: {
        description: "For power users and creators",
        popular: true,
        badge: "Best Value",
        extraFeatures: ["Priority support", "Prompt history", "Team sharing"],
    },
    2: {
        description: "For teams and organizations",
        popular: false,
        extraFeatures: ["Priority support", "API access", "SSO integration", "Dedicated support"],
    },
};

const buildFeatures = (plan: Plan, index: number): string[] => {
    const meta = PLAN_META[index] ?? PLAN_META[0];
    return [
        `${plan.dailyLimit} prompts per day`,
        `${plan.duration} month${plan.duration > 1 ? "s" : ""} access`,
        "Advanced AI optimization",
        "All AI models",
        ...meta!.extraFeatures,
    ];
};

// ── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div
        className="relative rounded-2xl p-8 animate-pulse"
        style={{
            background: "#0d0d0d",
            border: "1px solid #1e1e1e",
        }}
    >
        <div className="h-7 w-24 rounded-lg mb-2" style={{ background: "#1a1a1a" }} />
        <div className="h-4 w-40 rounded mb-8" style={{ background: "#141414" }} />
        <div className="h-14 w-32 rounded-lg mb-8" style={{ background: "#1a1a1a" }} />
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 mb-4">
                <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: "rgba(0,229,122,0.1)" }} />
                <div className="h-4 rounded flex-1" style={{ background: "#141414" }} />
            </div>
        ))}
        <div className="h-12 rounded-xl mt-8" style={{ background: "#1a1a1a" }} />
    </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const ChoosePlanPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state: any) => state.auth.user);

    const { data: plansData, isLoading, isError, refetch } = useGetPlansQuery({});
    const [subscribe] = useSubscribeMutation();
    const [verifyPayment] = useVerifyPaymentMutation();

    const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
    const [isYearly, setIsYearly] = useState(false);

    const plans: Plan[] = plansData?.data ?? [];

    const getDisplayPrice = (price: number) =>
        isYearly ? Math.round(price * 12 * 0.8) : price;

    const handleSelectPlan = async (plan: Plan) => {
        try {
            setProcessingPlanId(plan.id);

            const orderRes = await subscribe(plan.id).unwrap();

            console.log(orderRes)

            if (!orderRes?.data) {
                toast.error("Failed to create order. Please try again.");
                return;
            }

            const { order_id, amount, currency, key } = orderRes.data;

            const razorpay = new (window as any).Razorpay({
                key: key,
                amount: amount,
                currency: currency ?? "INR",
                name: "Prompter",
                description: `${plan.name} Plan – ${plan.duration} month(s)`,
                order_id: order_id,
                prefill: {
                    name: user?.name ?? "",
                    email: user?.email ?? "",
                },
                theme: { color: "#00e57a" },
                handler: async (response: any) => {
                    try {
                        const verifyRes = await verifyPayment({
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            razorpayResponse: response,
                        }).unwrap();

                        if (verifyRes?.status) {
                            if (verifyRes?.data?.subscriptionDetails) {
                                dispatch(
                                    setCredentials({
                                        user: user,
                                        token: user?.token,
                                        subscriptionDetails: verifyRes.data.subscriptionDetails,
                                    })
                                );
                            }
                            toast.success("🎉 Subscription activated successfully!");
                            router.replace("/my-plan");
                        } else {
                            toast.error(verifyRes?.message || "Payment verification failed.");
                        }
                    } catch (err: any) {
                        toast.error(err?.data?.detail?.message ?? "Something went wrong. Please try again.");
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.info("Payment cancelled.");
                        setProcessingPlanId(null);
                    },
                },
            });

            razorpay.open();
        } catch (err: any) {
            toast.error(err?.data?.detail?.message ?? "Something went wrong. Please try again.");
        } finally {
            setProcessingPlanId(null);
        }
    };

    const colsClass =
        plans.length === 1
            ? "max-w-sm mx-auto"
            : plans.length === 2
                ? "md:grid-cols-2 max-w-3xl mx-auto"
                : "md:grid-cols-3 max-w-6xl mx-auto";

    return (
        <div
            className="min-h-screen relative overflow-x-hidden"
            style={{
                background: "#0a0a0a",
                backgroundImage: `radial-gradient(circle at 50% 0%, rgba(0,229,122,0.06) 0%, transparent 60%),
                  radial-gradient(circle at 80% 80%, rgba(0,229,122,0.03) 0%, transparent 40%)`
            }}
        >
            {/* ── Floating particles ──────────────────────────────────────────── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 18 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() > 0.5 ? 3 : 2,
                            height: Math.random() > 0.5 ? 3 : 2,
                            backgroundColor: `rgba(0,229,122,${0.08 + Math.random() * 0.15})`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{ y: [-10, 10, -10], opacity: [0.2, 0.5, 0.2] }}
                        transition={{
                            duration: 4 + Math.random() * 4,
                            delay: Math.random() * 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
                {/* ── Back link ──────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-12"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-[#929294] hover:text-[#00e57a] transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </motion.div>

                {/* ── Header ─────────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
                        style={{
                            background: "rgba(0,229,122,0.08)",
                            border: "1px solid rgba(0,229,122,0.2)",
                            color: "#00e57a",
                        }}
                    >
                        <CreditCard className="w-3.5 h-3.5" />
                        Choose Your Plan
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-5 text-white leading-tight">
                        Unlock Your{" "}
                        <span
                            style={{
                                background: "linear-gradient(135deg, #00e57a 0%, #34d399 60%, #22d3ee 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Full Potential
                        </span>
                    </h1>
                    <p className="text-lg text-[#929294] max-w-xl mx-auto">
                        Choose the plan that fits your workflow. Cancel or upgrade anytime.
                    </p>

                    {/* Billing toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={`text-sm transition-colors ${!isYearly ? "text-white" : "text-[#929294]"}`}>
                            Monthly
                        </span>
                        <motion.button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-8 rounded-full p-1 focus:outline-none"
                            style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Toggle billing cycle"
                        >
                            <motion.div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: "#00e57a" }}
                                animate={{ x: isYearly ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </motion.button>
                        <span className={`text-sm transition-colors ${isYearly ? "text-white" : "text-[#929294]"}`}>
                            Yearly{" "}
                            <span className="ml-1 text-xs font-semibold text-[#00e57a]">Save 20%</span>
                        </span>
                    </div>
                </motion.div>

                {/* ── Loading ─────────────────────────────────────────────────────── */}
                {isLoading && (
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}

                {/* ── Error ───────────────────────────────────────────────────────── */}
                {isError && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 gap-4"
                    >
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                        >
                            <AlertCircle className="w-7 h-7 text-red-400" />
                        </div>
                        <p className="text-red-400 font-medium">Failed to load plans</p>
                        <button
                            onClick={() => refetch()}
                            className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
                            style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}

                {/* ── Plan cards ──────────────────────────────────────────────────── */}
                {!isLoading && !isError && plans.length > 0 && (
                    <div className={`grid gap-8 ${colsClass}`}>
                        {plans.map((plan: Plan, index: number) => {
                            const meta = PLAN_META[index] ?? { description: "Great value plan", popular: false, extraFeatures: [] };
                            const displayPrice = getDisplayPrice(plan.price);
                            const features = buildFeatures(plan, index);
                            const isProcessing = processingPlanId === plan.id;

                            return (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                                    whileHover={{ y: -8 }}
                                    className="relative rounded-2xl p-8 flex flex-col"
                                    style={{
                                        background: meta.popular ? "#0d0d0d" : "#111111",
                                        border: meta.popular
                                            ? "1px solid rgba(0,229,122,0.35)"
                                            : "1px solid #1e1e1e",
                                        boxShadow: meta.popular
                                            ? "0 0 40px rgba(0,229,122,0.08), 0 20px 60px rgba(0,0,0,0.5)"
                                            : "0 8px 32px rgba(0,0,0,0.4)",
                                    }}
                                >
                                    {/* Popular badge */}
                                    {meta.popular && (
                                        <motion.div
                                            className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap"
                                            style={{ backgroundColor: "#00e57a", color: "#0a0a0a" }}
                                            animate={{
                                                boxShadow: [
                                                    "0 0 15px rgba(0,229,122,0.25)",
                                                    "0 0 28px rgba(0,229,122,0.55)",
                                                    "0 0 15px rgba(0,229,122,0.25)",
                                                ],
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                            {meta.badge ?? "Most Popular"}
                                        </motion.div>
                                    )}

                                    {/* Title */}
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                                        <p className="text-sm text-[#929294]">{meta.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-8">
                                        <motion.div
                                            key={isYearly ? "yearly" : "monthly"}
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className="flex items-baseline gap-1"
                                        >
                                            <span className="text-5xl font-bold text-white">₹{displayPrice}</span>
                                            <span className="text-[#929294] text-sm ml-1">
                                                /{isYearly ? "year" : "month"}
                                            </span>
                                        </motion.div>
                                        {isYearly && plan.price > 0 && (
                                            <p className="text-xs text-[#555] mt-1">
                                                ≈ ₹{Math.round(displayPrice / 12)}/mo · billed annually
                                            </p>
                                        )}
                                        {plan.price === 0 && (
                                            <p className="text-xs text-[#00e57a] mt-1 font-medium">Free forever</p>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3.5 mb-8 flex-1">
                                        {features.map((feature: string, i: number) => (
                                            <motion.li
                                                key={feature}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.12 + i * 0.07 + 0.3 }}
                                                className="flex items-center gap-3 text-sm text-white"
                                            >
                                                <div
                                                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                                                    style={{ backgroundColor: "rgba(0,229,122,0.12)" }}
                                                >
                                                    <Check className="w-3 h-3 text-[#00e57a]" />
                                                </div>
                                                {feature}
                                            </motion.li>
                                        ))}
                                    </ul>

                                    {/* CTA button */}
                                    <motion.button
                                        onClick={() => handleSelectPlan(plan)}
                                        disabled={!!processingPlanId}
                                        whileHover={!processingPlanId ? { scale: 1.02 } : {}}
                                        whileTap={!processingPlanId ? { scale: 0.98 } : {}}
                                        className="w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                                        style={
                                            meta.popular
                                                ? {
                                                    background: "#00e57a",
                                                    color: "#0a0a0a",
                                                    boxShadow: "0 0 24px rgba(0,229,122,0.25)",
                                                }
                                                : {
                                                    background: "#1a1a1a",
                                                    color: "white",
                                                    border: "1px solid #2a2a2a",
                                                }
                                        }
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing…
                                            </>
                                        ) : (
                                            <>
                                                {meta.popular && <Zap className="w-4 h-4" />}
                                                {plan.price === 0 ? "Start for Free" : "Subscribe Now"}
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* ── Footer note ─────────────────────────────────────────────────── */}
                {!isLoading && !isError && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-center text-xs text-[#555] mt-12"
                    >
                        Secure payments powered by Razorpay · Cancel anytime · No hidden fees
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default ChoosePlanPage;