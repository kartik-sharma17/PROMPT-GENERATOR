"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, RotateCcw, CheckCircle2 } from "lucide-react"

// ── Floating dot (matches signup page) ───────────────────────────────────────
const Dot = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.span
    className="absolute rounded-full pointer-events-none"
    style={{ width: 2.5, height: 2.5, background: "rgba(0,255,170,0.3)", top: y, left: x }}
    animate={{ y: [0, -14, 0], opacity: [0.15, 0.65, 0.15] }}
    transition={{ duration: 4.5 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
  />
)

const DOTS = Array.from({ length: 22 }, (_, i) => ({
  delay: (i * 0.41) % 3.5,
  x: `${(i * 11 + 9) % 100}%`,
  y: `${(i * 19 + 3) % 100}%`,
}))

// ── Circular progress timer ───────────────────────────────────────────────────
const CircleTimer = ({ timeLeft, total }: { timeLeft: number; total: number }) => {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const progress = (timeLeft / total) * circumference

  return (
    <svg width="72" height="72" className="rotate-[-90deg]">
      {/* Track */}
      <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(0,255,170,0.08)" strokeWidth="3" />
      {/* Progress */}
      <circle
        cx="36" cy="36" r={radius}
        fill="none"
        stroke="url(#timerGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      <defs>
        <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00ffaa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const TOTAL_TIME = 120

const VerifyPage = () => {
  const searchParams = useSearchParams()
  const mail = searchParams.get("email") || "your email"

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [canResend, setCanResend] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true)
      return
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleResend = () => {
    if (!canResend) return
    setResent(true)
    setCanResend(false)
    setTimeLeft(TOTAL_TIME)
    setTimeout(() => setResent(false), 3000)
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const secs = String(timeLeft % 60).padStart(2, "0")

  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{ background: "#080e0a" }}
    >
      {/* ── Ambient glows ─────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 60% 0%, rgba(34,211,238,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-0 left-0 w-80 h-80 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,170,0.05) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,170,0.04) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* ── Floating dots ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {DOTS.map((d, i) => (
          <Dot key={i} {...d} />
        ))}
      </div>

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(10, 20, 14, 0.85)",
            border: "1px solid rgba(0,255,170,0.13)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 0 0 1px rgba(0,255,170,0.04), 0 24px 64px rgba(0,0,0,0.55), 0 0 80px rgba(0,255,170,0.03)",
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-0.5 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(34,211,238,0.5), rgba(0,255,170,0.5), transparent)",
            }}
          />

          <div className="px-8 py-10 flex flex-col items-center text-center">

            {/* ── Animated mail icon ──────────────────────────────────────── */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 240 }}
              className="relative mb-6"
            >
              {/* Pulse rings */}
              {[1, 2].map(i => (
                <motion.span
                  key={i}
                  className="absolute inset-0 rounded-2xl"
                  style={{ border: "1px solid rgba(0,255,170,0.2)" }}
                  animate={{ scale: [1, 1.35 + i * 0.1], opacity: [0.4, 0] }}
                  transition={{ duration: 2.2, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
                />
              ))}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(0,255,170,0.18), rgba(34,211,238,0.1))",
                  border: "1px solid rgba(0,255,170,0.25)",
                  boxShadow: "0 0 24px rgba(0,255,170,0.14)",
                }}
              >
                <Mail className="w-7 h-7 text-[#00ffaa]" />
              </div>
            </motion.div>

            {/* Status badge */}
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{
                background: "rgba(0,255,170,0.07)",
                border: "1px solid rgba(0,255,170,0.18)",
                color: "#00ffaa",
              }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00ffaa] animate-pulse" />
              Email Sent
            </motion.span>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-2 tracking-tight"
            >
              Verify Your Account
            </motion.h1>

            {/* Sub-text with dynamic email */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="text-sm mb-2"
              style={{ color: "#6b8a7a" }}
            >
              We sent a verification link to
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
              className="text-sm font-semibold mb-8 px-3 py-1.5 rounded-lg"
              style={{
                color: "#00ffaa",
                background: "rgba(0,255,170,0.07)",
                border: "1px solid rgba(0,255,170,0.14)",
                wordBreak: "break-all",
              }}
            >
              {mail}
            </motion.p>

            {/* ── Timer ring ──────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative flex items-center justify-center mb-8"
            >
              <CircleTimer timeLeft={timeLeft} total={TOTAL_TIME} />
              <div className="absolute flex flex-col items-center leading-none">
                <span className="text-sm font-bold text-white tabular-nums">
                  {mins}:{secs}
                </span>
                <span className="text-[9px] mt-0.5" style={{ color: "#3d5a4a" }}>
                  resend in
                </span>
              </div>
            </motion.div>

            {/* ── Resend button ────────────────────────────────────────────── */}
            <motion.button
              onClick={handleResend}
              disabled={!canResend}
              whileHover={canResend ? { scale: 1.015 } : {}}
              whileTap={canResend ? { scale: 0.985 } : {}}
              className="relative w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 overflow-hidden transition-all"
              style={
                canResend
                  ? {
                      background: "linear-gradient(135deg, #00ffaa 0%, #22d3ee 100%)",
                      color: "#011a0d",
                      boxShadow: "0 0 28px rgba(0,255,170,0.28), 0 4px 12px rgba(0,0,0,0.3)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "#3d5a4a",
                      border: "1px solid rgba(255,255,255,0.06)",
                      cursor: "not-allowed",
                    }
              }
            >
              {/* Shimmer on active */}
              {canResend && (
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                />
              )}

              {resent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Email Resent!
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  {canResend ? "Resend Verification Link" : `Resend available in ${mins}:${secs}`}
                </>
              )}
            </motion.button>

            {/* Footer hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mt-6 text-xs"
              style={{ color: "#3d5a4a" }}
            >
              Didn&apos;t receive it? Check your spam folder.
            </motion.p>
          </div>
        </div>

        {/* Outer glow ring */}
        <div
          className="absolute -inset-px rounded-3xl pointer-events-none"
          style={{ boxShadow: "0 0 0 1px rgba(0,255,170,0.05)" }}
        />
      </motion.div>
    </div>
  )
}

export default VerifyPage