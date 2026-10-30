import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquareHeart, Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { sound } from '../utils/audio';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const DEFAULT_RECIPIENT_EMAIL = 'thomassiahaan31@gmail.com';

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialMessage = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Unity Indie Game');
  const [message, setMessage] = useState(initialMessage);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  if (!isOpen) return null;

  const getMailtoUrl = () => {
    const subject = encodeURIComponent(`[OVRStudio Project Inquiry] ${projectType} from ${name || 'Client'}`);
    const body = encodeURIComponent(
      `Hello OVRStudio Team,\n\nMy name is ${name} (${email}).\nI am reaching out regarding a project in: ${projectType}.\n\nProject Details:\n${message}\n\nBest regards,\n${name}`
    );
    return `mailto:${DEFAULT_RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChime(820, 0.2);

    // Trigger direct mail client launch to thomassiahaan31@gmail.com
    const mailtoUrl = getMailtoUrl();
    try {
      window.location.href = mailtoUrl;
    } catch {
      // fallback
    }

    setSubmitted(true);
  };

  const handleCopySummary = async () => {
    sound.playTick();
    const textToCopy = `To: ${DEFAULT_RECIPIENT_EMAIL}\nSubject: [OVRStudio Project Inquiry] ${projectType} from ${name}\n\nFrom: ${name} (${email})\nCategory: ${projectType}\n\nMessage:\n${message}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard fallback
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-[#0b1d3a]">
                Say Hello &amp; Plan a Project
              </h3>
              <p className="text-xs text-slate-500">
                Direct to our lead team at <span className="text-[#0b1d3a] font-semibold">{DEFAULT_RECIPIENT_EMAIL}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full bg-white hover:bg-slate-100 transition-colors"
            aria-label="Close Contact Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="py-6 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              
              <div>
                <h4 className="text-2xl font-display font-bold text-[#0b1d3a] mb-2">
                  Ready to send to {DEFAULT_RECIPIENT_EMAIL}
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your email client has been prepared. If your mail app didn&apos;t open automatically, you can open it directly or copy the drafted inquiry below:
                </p>
              </div>

              {/* Direct Mail Client Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={getMailtoUrl()}
                  className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <Mail className="w-4 h-4 text-white" />
                  <span>Open in Mail App</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-[#0b1d3a] rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 border border-slate-200"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>Copy Inquiry Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Inquiry Preview:</div>
                <div><strong>To:</strong> {DEFAULT_RECIPIENT_EMAIL}</div>
                <div><strong>From:</strong> {name} ({email})</div>
                <div><strong>Category:</strong> {projectType}</div>
                <div className="text-slate-500 italic mt-1 line-clamp-3">&ldquo;{message}&rdquo;</div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="px-8 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-colors"
                >
                  Back to Studio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  What are you creating?
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl text-sm text-slate-900 focus:outline-none transition-colors"
                >
                  <option value="Unity Indie Game">Unity Indie Game (2D or 3D)</option>
                  <option value="3D Art & Modeling">3D Art &amp; Character Modeling</option>
                  <option value="Graphic Design & Branding">Graphic Design &amp; Fluid Branding</option>
                  <option value="AR / VR / MR Experience">AR / VR / MR Experience</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tell us about your project or game *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you want to create, your timeline, or anything you're excited about..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Direct email notice */}
              <div className="flex items-center gap-2 p-3 bg-sky-50 rounded-xl text-xs text-sky-800">
                <Mail className="w-4 h-4 text-sky-700 shrink-0" />
                <span>
                  Your note will be sent directly to our studio inbox: <strong>{DEFAULT_RECIPIENT_EMAIL}</strong>
                </span>
              </div>

              {/* Orange CTA Button with matching white icon */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="group relative overflow-hidden w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all duration-200 active:scale-95 hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 cursor-pointer before:absolute before:inset-0 before:-translate-x-full hover:before:translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700"
                >
                  <Send className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  <span>Send Message to {DEFAULT_RECIPIENT_EMAIL}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
