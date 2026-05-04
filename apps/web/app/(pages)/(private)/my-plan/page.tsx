"use client";

import { motion } from "framer-motion";
import {
  Zap,
  CalendarDays,
  Clock,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

// ── Types ────────────────────────────────────────────────────────────────────
interface SubscriptionDetails {
  planId?: string;
  planName?: string;
  planPrice?: number;
  planDuration?: number;
  planDailyLimit?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const getDaysRemaining = (endDate?: string): number => {
  if (!endDate) return 0;
  const end = new Date(endDate).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
};

const getProgressPercent = (start?: string, end?: string): number => {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const now = Date.now();
  if (e <= s) return 100;
  return Math.min(100, Math.max(0, Math.round(((now - s) / (e - s)) * 100)));
};

// ── Floating dot ─────────────────────────────────────────────────────────────
const Dot = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.span
    className="absolute rounded-full pointer-events-none"
    style={{
      width: 2.5,
      height: 2.5,
      background: "color-mix(in srgb, var(--theme-primary-raw) 25%, transparent)",
      top: y,
      left: x,
    }}
    animate={{ y: [0, -12, 0], opacity: [0.15, 0.55, 0.15] }}
    transition={{ duration: 4 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);
const DOTS = Array.from({ length: 20 }, (_, i) => ({
  delay: (i * 0.43) % 3,
  x: `${(i * 13 + 5) % 100}%`,
  y: `${(i * 17 + 7) % 100}%`,
}));

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({
  icon,
  label,
  value,
  sub,
  accent,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="rounded-2xl p-6 flex flex-col gap-3"
    style={{
      background: "rgba(10,22,15,0.7)",
      border: accent
        ? "1px solid color-mix(in srgb, var(--theme-primary-raw) 25%, transparent)"
        : "1px solid color-mix(in srgb, var(--theme-primary-raw) 8%, transparent)",
      backdropFilter: "blur(16px)",
      boxShadow: accent
        ? "0 0 24px color-mix(in srgb, var(--theme-primary-raw) 8%, transparent), 0 8px 24px rgba(0,0,0,0.3)"
        : "0 4px 16px rgba(0,0,0,0.25)",
    }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center"
      style={{
        background: accent
          ? "color-mix(in srgb, var(--theme-primary-raw) 15%, transparent)"
          : "rgba(255,255,255,0.05)",
      }}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium mb-1" style={{ color: "#6b8a7a" }}>
        {label}
      </p>
      <p className="text-xl font-bold text-white">{value}</p>
      {sub && (
        <p className="text-xs mt-0.5" style={{ color: "#4a7060" }}>
          {sub}
        </p>
      )}
    </div>
  </motion.div>
);

// ── No subscription state ────────────────────────────────────────────────────
const NoSubscription = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div
      className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
      style={{
        background: "color-mix(in srgb, var(--theme-primary-raw) 8%, transparent)",
        border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 15%, transparent)",
        boxShadow: "0 0 30px color-mix(in srgb, var(--theme-primary-raw) 6%, transparent)",
      }}
    >
      <Zap className="w-8 h-8 opacity-60" style={{ color: "var(--theme-primary-raw)" }} />
    </div>
    <h2 className="text-2xl font-bold text-white mb-3">No Active Plan</h2>
    <p className="text-sm max-w-sm mb-8" style={{ color: "#6b8a7a" }}>
      You don&apos;t have an active subscription yet. Choose a plan to unlock full
      access to Prompter.
    </p>
    <Link href="/choose-plan">
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
        style={{
          background:
            "linear-gradient(135deg, var(--theme-primary-raw) 0%, color-mix(in srgb, var(--theme-primary-raw) 50%, white) 100%)",
          color: "#011a0d",
          boxShadow: "0 0 24px color-mix(in srgb, var(--theme-primary-raw) 30%, transparent)",
        }}
      >
        <Sparkles className="w-4 h-4" />
        Browse Plans
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </Link>
  </motion.div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const MyPlanPage = () => {
  const subscription: SubscriptionDetails | null = useSelector(
    (state: any) => state.auth.subscriptionDetails
  );

  const daysRemaining = useMemo(
    () => getDaysRemaining(subscription?.endDate),
    [subscription?.endDate]
  );
  const progress = useMemo(
    () => getProgressPercent(subscription?.startDate, subscription?.endDate),
    [subscription?.startDate, subscription?.endDate]
  );

  const router = useRouter()

  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: "#080e0a" }}
    >
      {/* ── Background ──────────────────────────────────────────────────── */}
      <div
        className="absolute top-0 inset-x-0 h-80 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, color-mix(in srgb, var(--theme-primary-raw) 7%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {DOTS.map((d, i) => (
          <Dot key={i} {...d} />
        ))}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors group"
            style={{ color: "#6b8a7a" }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span
              className="transition-colors"
              style={{ color: "inherit" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "var(--theme-primary-raw)")
              }
              onClick={() => { router.back() }}
            >
              Back to Home
            </span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "color-mix(in srgb, var(--theme-primary-raw) 12%, transparent)",
                border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 20%, transparent)",
              }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: "var(--theme-primary-raw)" }} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">My Plan</h1>
          </div>
          <p className="text-sm ml-[52px]" style={{ color: "#6b8a7a" }}>
            Manage your subscription and usage
          </p>
        </motion.div>

        {/* ── No subscription ──────────────────────────────────────────── */}
        {!subscription || !subscription.isActive ? (
          <NoSubscription />
        ) : (
          <>
            {/* ── Active plan hero card ────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="relative rounded-3xl overflow-hidden mb-6"
              style={{
                background: "rgba(8, 18, 12, 0.9)",
                border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 22%, transparent)",
                boxShadow:
                  "0 0 60px color-mix(in srgb, var(--theme-primary-raw) 8%, transparent), 0 24px 64px rgba(0,0,0,0.4)",
              }}
            >
              {/* Accent bar */}
              <div
                className="h-0.5 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in srgb, var(--theme-primary-raw) 70%, transparent), transparent)",
                }}
              />

              <div className="p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  {/* Plan name & status */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: subscription.isActive
                            ? "color-mix(in srgb, var(--theme-primary-raw) 12%, transparent)"
                            : "rgba(239,68,68,0.1)",
                          border: subscription.isActive
                            ? "1px solid color-mix(in srgb, var(--theme-primary-raw) 25%, transparent)"
                            : "1px solid rgba(239,68,68,0.2)",
                          color: subscription.isActive
                            ? "var(--theme-primary-raw)"
                            : "#f87171",
                        }}
                      >
                        {subscription.isActive ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {subscription.isActive ? "Active" : "Expired"}
                      </span>

                      {isExpiringSoon && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            background: "rgba(251,191,36,0.1)",
                            border: "1px solid rgba(251,191,36,0.25)",
                            color: "#fbbf24",
                          }}
                        >
                          Expiring soon
                        </span>
                      )}
                    </div>

                    <h2
                      className="text-4xl font-bold mb-2"
                      style={{
                        background:
                          "linear-gradient(135deg, #ecfdf5 0%, var(--theme-primary-raw) 60%, color-mix(in srgb, var(--theme-primary-raw) 50%, white) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {subscription.planName ?? "Current Plan"}
                    </h2>

                    <p className="text-sm" style={{ color: "#6b8a7a" }}>
                      {subscription.planDuration} month
                      {(subscription.planDuration ?? 0) > 1 ? "s" : ""} subscription
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-4xl font-bold text-white">
                        ₹{subscription.planPrice ?? 0}
                      </span>
                      <span className="text-sm" style={{ color: "#6b8a7a" }}>
                        /month
                      </span>
                    </div>
                    {(subscription.planPrice ?? 0) === 0 && (
                      <p className="text-xs mt-1" style={{ color: "var(--theme-primary-raw)" }}>
                        Free plan
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Timeline progress ──────────────────────────────── */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium" style={{ color: "#6b8a7a" }}>
                      Subscription period
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color:
                          daysRemaining > 0 ? "var(--theme-primary-raw)" : "#f87171",
                      }}
                    >
                      {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expired"}
                    </span>
                  </div>
                  {/* Track */}
                  <div
                    className="relative h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background:
                          progress > 80
                            ? "linear-gradient(90deg, var(--theme-primary-raw), #fbbf24)"
                            : "linear-gradient(90deg, var(--theme-primary-raw), color-mix(in srgb, var(--theme-primary-raw) 50%, white))",
                        boxShadow:
                          "0 0 8px color-mix(in srgb, var(--theme-primary-raw) 40%, transparent)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs" style={{ color: "#4a7060" }}>
                      {formatDate(subscription.startDate)}
                    </span>
                    <span className="text-xs" style={{ color: "#4a7060" }}>
                      {formatDate(subscription.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Stats grid ──────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={
                  <BarChart3 className="w-5 h-5" style={{ color: "var(--theme-primary-raw)" }} />
                }
                label="Daily Prompt Limit"
                value={subscription.planDailyLimit ?? "—"}
                sub="prompts per day"
                accent
                delay={0.1}
              />
              <StatCard
                icon={<Clock className="w-5 h-5 text-[#7fbfb0]" />}
                label="Days Remaining"
                value={daysRemaining}
                sub={daysRemaining === 1 ? "day left" : "days left"}
                delay={0.18}
              />
              <StatCard
                icon={<CalendarDays className="w-5 h-5 text-[#7fbfb0]" />}
                label="Start Date"
                value={
                  subscription.startDate
                    ? new Date(subscription.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })
                    : "—"
                }
                sub={
                  subscription.startDate
                    ? new Date(subscription.startDate).getFullYear().toString()
                    : undefined
                }
                delay={0.25}
              />
              <StatCard
                icon={<CalendarDays className="w-5 h-5 text-[#7fbfb0]" />}
                label="End Date"
                value={
                  subscription.endDate
                    ? new Date(subscription.endDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })
                    : "—"
                }
                sub={
                  subscription.endDate
                    ? new Date(subscription.endDate).getFullYear().toString()
                    : undefined
                }
                delay={0.32}
              />
            </div>

            {/* ── CTA row ─────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.45 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/choose-plan" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--theme-primary-raw) 0%, color-mix(in srgb, var(--theme-primary-raw) 50%, white) 100%)",
                    color: "#011a0d",
                    boxShadow:
                      "0 0 24px color-mix(in srgb, var(--theme-primary-raw) 25%, transparent)",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Upgrade Plan
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              <Link href="/choose-plan" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  style={{
                    background: "rgba(10,22,15,0.7)",
                    border:
                      "1px solid color-mix(in srgb, var(--theme-primary-raw) 18%, transparent)",
                    color: "#ecfdf5",
                  }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Renew Plan
                </motion.button>
              </Link>
            </motion.div>

            {/* ── Features included ────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.45 }}
              className="mt-6 rounded-2xl p-6"
              style={{
                background: "rgba(10,22,15,0.6)",
                border:
                  "1px solid color-mix(in srgb, var(--theme-primary-raw) 7%, transparent)",
              }}
            >
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: "var(--theme-primary-raw)" }}
                />
                What's included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  `${subscription.planDailyLimit} prompts per day`,
                  `${subscription.planDuration} month${(subscription.planDuration ?? 0) > 1 ? "s" : ""} full access`,
                  "Advanced AI optimization",
                  "All AI models supported",
                  "Prompt history & tracking",
                  "Priority support",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          "color-mix(in srgb, var(--theme-primary-raw) 12%, transparent)",
                      }}
                    >
                      <CheckCircle2
                        className="w-3 h-3"
                        style={{ color: "var(--theme-primary-raw)" }}
                      />
                    </div>
                    <span className="text-sm" style={{ color: "#9bbfb0" }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPlanPage;