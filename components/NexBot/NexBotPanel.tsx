'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  X, Mic, MicOff, Send, Volume2, VolumeX, RotateCcw,
  ChevronDown, Zap, Globe, MessageSquare,
} from 'lucide-react';
import NexBotCharacter from './NexBotCharacter';
import NexBotLeadForm from './NexBotLeadForm';
import { NexBotVoiceEngine } from '@/lib/nexbot/voiceEngine';
import type { ChatMsg, BotResponse, NexBotAnimState, ConvMode, LeadData } from '@/lib/nexbot/types';
import { QUICK_ACTIONS } from '@/lib/nexbot/navigationMap';

interface Props {
  onClose: () => void;
  onBotResponse: (response: BotResponse) => void;
  onAnimStateChange: (state: NexBotAnimState) => void;
  animState: NexBotAnimState;
  panelSide: 'left' | 'right';
  /** Tour narration injected from the guided-tour runner in NexBot/index.tsx */
  tourMessage?: string;
}

// ─── HTML entity escaper (prevents XSS from AI response or user input) ────────
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Safe Markdown-to-HTML renderer ──────────────────────────────────────────
function renderMarkdown(text: string): string {
  const safe = escapeHtml(text);
  return safe
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-white/10 px-1 rounded text-[#00f5ff]">$1</code>')
    .replace(/^• (.+)$/gm, '<li class="flex gap-1.5 mt-1"><span class="text-[#00f5ff] mt-0.5 flex-shrink-0">•</span><span>$1</span></li>')
    .replace(/(<li.*<\/li>)+/gs, (match) => `<ul class="my-1 space-y-0.5">${match}</ul>`)
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>');
}

const WELCOME_MESSAGE = "Hello! I'm **NexBot** — NexGiga's AI assistant and digital guide. 👋\n\nI can walk you through **NexForce**, **NexTech**, **NexDesign**, and **NexBuild**, answer questions about our services, give you a guided tour, or connect you with the right expert.\n\nWhat can I help you with today?";

export default function NexBotPanel({
  onClose, onBotResponse, onAnimStateChange, animState, panelSide, tourMessage,
}: Props) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ConvMode>('text');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadInterest, setLeadInterest] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);

  const pathname = usePathname();
  const onAnimStateChangeRef = useRef(onAnimStateChange);
  useEffect(() => { onAnimStateChangeRef.current = onAnimStateChange; }, [onAnimStateChange]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const voiceEngineRef = useRef<NexBotVoiceEngine | null>(null);
  const isLoadingRef = useRef(false);
  const prevTourMessageRef = useRef('');

  // ─── Tour narration injection ───────────────────────────────────────────────
  useEffect(() => {
    if (!tourMessage || tourMessage === prevTourMessageRef.current) return;
    prevTourMessageRef.current = tourMessage;
    setMessages((prev) => [
      ...prev,
      {
        id: `tour-${Date.now()}`,
        role: 'assistant',
        content: tourMessage,
        ts: new Date(),
      },
    ]);
    onAnimStateChangeRef.current('excited');
    setShowQuickActions(false);
  }, [tourMessage]);

  // ─── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showLeadForm]);

  // ─── Init NexBotVoiceEngine on mount ────────────────────────────────────────
  useEffect(() => {
    const engine = new NexBotVoiceEngine();
    engine.onSpeakStart = () => setIsSpeaking(true);
    engine.onSpeakEnd   = () => {
      setIsSpeaking(false);
      onAnimStateChangeRef.current('idle');
    };
    voiceEngineRef.current = engine;
    return () => {
      stopListening();
      engine.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Build API history from messages ───────────────────────────────────────
  const buildHistory = useCallback((msgs: ChatMsg[]) => {
    return msgs
      .filter((m) => m.role !== 'assistant' || !m.isLoading)
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content }));
  }, []);

  // ─── Send Message ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoadingRef.current) return;

      setShowQuickActions(false);
      stopSpeaking();

      const userMsg: ChatMsg = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        ts: new Date(),
      };

      const loadingMsg: ChatMsg = {
        id: `loading-${Date.now()}`,
        role: 'assistant',
        content: '',
        ts: new Date(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMsg, loadingMsg]);
      setInput('');
      setIsLoading(true);
      isLoadingRef.current = true;
      onAnimStateChange('thinking');

      // Dispatch neural network question activation
      window.dispatchEvent(new CustomEvent('nexbot:question'));

      try {
        const history = buildHistory([...messages, userMsg]);

        const res = await fetch('/api/nexbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, pathname }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            res.status === 429
              ? 'You\'ve sent too many messages. Please wait a moment before trying again.'
              : (errData as { error?: string }).error ?? `Request failed (${res.status})`
          );
        }

        const data: BotResponse = await res.json();

        const botMsg: ChatMsg = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.message || "Let me connect you with our team directly — call **+1-925-789-8909** or use the contact form below.",
          ts: new Date(),
        };

        setMessages((prev) => prev.filter((m) => !m.isLoading).concat(botMsg));
        onBotResponse(data);
        onAnimStateChange('talking');

        // Dispatch neural network response wave
        window.dispatchEvent(new CustomEvent('nexbot:response'));

        if (data.leadCapture?.showForm) {
          setLeadInterest(data.leadCapture.interest || '');
          setTimeout(() => setShowLeadForm(true), 600);
        }

        if (voiceEnabled && data.message) {
          speakText(data.message.replace(/\*\*/g, '').replace(/\*/g, '').replace(/•/g, ''));
        } else {
          setTimeout(() => onAnimStateChange('idle'), 3000);
        }
      } catch (err) {
        const errorMessage = err instanceof Error && err.message.includes('too many messages')
          ? err.message
          : "Connection interrupted. You can also reach us directly at **+1-925-789-8909** or via the contact form.";

        setMessages((prev) =>
          prev.filter((m) => !m.isLoading).concat({
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: errorMessage,
            ts: new Date(),
          })
        );
        onAnimStateChange('error');
        setTimeout(() => onAnimStateChange('idle'), 2000);
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, voiceEnabled, buildHistory, onBotResponse, onAnimStateChange]
  );

  const handleSubmit = () => {
    if (input.trim()) sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ─── Voice: Speech-to-Text ──────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    stopSpeaking();

    const SR = window.SpeechRecognition || (window as never as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      onAnimStateChange('listening');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      if (event.results[0].isFinal) {
        stopListening();
        sendMessage(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      onAnimStateChange('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (animState === 'listening') onAnimStateChange('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [animState, onAnimStateChange, sendMessage]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const toggleVoiceInput = () => {
    if (isListening) stopListening();
    else startListening();
  };

  // ─── Voice: Text-to-Speech via NexBotVoiceEngine ────────────────────────────
  const speakText = useCallback((text: string) => {
    if (!voiceEngineRef.current) return;
    const clean = text
      .replace(/\*\*/g, '').replace(/\*/g, '').replace(/•/g, '')
      .replace(/#+\s/g, '').slice(0, 800);
    voiceEngineRef.current.say(clean);
  }, []);

  const stopSpeaking = useCallback(() => {
    voiceEngineRef.current?.stop();
    setIsSpeaking(false);
  }, []);

  const toggleVoiceOutput = () => {
    if (isSpeaking) stopSpeaking();
    setVoiceEnabled((v) => !v);
  };

  // ─── Reset conversation ─────────────────────────────────────────────────────
  const resetConversation = () => {
    stopSpeaking();
    stopListening();
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "Fresh start! I'm ready to help. What would you like to know about NexGiga?",
      ts: new Date(),
    }]);
    setShowLeadForm(false);
    setShowQuickActions(true);
    onAnimStateChange('idle');
  };

  // ─── Lead form submit ───────────────────────────────────────────────────────
  const handleLeadSubmit = (leadData: LeadData) => {
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: leadData.name,
        email: leadData.email,
        company: leadData.company ?? '',
        message: `NexBot Lead Capture\n\nInterest: ${leadData.interest ?? 'General'}\nPhone: ${leadData.phone ?? 'Not provided'}\nTimeline: ${leadData.timeline ?? 'Not specified'}\nBudget: ${leadData.budget ?? 'Not specified'}`,
        source: 'nexbot-lead',
      }),
    }).catch((err) => console.error('[NexBot Lead API]', err));

    setTimeout(() => {
      setShowLeadForm(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `lead-confirm-${Date.now()}`,
          role: 'assistant',
          content: `Thank you, **${leadData.name}**! ✅\n\nYour consultation request has been received. A NexGiga expert will reach out within 24 hours.\n\nIn the meantime, feel free to explore the site or ask me anything!`,
          ts: new Date(),
        },
      ]);
      onAnimStateChange('celebrating');
      setTimeout(() => onAnimStateChange('idle'), 3000);
    }, 500);
  };

  // ─── Message bubble ─────────────────────────────────────────────────────────
  const MessageBubble = ({ msg }: { msg: ChatMsg }) => {
    const isBot = msg.role === 'assistant';

    if (msg.isLoading) {
      return (
        <div className="flex items-end gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00f5ff]/20 to-[#0066ff]/20 border border-[#00f5ff]/30 flex items-center justify-center flex-shrink-0">
            <Zap size={12} className="text-[#00f5ff]" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
            <div className="flex gap-1.5 items-center h-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-end gap-2 ${isBot ? '' : 'flex-row-reverse'}`}
      >
        {isBot ? (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00f5ff]/20 to-[#0066ff]/20 border border-[#00f5ff]/30 flex items-center justify-center flex-shrink-0">
            <Zap size={12} className="text-[#00f5ff]" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
            <span className="text-white/60 text-xs font-semibold">U</span>
          </div>
        )}

        <div
          className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isBot
              ? 'bg-white/5 border border-white/10 rounded-bl-sm text-white/90'
              : 'bg-gradient-to-br from-[#00f5ff]/20 to-[#0066ff]/20 border border-[#00f5ff]/30 rounded-br-sm text-white'
          }`}
        >
          {isBot ? (
            <div
              className="prose prose-invert prose-sm max-w-none [&_strong]:text-[#00f5ff] [&_strong]:font-semibold [&_code]:text-[#00f5ff] [&_li]:text-white/80"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
            />
          ) : (
            <p>{msg.content}</p>
          )}
          <p className={`text-xs mt-1.5 ${isBot ? 'text-white/20' : 'text-white/30'}`}>
            {msg.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </motion.div>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className={`fixed bottom-[108px] z-[9999] w-[360px] max-sm:w-[calc(100vw-16px)] max-sm:left-2 max-sm:right-2 max-sm:bottom-[90px] ${
        panelSide === 'right' ? 'right-4' : 'left-4'
      }`}
      style={{ maxHeight: 'calc(100dvh - 130px)' }}
    >
      {/* Glow backdrop */}
      <div className="absolute inset-0 rounded-2xl bg-[#00f5ff]/5 blur-2xl pointer-events-none" />

      <div
        className="relative flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(0,14,30,0.97) 0%, rgba(0,20,45,0.97) 100%)',
          border: '1px solid rgba(0,245,255,0.15)',
          boxShadow: '0 0 40px rgba(0,245,255,0.08), 0 20px 60px rgba(0,0,0,0.5)',
          maxHeight: 'inherit',
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,245,255,0.03)' }}
        >
          <div className="relative flex-shrink-0">
            <NexBotCharacter state={animState} size={36} />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00f5ff] border-2 border-[#000e1e]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-white font-semibold text-sm">NexBot</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00f5ff]/15 text-[#00f5ff] font-medium">AI</span>
            </div>
            <p className="text-white/40 text-xs truncate flex items-center gap-1">
              <Globe size={10} />
              NexGiga AI Guide — Always available
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={toggleVoiceOutput}
              title={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
              aria-label={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
              className={`p-1.5 rounded-lg transition-colors ${
                voiceEnabled ? 'text-[#00f5ff] bg-[#00f5ff]/10' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            <button
              onClick={() => setMode((m) => (m === 'text' ? 'voice' : 'text'))}
              title={mode === 'text' ? 'Switch to voice mode' : 'Switch to text mode'}
              aria-label={mode === 'text' ? 'Switch to voice mode' : 'Switch to text mode'}
              className={`p-1.5 rounded-lg transition-colors ${
                mode === 'voice' ? 'text-[#00f5ff] bg-[#00f5ff]/10' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {mode === 'voice' ? <Mic size={14} /> : <MessageSquare size={14} />}
            </button>

            <button
              onClick={resetConversation}
              title="Reset conversation"
              aria-label="Reset conversation"
              className="p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors"
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={onClose}
              aria-label="Close NexBot"
              className="p-1.5 rounded-lg text-white/30 hover:text-white/70 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Lead Form (overlay) ── */}
        <AnimatePresence>
          {showLeadForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 overflow-y-auto"
              style={{ background: 'rgba(0,14,30,0.98)' }}
            >
              <NexBotLeadForm
                onClose={() => setShowLeadForm(false)}
                onSubmit={handleLeadSubmit}
                prefillInterest={leadInterest}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0" style={{ maxHeight: '360px' }}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Quick actions */}
          <AnimatePresence>
            {showQuickActions && messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-1"
              >
                <p className="text-white/30 text-xs mb-2 px-1">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => sendMessage(action.message)}
                      className="text-xs px-2.5 py-1.5 rounded-xl border border-[#00f5ff]/20 bg-[#00f5ff]/5 text-[#00f5ff]/80 hover:border-[#00f5ff]/40 hover:bg-[#00f5ff]/10 hover:text-[#00f5ff] transition-all duration-150 whitespace-nowrap"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* ── Voice mode listening state ── */}
        <AnimatePresence>
          {mode === 'voice' && isListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 px-4 py-3 bg-red-500/5 border-t border-red-500/10"
            >
              <div className="relative">
                <motion.div
                  className="w-8 h-8 rounded-full bg-red-500/20 absolute inset-0"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center relative">
                  <Mic size={14} className="text-red-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-red-400 text-xs font-medium">Listening...</p>
                {input && <p className="text-white/50 text-xs truncate mt-0.5">{input}</p>}
              </div>
              <button onClick={stopListening} aria-label="Stop listening" className="text-red-400/60 hover:text-red-400 p-1">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Input area ── */}
        <div
          className="px-3 pb-3 pt-2 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {mode === 'text' ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#00f5ff]/40 focus-within:bg-[#00f5ff]/5 transition-all duration-200">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about NexGiga..."
                  disabled={isLoading}
                  aria-label="Message NexBot"
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/25 min-w-0"
                  maxLength={500}
                />
                <button
                  onClick={toggleVoiceInput}
                  title="Voice input"
                  aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                  className={`flex-shrink-0 transition-colors ${
                    isListening ? 'text-red-400' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00f5ff] to-[#0066ff] flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#00f5ff]/20"
              >
                <Send size={15} className="text-black" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <button
                onClick={toggleVoiceInput}
                aria-label={isListening ? 'Stop listening' : 'Start speaking'}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                  isListening
                    ? 'bg-red-500 shadow-red-500/30 scale-110'
                    : 'bg-gradient-to-br from-[#00f5ff] to-[#0066ff] shadow-[#00f5ff]/20'
                }`}
              >
                {isListening ? (
                  <MicOff size={22} className="text-white" />
                ) : (
                  <Mic size={22} className="text-black" />
                )}
              </button>
              <p className="text-white/30 text-xs">
                {isListening ? 'Tap to stop listening' : 'Tap to speak'}
              </p>
              <button
                onClick={() => setMode('text')}
                className="text-white/20 text-xs flex items-center gap-1 hover:text-white/40 transition-colors"
              >
                <ChevronDown size={12} /> Switch to text
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-2 px-1">
            <p className="text-white/20 text-[10px]">
              Powered by NexGiga AI
            </p>
            <button
              onClick={() => setShowLeadForm(true)}
              className="text-[#00f5ff]/40 text-[10px] hover:text-[#00f5ff]/70 transition-colors"
            >
              Get a free quote →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
