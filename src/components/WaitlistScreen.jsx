import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, User, Phone, ArrowRight, CheckCircle2, Loader2, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WaitlistScreen({ onSubmit, isSubmitting, isSubmitted }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isSubmitted) {
      // Trigger festive confetti blast
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9333ea', '#6366f1', '#ec4899', '#f59e0b'],
      });
    }
  }, [isSubmitted]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl mx-auto rounded-3xl border border-white/80 bg-white/85 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-2xl text-center"
      >
        <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
          <PartyPopper className="h-8 w-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-xs mb-3">
          Early Access Confirmed 🚀
        </span>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#222228] mb-3">
          You’re on the VIP Waitlist!
        </h2>

        <p className="text-sm sm:text-base text-zinc-600 mb-6 leading-relaxed">
          Thank you, <span className="font-bold text-zinc-900">{formData.name || 'friend'}</span>! Your responses directly shape the memory and learning algorithms we're building at <span className="font-semibold text-purple-700">CogniBloom</span>.
        </p>

        <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 text-left text-xs text-zinc-600 mb-8 space-y-1">
          <div className="flex justify-between">
            <span className="text-zinc-400">Registered Email:</span>
            <span className="font-semibold text-zinc-800">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Status:</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Priority Access
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400">
          Keep an eye on your inbox for our closed alpha invitation! ✨
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-xl mx-auto rounded-3xl border border-white/80 bg-white/85 p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-2xl text-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3.5 py-1.5 text-xs font-bold text-purple-700 mb-4">
        <Sparkles className="h-3.5 w-3.5" />
        Almost Done!
      </div>

      <h2 className="text-2xl sm:text-4xl font-extrabold text-[#222228] mb-3 leading-snug">
        Thanks for sharing! 👀
      </h2>

      <p className="text-sm sm:text-base text-zinc-600 mb-8 max-w-md mx-auto leading-relaxed">
        We're working on something that might make studying a little less painful. <br />
        <span className="font-semibold text-zinc-800">Want to be the first to know what we're building?</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Name input */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Your Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Diwakar"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 shadow-xs transition ${
                errors.name
                  ? "border-rose-400 focus:ring-rose-400"
                  : "border-zinc-200 focus:border-purple-500 focus:ring-purple-400"
              }`}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
        </div>

        {/* Email input */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="diwakar@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 shadow-xs transition ${
                errors.email
                  ? "border-rose-400 focus:ring-rose-400"
                  : "border-zinc-200 focus:border-purple-500 focus:ring-purple-400"
              }`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
        </div>

        {/* Phone input */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            WhatsApp / Phone Number <span className="text-zinc-400 normal-case font-normal">(Optional for early WhatsApp updates)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 shadow-xs transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="w-full h-13 rounded-full bg-[#222228] text-white font-bold text-base shadow-xl hover:bg-zinc-800 transition flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Securing your spot...</span>
              </>
            ) : (
              <>
                <span>Join the Early Access Waitlist</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
