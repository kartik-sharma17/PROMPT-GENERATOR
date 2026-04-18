"use client";

import { CustomPasswordInput } from "@/@core";
import { useResetPasswordMutation } from "@/reduxConfig/service/authService";
import { useFormik } from "formik";
import { LoaderCircle, Zap, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import { useState } from "react";

// ── Zod schema ────────────────────────────────────────────────────────────────
const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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

// ── Password strength indicator ───────────────────────────────────────────────
const strengthChecks = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One number", test: (v: string) => /[0-9]/.test(v) },
];

const PasswordStrength = ({ password }: { password: string }) => {
  if (!password) return null;
  return (
    <div className="flex flex-col gap-1.5 mb-4 ml-1">
      {strengthChecks.map((check) => {
        const passed = check.test(password);
        return (
          <div key={check.label} className="flex items-center gap-2">
            {passed ? (
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--theme-primary-raw)" }} />
            ) : (
              <XCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-400" />
            )}
            <span
              className="text-xs"
              style={{ color: passed ? "var(--theme-primary-raw)" : "#6b8a7a" }}
            >
              {check.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
// Route: /reset-password/[token]  — token is read from URL params automatically
const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema: toFormikValidationSchema(resetSchema),
    onSubmit: async (values) => {
      if (!token) {
        toast.error("Invalid reset link. Please request a new one.");
        return;
      }
      try {
        const response = await resetPassword({
          newPassword: values.newPassword,
          token: token as string,
        }).unwrap();
        toast.success(response?.message || "Password reset successfully!");
        setSuccess(true);
        setTimeout(() => router.replace("/login"), 3000);
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
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
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
              {success ? (
                /* ── Success state ──────────────────────────────────────── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-6"
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
                  <h2 className="text-2xl font-bold text-white mb-2">Password Updated!</h2>
                  <p className="text-sm mb-1" style={{ color: "#6b8a7a" }}>
                    Your password has been reset successfully.
                  </p>
                  <p className="text-sm" style={{ color: "var(--theme-primary-raw)" }}>
                    Redirecting you to sign in…
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
                      New Password
                    </span>
                  </div>

                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
                      Set a new password
                    </h1>
                    <p className="text-sm" style={{ color: "#6b8a7a" }}>
                      Choose a strong password to secure your account.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={formik.handleSubmit}>
                    {/* New Password — using CustomPasswordInput HOC */}
                    <CustomPasswordInput
                      customClass="w-full mb-5"
                      name="newPassword"
                      placeholder="Create a strong password"
                      formik={formik}
                      label="New Password"
                    />

                    {/* Live strength indicator shown beneath the field */}
                    <PasswordStrength password={formik.values.newPassword} />

                    {/* Confirm Password — using CustomPasswordInput HOC */}
                    <CustomPasswordInput
                      customClass="w-full"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      formik={formik}
                      label="Confirm Password"
                    />

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.015 } : {}}
                      whileTap={!isLoading ? { scale: 0.985 } : {}}
                      className="mt-5 relative w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2 overflow-hidden transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
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
                      {isLoading ? "Resetting…" : "Reset Password"}
                    </motion.button>
                  </form>

                  <p className="text-center text-sm mt-6" style={{ color: "#6b8a7a" }}>
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="font-semibold transition-colors"
                      style={{ color: "var(--theme-primary-raw)" }}
                    >
                      Sign in →
                    </Link>
                  </p>
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

export default ResetPasswordPage;