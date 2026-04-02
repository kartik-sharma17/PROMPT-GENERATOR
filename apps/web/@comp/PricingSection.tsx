import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Sparkles, Loader2, AlertCircle, Zap } from "lucide-react";
import { useGetPlansQuery } from "@/reduxConfig/service/subscriptionService";
import { useRouter } from "next/navigation";

// Static metadata per position (description, popular badge, extra features)
const PLAN_META: Record<number, { description: string; popular: boolean; extraFeatures: string[] }> = {
  0: {
    description: "Perfect for getting started",
    popular: false,
    extraFeatures: ["Email support", "Basic analytics"],
  },
  1: {
    description: "For power users and creators",
    popular: true,
    extraFeatures: ["Priority support", "Prompt history", "Team sharing"],
  },
  2: {
    description: "For teams and organizations",
    popular: false,
    extraFeatures: ["Priority support", "API access", "SSO integration", "Dedicated support"],
  },
};

const buildFeatures = (plan: any, index: number): string[] => {
  const meta = PLAN_META[index] ?? PLAN_META[0];
  return [
    `${plan.dailyLimit} prompts / day`,
    `${plan.duration} month${plan.duration > 1 ? "s" : ""} access`,
    "Advanced AI optimization",
    "All AI models",
    ...meta.extraFeatures,
  ];
};

// ── Skeleton card shown while loading ──────────────────────────────────────
const SkeletonCard = () => (
  <div className="relative glass-card p-8 animate-pulse">
    <div className="h-7 w-24 rounded-lg mb-2" style={{ background: "rgba(255,255,255,0.06)" }} />
    <div className="h-4 w-40 rounded mb-8" style={{ background: "rgba(255,255,255,0.04)" }} />
    <div className="h-14 w-32 rounded-lg mb-8" style={{ background: "rgba(255,255,255,0.06)" }} />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex gap-3 mb-4">
        <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: "rgba(0,255,170,0.1)" }} />
        <div className="h-4 rounded flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>
    ))}
    <div className="h-11 rounded-xl mt-8" style={{ background: "rgba(255,255,255,0.06)" }} />
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────
export const PricingSection = () => {
  const route = useRouter()
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = useState(false);

  const { data: plansData, isLoading, isError, refetch } = useGetPlansQuery({});
  const plans: any[] = plansData?.data ?? [];

  const getDisplayPrice = (price: number) =>
    isYearly ? Math.round(price * 12 * 0.8) : price;

  const colsClass =
    plans.length === 1
      ? "max-w-sm mx-auto"
      : plans.length === 2
      ? "md:grid-cols-2 max-w-3xl mx-auto"
      : "md:grid-cols-3 max-w-6xl mx-auto";

  return (
    <section ref={ref} className="relative py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-4">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#ecfdf5]">
            Simple,{" "}
            <span className="gradient-text-animated">Transparent</span>{" "}
            Pricing
          </h2>
          <p className="text-xl text-[#7fbfb0] mb-8">
            Start free, upgrade when you need more power
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm transition-colors ${!isYearly ? "text-[#ecfdf5]" : "text-[#7fbfb0]"}`}>
              Monthly
            </span>
            <motion.button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-8 rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffaa]"
              style={{ backgroundColor: "#15352a" }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle billing cycle"
            >
              <motion.div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: "#00ffaa" }}
                animate={{ x: isYearly ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`text-sm transition-colors ${isYearly ? "text-[#ecfdf5]" : "text-[#7fbfb0]"}`}>
              Yearly{" "}
              <span className="ml-1 text-xs font-semibold text-[#00ffaa]">Save 20%</span>
            </span>
          </div>
        </motion.div>

        {/* ── Loading skeletons ─────────────────────────────────────────── */}
        {isLoading && (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* ── Error state ───────────────────────────────────────────────── */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <p className="text-red-400 font-medium">Failed to load plans</p>
            <button
              onClick={() => refetch()}
              className="px-5 py-2 rounded-xl text-sm font-medium text-[#ecfdf5] transition-all hover:scale-105"
              style={{ backgroundColor: "#15352a", border: "1px solid rgba(0,255,170,0.2)" }}
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* ── Plan cards ───────────────────────────────────────────────── */}
        {!isLoading && !isError && plans.length > 0 && (
          <div className={`grid gap-8 ${colsClass}`}>
            {plans.map((plan: any, index: number) => {
              const meta = PLAN_META[index] ?? { description: "Great value plan", popular: false, extraFeatures: [] };
              const displayPrice = getDisplayPrice(plan.price);
              const features = buildFeatures(plan, index);

              return (
                <motion.div
                  key={plan.id ?? index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                  whileHover={{ y: -12 }}
                  className={`relative glass-card p-8 ${meta.popular ? "neon-glow-box" : ""}`}
                  style={meta.popular ? { borderColor: "rgba(0,255,170,0.4)" } : undefined}
                >
                  {/* Popular badge */}
                  {meta.popular && (
                    <motion.div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 shimmer whitespace-nowrap"
                      style={{ backgroundColor: "#00ffaa", color: "#022014" }}
                      animate={{
                        boxShadow: [
                          "0 0 15px rgba(0,255,170,0.3)",
                          "0 0 28px rgba(0,255,170,0.55)",
                          "0 0 15px rgba(0,255,170,0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Most Popular
                    </motion.div>
                  )}

                  {/* Title */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-[#ecfdf5]">{plan.name}</h3>
                    <p className="text-sm text-[#7fbfb0]">{meta.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <motion.div
                      key={isYearly ? "yearly" : "monthly"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex items-baseline gap-1"
                    >
                      <span className="text-5xl font-bold text-[#ecfdf5]">
                        ₹{displayPrice}
                      </span>
                      <span className="text-[#7fbfb0] text-sm">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </motion.div>
                    {isYearly && plan.price > 0 && (
                      <p className="text-xs text-[#7fbfb0] mt-1">
                        ≈ ₹{Math.round(displayPrice / 12)}/mo · billed annually
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3.5 mb-8">
                    {features.map((feature: string, i: number) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.15 + i * 0.08 + 0.3 }}
                        className="flex items-center gap-3 text-sm text-[#ecfdf5]"
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "rgba(0,255,170,0.15)" }}
                        >
                          <Check className="w-3 h-3 text-[#00ffaa]" />
                        </div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.button
                  onClick={()=>{route.push("/choose-plan")}}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    style={
                      meta.popular
                        ? { backgroundColor: "#00ffaa", color: "#022014", boxShadow: "0 0 20px rgba(0,255,170,0.3)" }
                        : { backgroundColor: "#15352a", color: "#ecfdf5", border: "1px solid rgba(0,255,170,0.15)" }
                    }
                  >
                    {meta.popular && <Zap className="w-4 h-4" />}
                    Get Started
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {!isLoading && !isError && plans.length === 0 && (
          <div className="text-center py-20 text-[#7fbfb0]">
            No plans available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};