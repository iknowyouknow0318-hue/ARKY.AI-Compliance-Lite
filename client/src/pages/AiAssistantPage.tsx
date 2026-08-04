import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { useComplianceStore } from '../store/useComplianceStore';
import { api } from '../services/api';
import { ChatMessage } from '../types';

export const AiAssistantPage: React.FC = () => {
  const { chatMessages, addChatMessage } = useComplianceStore();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = [
    'How do I satisfy SOC 2 CC6.1 Logical Access control in AWS?',
    'What are the mandatory clauses in a HIPAA Business Associate Agreement (BAA)?',
    'How do I handle a GDPR Subject Erasure (Right to be Forgotten) in Supabase PostgreSQL?'
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addChatMessage(userMsg);
    if (!queryText) setInputText('');
    setIsLoading(true);

    try {
      const response = await api.askAssistant(textToSend);
      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        relatedControls: response.relatedControls,
        actionItems: response.actionItems
      };
      addChatMessage(assistantMsg);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 flex flex-col h-[calc(100vh-100px)]">
      
      {/* Header */}
      <div className="p-5 rounded-3xl glass-card border border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">AI Compliance Copilot</h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400">Ask any question regarding SOC 2, HIPAA, GDPR, or auditor evidence collection</p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 text-left text-xs text-slate-300 font-medium transition-colors flex items-start gap-2"
          >
            <Lightbulb className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
              msg.sender === 'user'
                ? 'bg-brand-600 text-white'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl p-4 rounded-2xl text-xs space-y-2 ${
              msg.sender === 'user'
                ? 'bg-brand-600 text-white font-medium rounded-tr-none'
                : 'glass-card border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-bold">{msg.sender === 'user' ? 'Founder' : 'AI Copilot'}</span>
                <span>{msg.timestamp}</span>
              </div>

              <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

              {/* Related Controls & Action Items Pills */}
              {msg.relatedControls && msg.relatedControls.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Related Controls:</span>
                  <div className="flex flex-wrap gap-1">
                    {msg.relatedControls.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 text-[10px] font-bold border border-brand-500/20">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-slate-400 italic p-3">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>AI Copilot is analyzing compliance frameworks...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-2 rounded-2xl glass-card border border-slate-800"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a compliance or audit question..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-transparent text-xs text-slate-100 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-bold text-xs shadow-md transition-all disabled:opacity-40 flex items-center gap-2"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
