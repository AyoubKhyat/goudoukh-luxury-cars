"use client";

import { useState, FormEvent } from "react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    if (!form.name.trim()) {
      setErrorMessage("Please enter your name.");
      return false;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!form.subject) {
      setErrorMessage("Please select a subject.");
      return false;
    }
    if (!form.message.trim()) {
      setErrorMessage("Please enter your message.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-bebas text-2xl tracking-wide text-[#0a0a0a] mb-2">
          Message Sent
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="rounded bg-[#ff5c00] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e05200]"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[#0a0a0a]">
          Name <span className="text-[#ff5c00]">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Your full name"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-[#0a0a0a] outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-[#0a0a0a]">
          Email <span className="text-[#ff5c00]">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-[#0a0a0a] outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
        />
      </div>

      {/* Phone (optional) */}
      <div>
        <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-[#0a0a0a]">
          Phone <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="+212 600 000 000"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-[#0a0a0a] outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-[#0a0a0a]">
          Subject <span className="text-[#ff5c00]">*</span>
        </label>
        <select
          id="contact-subject"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-[#0a0a0a] outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
        >
          <option value="">Select a subject</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Booking Question">Booking Question</option>
          <option value="Partnership">Partnership</option>
          <option value="Feedback">Feedback</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[#0a0a0a]">
          Message <span className="text-[#ff5c00]">*</span>
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="How can we help you?"
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-[#0a0a0a] outline-none transition-colors focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00] resize-none"
        />
      </div>

      {/* Error */}
      {status === "error" && errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-[#ff5c00] py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#e05200] hover:shadow-lg hover:shadow-[#ff5c00]/20 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
