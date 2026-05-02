/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Sparkles, MessageSquare, ArrowRight, RefreshCcw, Star, Infinity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendMessageStream, type Message } from './lib/gemini';
import SubscriptionModal from './components/SubscriptionModal';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setCurrentResponse('');

    try {
      const stream = sendMessageStream(updatedMessages);
      let fullResponse = '';
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setCurrentResponse(fullResponse);
      }

      setMessages([...updatedMessages, { role: 'model', content: fullResponse }]);
      setCurrentResponse('');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'model', content: "I'm so sorry, but I encountered a little trouble connecting. Could you try sending that again?" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setCurrentResponse('');
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text font-sans flex flex-col items-center selection:bg-natural-stone/30 relative overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-[#E8E4DE] rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-[#E0E7D8] rounded-full blur-3xl opacity-40 -z-10 animate-pulse [animation-duration:8s]" />

      {/* Header */}
      <header className="w-full max-w-5xl h-16 px-8 flex items-center justify-between border-b border-natural-border sticky top-0 bg-natural-bg/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-natural-accent flex items-center justify-center text-white">
            <Infinity size={18} />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Infinity AI</h1>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-natural-muted">
          <button onClick={() => setIsModalOpen(true)} className="py-5 flex items-center gap-2 hover:text-natural-text transition-colors">
            <Star size={14} />
            <span>Upgrade</span>
          </button>
          <span className="text-natural-text border-b-2 border-natural-accent py-5">Chat</span>
          <span className="py-5 cursor-pointer hover:text-natural-text transition-colors">Insights</span>
          <span className="py-5 cursor-pointer hover:text-natural-text transition-colors">Archive</span>
          <button 
            onClick={handleClear}
            className="py-5 flex items-center gap-2 hover:text-natural-text transition-colors"
          >
            <RefreshCcw size={14} />
            <span>Reset</span>
          </button>
        </div>

        <div className="w-8 h-8 rounded-full bg-natural-stone cursor-pointer hover:opacity-80 transition-opacity" />
      </header>

      {/* Chat Area */}
      <main className="flex-1 w-full max-w-3xl px-6 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {messages.length === 0 && !isLoading ? (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center text-center gap-10 py-20"
            >
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-5xl font-light text-[#2C2926] leading-tight font-serif">
                  Hello, I'm <span className="italic">here to help.</span>
                </h2>
                <p className="text-lg text-natural-muted leading-relaxed">
                  I can help you break down complex ideas, plan your week, or just have a supportive conversation. What's on your mind today?
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 w-full">
                {[
                  "Explain quantum physics like I'm five",
                  "Help me plan a calm weekend in the city",
                  "Review my project proposal tone",
                  "Suggest some healthy breakfast ideas"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(suggestion); }}
                    className="px-5 py-2.5 bg-white border border-natural-stone rounded-full text-sm hover:bg-[#F0EEEA] transition-all hover:border-natural-muted text-natural-muted hover:text-natural-text"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8 py-10 pb-40">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm mt-1
                      ${msg.role === 'user' ? 'bg-natural-stone text-natural-text' : 'bg-natural-accent text-white'}`}
                    >
                      {msg.role === 'user' ? <User size={18} /> : <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                    <div className={`p-6 rounded-[32px] leading-relaxed shadow-sm border
                      ${msg.role === 'user' 
                        ? 'bg-white text-natural-text rounded-tr-none border-natural-border' 
                        : 'bg-white text-natural-text rounded-tl-none border-natural-border'}`}
                    >
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {(currentResponse || isLoading) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] flex gap-4">
                    <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-natural-accent text-white shadow-sm mt-1">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                    <div className="p-6 bg-white rounded-[32px] rounded-tl-none shadow-sm border border-natural-border leading-relaxed text-natural-text">
                      <div className="prose prose-sm max-w-none">
                        {currentResponse ? (
                          <ReactMarkdown>{currentResponse}</ReactMarkdown>
                        ) : (
                          <div className="flex gap-2 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-natural-accent/30 animate-bounce" />
                            <div className="w-1.5 h-1.5 rounded-full bg-natural-accent/30 animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-natural-accent/30 animate-bounce [animation-delay:-0.3s]" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
        <SubscriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 w-full flex flex-col items-center p-8 bg-gradient-to-t from-natural-bg via-natural-bg/90 to-transparent z-30">
        <div className="w-full max-w-3xl">
          <form 
            onSubmit={handleSubmit}
            className="relative bg-white rounded-[40px] shadow-lg border border-natural-border p-2 flex items-center group transition-all focus-within:ring-2 focus-within:ring-natural-accent/20"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent px-6 py-4 outline-none text-lg text-natural-text placeholder-natural-placeholder"
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 rounded-full bg-natural-accent text-white flex items-center justify-center hover:bg-natural-accent/90 disabled:bg-natural-accent/30 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 group-hover:shadow-lg"
            >
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </form>
          <p className="text-center text-[11px] text-natural-placeholder mt-4 uppercase tracking-[0.1em] font-medium">
            Supportive • Intelligent • Human-Centered AI
          </p>
        </div>
      </footer>
    </div>
  );
}

