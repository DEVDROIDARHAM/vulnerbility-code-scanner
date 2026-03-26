import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm ScanSentinel AI 🔒 Ask me anything about code security, vulnerabilities, OWASP Top 10, or secure coding practices."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "What is SQL injection?",
    "How do I prevent XSS attacks?",
    "Explain OWASP Top 10",
    "What is CSRF and how to prevent it?",
    "How to store passwords securely?",
    "What is JWT and is it secure?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input.trim(),
            history: messages.slice(-6)
          })
        });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
      
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="px-6 py-8 border-b border-white/5 bg-[#121216]/50">
        <Link to="/" className="inline-block group">
          <h1 className="text-3xl font-display font-bold tracking-tight group-hover:scale-[1.01] transition-transform">
            Scan<span className="text-[#e11d48]">Sentinel</span> AI
          </h1>
        </Link>
        <p className="text-text-secondary mt-1">
          Security Knowledge Assistant — Powered by Llama 3.3
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-[900px] mx-auto w-full min-h-[75vh] px-4 md:px-6 py-8">
        
        {/* Messages Area */}
        <div className="flex-1 min-h-[60vh] overflow-y-auto pr-2 space-y-8 scrollbar-thin">
          
          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="animate-reveal py-4">
              <p className="text-sm text-text-muted mb-4 px-2">Try asking:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInput(s)}
                    className="text-left px-4 py-3 text-sm bg-[#121216] border border-white/5 rounded-xl hover:border-[#e11d48]/30 hover:bg-[#1c1c21] transition-all duration-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-4 animate-reveal ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex-center shrink-0 text-xl glass-panel ${
                msg.role === 'assistant' ? 'border-[#0ea5e9]/30 bg-[#0ea5e9]/5' : 'border-[#e11d48]/30 bg-[#e11d48]/5'
              }`}>
                {msg.role === 'assistant' ? '🔒' : '👤'}
              </div>
              
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                msg.role === 'assistant' 
                  ? 'bg-[#121216] border border-white/5 rounded-tl-none' 
                  : 'bg-[#1c1c21] border border-[#e11d48]/20 rounded-tr-none'
              }`}>
                <div className="message-content text-[15px] leading-relaxed whitespace-pre-wrap font-sans text-slate-200">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-4 animate-reveal">
              <div className="w-10 h-10 rounded-xl flex-center shrink-0 text-xl glass-panel border-[#0ea5e9]/30 bg-[#0ea5e9]/5">
                🔒
              </div>
              <div className="bg-[#121216] border border-white/5 px-4 py-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1.5 pt-1">
                  <span className="w-2 h-2 bg-[#e11d48] rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-[#e11d48] rounded-full animate-pulse delay-150"></span>
                  <span className="w-2 h-2 bg-[#e11d48] rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-4 pb-6 px-1">
          <div className="relative group glass-panel focus-within:border-[#e11d48]/30 transition-all p-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about vulnerabilities, OWASP, secure coding..."
              rows={2}
              disabled={loading}
              className="w-full bg-transparent border-none focus:ring-0 text-white p-3 pr-24 resize-none min-h-[60px] max-h-[200px] font-sans"
            />
            <div className="absolute right-3 bottom-3 flex gap-2">
              <button 
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`px-4 py-2 rounded-lg font-display font-bold text-xs tracking-wider transition-all duration-300 ${
                  loading || !input.trim() 
                    ? 'bg-white/5 text-white/20' 
                    : 'bg-[#121216] border border-[#e11d48]/40 text-white hover:bg-[#e11d48] hover:text-white shadow-glow-lg'
                }`}
              >
                {loading ? 'SENDING...' : '▶ SEND'}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-text-muted mt-2 px-2 uppercase tracking-widest text-center opacity-50">
            Llama 3.3 may provide advice. Always verify security critical code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
