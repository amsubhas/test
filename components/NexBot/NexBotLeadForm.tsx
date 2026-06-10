'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Loader2, User, Building2, Phone, Mail, FileText, DollarSign, Clock } from 'lucide-react';
import type { LeadData } from '@/lib/nexbot/types';

interface Props {
  onClose: () => void;
  onSubmit: (data: LeadData) => void;
  prefillInterest?: string;
}

const BUDGET_OPTIONS = [
  'Under ₹5 Lakh', '₹5–20 Lakh', '₹20–50 Lakh', '₹50 Lakh – ₹1 Cr', 'Above ₹1 Cr', 'Open to Discussion',
];
const TIMELINE_OPTIONS = [
  'Immediate (ASAP)', 'Within 1 Month', '1–3 Months', '3–6 Months', '6+ Months', 'Exploring Options',
];
const SERVICE_OPTIONS = [
  'BIM & Digital Twin', 'AI & Machine Learning', 'Robotics & Automation', 'IoT & Smart Infrastructure',
  'Simulation & Analysis', 'Design & Visualization', 'Workforce Solutions (NexForce)', 'BuildMate Platform',
  'Multiple Services', 'Not Sure Yet',
];

export default function NexBotLeadForm({ onClose, onSubmit, prefillInterest }: Props) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<LeadData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    requirement: '',
    budget: '',
    timeline: '',
    interest: prefillInterest || '',
    source: 'NexBot',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadData, string>>>({});

  const update = (field: keyof LeadData, value: string) => {
    setData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!data.name.trim()) e.name = 'Name is required';
    if (!data.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Invalid email address';
    if (!data.phone.trim()) e.phone = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: typeof errors = {};
    if (!data.requirement.trim()) e.requirement = 'Please describe your requirement';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    onSubmit(data);
  };

  const inputClass = (field: keyof LeadData) =>
    `w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:ring-1 ${
      errors[field]
        ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/30'
        : 'border-white/10 focus:border-[#00f5ff]/60 focus:ring-[#00f5ff]/20'
    }`;

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 px-4 text-center gap-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <CheckCircle className="w-14 h-14 text-[#00f5ff]" strokeWidth={1.5} />
        </motion.div>
        <div>
          <p className="text-white font-semibold text-base">Thank you, {data.name.split(' ')[0]}!</p>
          <p className="text-white/60 text-sm mt-1">
            Your request has been received. A NexGiga expert will reach out within 24 hours.
          </p>
        </div>
        <div className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-left">
          <p className="text-[#00f5ff]/80 text-xs mb-2 uppercase tracking-wider">Next Steps</p>
          <ul className="space-y-1.5">
            {['Requirement review by our experts', 'Personalized solution proposal', 'Free 30-min consultation call'].map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-white/60 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-white/40 text-xs">
          Can&apos;t wait? Call us at{' '}
          <a href="tel:+19257898909" className="text-[#00f5ff] hover:underline">+1-925-789-8909</a>
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div>
          <p className="text-white font-semibold text-sm">Get a Free Consultation</p>
          <p className="text-white/40 text-xs">Step {step} of 3 — {['Your Details', 'Your Requirement', 'Timeline & Budget'][step - 1]}</p>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors p-1">
          <X size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/10 mx-4 mt-3 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#00f5ff] to-[#0066ff] rounded-full"
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="px-4 py-3 space-y-3"
          >
            <div>
              <label className="text-white/50 text-xs mb-1 block flex items-center gap-1"><User size={11} />Full Name *</label>
              <input placeholder="John Smith" value={data.name} onChange={(e) => update('name', e.target.value)} className={inputClass('name')} />
              {errors.name && <p className="text-red-400 text-xs mt-0.5">{errors.name}</p>}
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block flex items-center gap-1"><Building2 size={11} />Company</label>
              <input placeholder="Company name" value={data.company} onChange={(e) => update('company', e.target.value)} className={inputClass('company')} />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block flex items-center gap-1"><Mail size={11} />Email Address *</label>
              <input type="email" placeholder="john@company.com" value={data.email} onChange={(e) => update('email', e.target.value)} className={inputClass('email')} />
              {errors.email && <p className="text-red-400 text-xs mt-0.5">{errors.email}</p>}
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block flex items-center gap-1"><Phone size={11} />Phone Number *</label>
              <input type="tel" placeholder="+1 (925) 000-0000" value={data.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass('phone')} />
              {errors.phone && <p className="text-red-400 text-xs mt-0.5">{errors.phone}</p>}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="px-4 py-3 space-y-3"
          >
            <div>
              <label className="text-white/50 text-xs mb-1.5 block flex items-center gap-1"><FileText size={11} />Service Interest</label>
              <div className="grid grid-cols-2 gap-1.5">
                {SERVICE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update('interest', opt)}
                    className={`text-xs px-2 py-1.5 rounded-lg border text-left transition-all duration-150 ${
                      data.interest === opt
                        ? 'bg-[#00f5ff]/15 border-[#00f5ff]/60 text-[#00f5ff]'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white/80'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1 block">Describe your requirement *</label>
              <textarea
                rows={3}
                placeholder="Tell us about your project, goals, or challenges..."
                value={data.requirement}
                onChange={(e) => update('requirement', e.target.value)}
                className={`${inputClass('requirement')} resize-none`}
              />
              {errors.requirement && <p className="text-red-400 text-xs mt-0.5">{errors.requirement}</p>}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="px-4 py-3 space-y-3"
          >
            <div>
              <label className="text-white/50 text-xs mb-1.5 block flex items-center gap-1"><DollarSign size={11} />Budget Range</label>
              <div className="grid grid-cols-2 gap-1.5">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update('budget', opt)}
                    className={`text-xs px-2 py-1.5 rounded-lg border text-left transition-all duration-150 ${
                      data.budget === opt
                        ? 'bg-[#00f5ff]/15 border-[#00f5ff]/60 text-[#00f5ff]'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white/80'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1.5 block flex items-center gap-1"><Clock size={11} />Project Timeline</label>
              <div className="grid grid-cols-2 gap-1.5">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update('timeline', opt)}
                    className={`text-xs px-2 py-1.5 rounded-lg border text-left transition-all duration-150 ${
                      data.timeline === opt
                        ? 'bg-[#00f5ff]/15 border-[#00f5ff]/60 text-[#00f5ff]'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white/80'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer buttons */}
      <div className="px-4 pb-4 flex gap-2">
        {step > 1 && (
          <button
            onClick={() => setStep((p) => p - 1)}
            className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm hover:border-white/25 hover:text-white/80 transition-all duration-150"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#0066ff] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#0066ff] text-black font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 size={15} className="animate-spin" /> Submitting...</>
            ) : (
              <><Send size={15} /> Submit Request</>
            )}
          </button>
        )}
      </div>

      <p className="text-center text-white/25 text-xs pb-3">
        🔒 Your data is secure and never shared with third parties
      </p>
    </div>
  );
}
