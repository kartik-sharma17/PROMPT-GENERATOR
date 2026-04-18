"use client"

import { Navbar } from "@/@comp"
import { Footer } from "@/@comp"
import { Mail, MapPin, Phone, Send, Sparkles, ArrowRight } from "lucide-react"
import { useState } from "react"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1800))
    setSending(false)
    setSent(true)
  }

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email Us",
      value: "hello@prompter.ai",
      sub: "We reply within 24 hours",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Call Us",
      value: "+1 (800) 123-4567",
      sub: "Mon–Fri, 9 AM – 6 PM EST",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Our Office",
      value: "San Francisco, CA",
      sub: "United States",
    },
  ]

  return (
    <div className="bg-(--sec-bg) text-white min-h-screen">
      <Navbar />

      {/* ── Hero Badge ── */}
      <section className="pt-24 pb-4 flex flex-col items-center gap-4 px-6">
        <span
          className="breathing-glow inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            background: "hsl(var(--glass) / 60%)",
            border: "1px solid hsl(var(--glass-border) / 0.4)",
            color: "hsl(var(--theme-primary))",
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full pulse-glow"
            style={{ background: "hsl(var(--theme-primary))" }}
          />
          Get In Touch
        </span>

        <h1 className="text-center text-4xl md:text-6xl font-bold leading-tight">
          We&apos;d Love to{" "}
          <span className="gradient-text-animated">Hear From You</span>
        </h1>
        <p className="text-center text-gray-400 text-lg max-w-xl">
          Have a question, feedback, or just want to say hi? Drop us a message
          and we&apos;ll get back to you faster than your AI prompt.
        </p>
      </section>

      {/* ── Main Split Section ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">

          {/* ── Left: Image + Contact Info ── */}
          <div className="flex flex-col gap-6">

            {/* Image card */}
            <div
              className="glass-card relative overflow-hidden rounded-2xl flex-1"
              style={{ border: "1px solid hsl(var(--glow) / 0.2)", minHeight: "320px" }}
            >
              {/* Glow blobs */}
              <div
                className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl pointer-events-none z-0"
                style={{ background: "hsl(var(--glow) / 0.15)" }}
              />
              <div
                className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none z-0"
                style={{ background: "hsl(var(--glow) / 0.08)" }}
              />

              <img
                src="/assets/img/girlpic.webp"
                alt="Contact Prompter"
                className="w-full h-full object-cover object-center relative z-10"
                style={{ minHeight: "320px", maxHeight: "420px" }}
              />

              {/* Overlay gradient */}
              <div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, hsl(var(--sec-bg) / 0.85) 0%, transparent 60%)",
                }}
              />

              {/* Floating pill */}
              <div
                className="absolute bottom-5 left-5 right-5 z-30 glass-card flex items-center gap-3 px-4 py-3"
                style={{ borderColor: "hsl(var(--glow) / 0.35)" }}
              >
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
                  style={{
                    background: "hsl(var(--glow) / 0.2)",
                    border: "1px solid hsl(var(--glow) / 0.3)",
                    color: "hsl(var(--theme-primary))",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "hsl(var(--theme-primary))" }}
                  >
                    Average Response Time
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Under 2 hours · Always human
                  </p>
                </div>
                <span
                  className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: "hsl(var(--glow) / 0.15)",
                    color: "hsl(var(--theme-primary))",
                  }}
                >
                  ✓ Online
                </span>
              </div>
            </div>

            {/* Contact info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="glass-card glass-card-hover p-4 flex flex-col gap-2 relative overflow-hidden"
                >
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                    style={{ background: "hsl(var(--glow) / 0.06)" }}
                  />
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-xl self-start"
                    style={{
                      background: "hsl(var(--glow) / 0.15)",
                      border: "1px solid hsl(var(--glow) / 0.25)",
                      color: "hsl(var(--theme-primary))",
                    }}
                  >
                    {item.icon}
                  </span>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-white leading-tight">
                    {item.value}
                  </p>
                  <p className="text-[11px] text-gray-500">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div
            className="glass-card relative overflow-hidden p-8 flex flex-col justify-between"
            style={{ border: "1px solid hsl(var(--glow) / 0.2)" }}
          >
            {/* bg glows */}
            <div
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
              style={{ background: "hsl(var(--glow) / 0.07)" }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl pointer-events-none"
              style={{ background: "hsl(var(--glow) / 0.05)" }}
            />

            {!sent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Send us a{" "}
                    <span className="gradient-text-animated">message</span>
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Fill in the form below and we&apos;ll get back to you shortly.
                  </p>
                </div>

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 focus:ring-1"
                      style={{
                        background: "hsl(var(--glass) / 50%)",
                        border: "1px solid hsl(var(--glass-border) / 0.35)",
                        // @ts-ignore
                        "--tw-ring-color": "hsl(var(--theme-primary) / 0.5)",
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200 focus:ring-1"
                      style={{
                        background: "hsl(var(--glass) / 50%)",
                        border: "1px solid hsl(var(--glass-border) / 0.35)",
                      }}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                    Subject
                  </label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-1 appearance-none cursor-pointer"
                    style={{
                      background: "hsl(var(--glass) / 50%)",
                      border: "1px solid hsl(var(--glass-border) / 0.35)",
                      color: formData.subject ? "white" : "hsl(0 0% 40%)",
                    }}
                  >
                    <option value="" disabled>
                      Select a topic…
                    </option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing & Plans</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind…"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none resize-none transition-all duration-200 focus:ring-1"
                    style={{
                      background: "hsl(var(--glass) / 50%)",
                      border: "1px solid hsl(var(--glass-border) / 0.35)",
                    }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  className="shimmer neon-glow-box flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm text-black cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ background: "hsl(var(--theme-primary))" }}
                >
                  {sending ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-center text-gray-600 text-xs">
                  By submitting, you agree to our{" "}
                  <span
                    className="underline underline-offset-2 cursor-pointer"
                    style={{ color: "hsl(var(--theme-primary))" }}
                  >
                    Privacy Policy
                  </span>
                  .
                </p>
              </form>
            ) : (
              /* ── Success State ── */
              <div className="flex flex-col items-center justify-center gap-6 h-full py-12 relative z-10 text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center neon-glow-box"
                  style={{
                    background: "hsl(var(--glow) / 0.15)",
                    border: "1px solid hsl(var(--glow) / 0.4)",
                  }}
                >
                  <span
                    className="text-4xl"
                    style={{ color: "hsl(var(--theme-primary))" }}
                  >
                    ✓
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Message{" "}
                    <span className="gradient-text-animated">Received!</span>
                  </h3>
                  <p className="text-gray-400 text-sm max-w-xs mx-auto">
                    Thanks for reaching out, {formData.name || "friend"}! We&apos;ll
                    reply to <strong className="text-white">{formData.email}</strong>{" "}
                    within 24 hours.
                  </p>
                </div>
                <button
                  onClick={() => { setSent(false); setFormData({ name: "", email: "", subject: "", message: "" }) }}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105"
                  style={{
                    background: "hsl(var(--glass) / 60%)",
                    border: "1px solid hsl(var(--glass-border) / 0.4)",
                    color: "hsl(var(--theme-primary))",
                  }}
                >
                  Send another <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ContactPage