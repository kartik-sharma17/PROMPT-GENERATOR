import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for trying out Prompter",
    features: [
      "50 prompts per month",
      "Basic optimization",
      "3 AI models",
      "Email support",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "For power users and creators",
    features: [
      "Unlimited prompts",
      "Advanced optimization",
      "All AI models",
      "Priority support",
      "Prompt history",
      "Team sharing",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 99,
    yearlyPrice: 990,
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Custom AI models",
      "API access",
      "SSO integration",
      "Dedicated support",
      "Custom training",
    ],
  },
];

export const PricingSection = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section ref={ref} className="relative py-32">
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
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

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm ${
                !isYearly ? "text-[#ecfdf5]" : "text-[#7fbfb0]"
              }`}
            >
              Monthly
            </span>

            <motion.button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-8 rounded-full p-1"
              style={{ backgroundColor: "#15352a" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: "#00ffaa" }}
                animate={{ x: isYearly ? 24 : 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            </motion.button>

            <span
              className={`text-sm ${
                isYearly ? "text-[#ecfdf5]" : "text-[#7fbfb0]"
              }`}
            >
              Yearly
              <span className="ml-1 text-xs font-medium text-[#00ffaa]">
                Save 20%
              </span>
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: "easeOut",
              }}
              whileHover={{ y: -12 }}
              className={`relative glass-card p-8 ${
                plan.popular ? "neon-glow-box" : ""
              }`}
              style={
                plan.popular
                  ? { borderColor: "rgba(0,255,170,0.4)" }
                  : undefined
              }
            >
              {/* Popular badge */}
              {plan.popular && (
                <motion.div
                  className="
                    absolute -top-4 left-1/2 -translate-x-1/2
                    px-4 py-1.5 rounded-full
                    text-sm font-medium flex items-center gap-1.5 shimmer
                  "
                  style={{
                    backgroundColor: "#00ffaa",
                    color: "#022014",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 15px rgba(0,255,170,0.3)",
                      "0 0 25px rgba(0,255,170,0.5)",
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
                <h3 className="text-2xl font-bold mb-2 text-[#ecfdf5]">
                  {plan.name}
                </h3>
                <p className="text-sm text-[#7fbfb0]">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <motion.div
                  key={isYearly ? "yearly" : "monthly"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  className="flex items-baseline gap-1"
                >
                  <span className="text-5xl font-bold text-[#ecfdf5]">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-[#7fbfb0]">
                    /{isYearly ? "year" : "month"}
                  </span>
                </motion.div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      delay: index * 0.15 + i * 0.1 + 0.3,
                    }}
                    className="flex items-center gap-3 text-sm text-[#ecfdf5]"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(0,255,170,0.2)" }}
                    >
                      <Check className="w-3 h-3 text-[#00ffaa]" />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-semibold transition-all"
                style={
                  plan.popular
                    ? {
                        backgroundColor: "#00ffaa",
                        color: "#022014",
                        boxShadow:
                          "0 0 20px rgba(0,255,170,0.25)",
                      }
                    : {
                        backgroundColor: "#15352a",
                        color: "#ecfdf5",
                      }
                }
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
