"use client";

import { CustomInput } from "@/@core";
import { useForgotPasswordSendLinkMutation } from "@/reduxConfig/service/authService";
import { useFormik } from "formik";
import { LoaderCircle, Zap, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { useState } from "react";

// ── Zod schema ────────────────────────────────────────────────────────────────
const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// ── Floating dot ──────────────────────────────────────────────────────────────
const Dot = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.span
    className="absolute rounded-full pointer-events-none"
    style={{
      width: 3,
      height: 3,
      background: "color-mix(in srgb, var(--theme-primary-raw) 35%, transparent)",
      top: y,
      left: x,
    }}
    animate={{ y: [0, -16, 0], opacity: [0.2, 0.7, 0.2] }}
    transition={{ duration: 4 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const DOTS = Array.from({ length: 24 }, (_, i) => ({
  delay: (i * 0.37) % 3,
  x: `${(i * 13 + 7) % 100}%`,
  y: `${(i * 17 + 5) % 100}%`,
}));

// ── Page ──────────────────────────────────────────────────────────────────────
const ForgotPasswordPage = () => {
  const [sendLink, { isLoading }] = useForgotPasswordSendLinkMutation();
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: toFormikValidationSchema(forgotSchema),
    onSubmit: async (values) => {
      try {
        const response = await sendLink(values.email).unwrap();
        toast.success(response?.message || "Reset link sent! Check your inbox.");
        setSentTo(values.email);
        setEmailSent(true);
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong. Please try again.");
      }
    },
  });

  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden"
      style={{ background: "#080e0a" }}
    >
      {/* ── Ambient glow ──────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--theme-primary-raw) 10%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--theme-primary-raw) 6%, transparent) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Floating dots ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {DOTS.map((d, i) => (
          <Dot key={i} {...d} />
        ))}
      </div>

      {/* ── Card ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(10, 20, 14, 0.85)",
            border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 14%, transparent)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 0 0 1px color-mix(in srgb, var(--theme-primary-raw) 4%, transparent), 0 24px 64px rgba(0,0,0,0.55), 0 0 80px color-mix(in srgb, var(--theme-primary-raw) 4%, transparent)",
          }}
        >
          {/* Top accent bar */}
          <div
            className="h-0.5 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in srgb, var(--theme-primary-raw) 60%, transparent), transparent)",
            }}
          />

          <div className="px-8 py-10">
            <AnimatePresence mode="wait">
              {emailSent ? (
                /* ── Success state ──────────────────────────────────────── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, delay: 0.1 }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: "color-mix(in srgb, var(--theme-primary-raw) 12%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 28%, transparent)",
                      boxShadow: "0 0 32px color-mix(in srgb, var(--theme-primary-raw) 14%, transparent)",
                    }}
                  >
                    <CheckCircle2 className="w-9 h-9" style={{ color: "var(--theme-primary-raw)" }} />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-white mb-2">Check your inbox</h2>
                  <p className="text-sm mb-3" style={{ color: "#6b8a7a" }}>
                    We sent a password reset link to
                  </p>
                  <p
                    className="text-sm font-semibold px-3 py-1.5 rounded-lg mb-6"
                    style={{
                      color: "var(--theme-primary-raw)",
                      background: "color-mix(in srgb, var(--theme-primary-raw) 7%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 14%, transparent)",
                      wordBreak: "break-all",
                    }}
                  >
                    {sentTo}
                  </p>
                  <p className="text-xs" style={{ color: "#3d5a4a" }}>
                    Didn&apos;t get it? Check your spam folder or{" "}
                    <button
                      onClick={() => { setEmailSent(false); formik.resetForm(); }}
                      className="underline"
                      style={{ color: "var(--theme-primary-raw)" }}
                    >
                      try again
                    </button>
                    .
                  </p>
                </motion.div>
              ) : (
                /* ── Form state ─────────────────────────────────────────── */
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Header */}
                  <div className="flex flex-col items-center mb-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 260 }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in srgb, var(--theme-primary-raw) 18%, transparent), color-mix(in srgb, var(--theme-primary-raw) 8%, transparent))",
                        border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 25%, transparent)",
                        boxShadow: "0 0 20px color-mix(in srgb, var(--theme-primary-raw) 12%, transparent)",
                      }}
                    >
                      <Zap className="w-5 h-5" style={{ color: "var(--theme-primary-raw)" }} />
                    </motion.div>

                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
                      style={{
                        background: "color-mix(in srgb, var(--theme-primary-raw) 7%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--theme-primary-raw) 18%, transparent)",
                        color: "var(--theme-primary-raw)",
                      }}
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: "var(--theme-primary-raw)" }}
                      />
                      Password Reset
                    </span>
                  </div>

                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
                      Forgot your password?
                    </h1>
                    <p className="text-sm" style={{ color: "#6b8a7a" }}>
                      Enter your email and we&apos;ll send you a reset link.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={formik.handleSubmit}>
                    {/* Email — using CustomInput HOC */}
                    <CustomInput
                      customClass="w-full"
                      name="email"
                      placeholder="Enter your email"
                      formik={formik}
                      label="Email Address"
                    />

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.015 } : {}}
                      whileTap={!isLoading ? { scale: 0.985 } : {}}
                      className="relative w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 overflow-hidden transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--theme-primary-raw) 0%, color-mix(in srgb, var(--theme-primary-raw) 50%, white) 100%)",
                        color: "#011a0d",
                        boxShadow:
                          "0 0 28px color-mix(in srgb, var(--theme-primary-raw) 28%, transparent), 0 4px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      {!isLoading && (
                        <motion.span
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                          }}
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                        />
                      )}
                      {isLoading && <LoaderCircle className="w-4 h-4 animate-spin" />}
                      {isLoading ? "Sending link…" : "Send Reset Link"}
                    </motion.button>
                  </form>

                  {/* Divider + back to login */}
                  <div className="flex items-center gap-3 my-7">
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <span className="text-xs" style={{ color: "#3d5a4a" }}>or</span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                  </div>

                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#6b8a7a",
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Outer glow ring */}
        <div
          className="absolute -inset-px rounded-3xl pointer-events-none"
          style={{
            boxShadow: "0 0 0 1px color-mix(in srgb, var(--theme-primary-raw) 6%, transparent)",
          }}
        />
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;