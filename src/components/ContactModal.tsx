import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { sound } from '../utils/audio';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialMessage = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('Unity Indie Game');
  const [budget, setBudget] = useState('$10k - $25k');
  const [message, setMessage] = useState(initialMessage);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChime(820, 0.2);
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
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
                We respond within 24 hours with friendly advice and ideas.
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
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-2xl font-display font-bold text-[#0b1d3a]">
                We received your note!
              </h4>
              <p className="text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you so much, <span className="text-[#0b1d3a] font-semibold">{name}</span>! One of our artists or game developers will read your message and write back to <span className="font-semibold text-orange-600">{email}</span> within 24 hours.
              </p>
              <div className="pt-6">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full transition-colors"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    What are you making?
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl text-sm text-slate-900 focus:outline-none transition-colors"
                  >
                    <option value="Unity Indie Game">Unity Indie Game (2D or 3D)</option>
                    <option value="2D Art & Character">2D Art &amp; Character Design</option>
                    <option value="Graphic Design & Branding">Graphic Design &amp; Posters</option>
                    <option value="AR / VR / MR Experience">AR / VR / MR Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Estimated Budget Range
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl text-sm text-slate-900 focus:outline-none transition-colors"
                  >
                    <option value="$5k - $10k">$5,000 – $10,000 USD</option>
                    <option value="$10k - $25k">$10,000 – $25,000 USD</option>
                    <option value="$25k - $50k">$25,000 – $50,000 USD</option>
                    <option value="$50k+">$50,000+ USD</option>
                  </select>
                </div>
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

              {/* Orange CTA Button with matching white icon */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Send Message to OVRStudio</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
