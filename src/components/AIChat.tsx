/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, Loader2, User } from 'lucide-react';
import { createChat } from '@/src/services/geminiService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/src/types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIChatProps {
  profile: UserProfile;
}

export default function AIChat({ profile }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm Luna, your performance health assistant. How can I help you adjust your training or nutrition for your cycle today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const initChat = async () => {
    if (!chatInstance) {
      const chat = await createChat(profile);
      setChatInstance(chat);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatInstance) {
        const chat = await createChat(profile);
        setChatInstance(chat);
        const response = await chat.sendMessage({ message: userMessage });
        setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't generate a response." }]);
      } else {
        const response = await chatInstance.sendMessage({ message: userMessage });
        setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't generate a response." }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Oops! I encountered an error. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => {
          setIsOpen(true);
          initChat();
        }}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-[#FF7E67] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 p-0"
      >
        <MessageCircle className="w-8 h-8" />
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 w-[90vw] md:w-[400px] h-[500px] z-50"
          >
            <Card className="flex flex-col h-full bg-white rounded-[40px] border-[#FFE4DC] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#FF7E67] p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Talk to Luna</h3>
                    <p className="text-xs opacity-80 font-medium">Health & Nutrition Pro</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="rounded-full hover:bg-white/20 text-white"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 flex flex-col"
              >
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-slate-100 ${msg.role === 'user' ? 'bg-[#FF7E67] text-white' : 'bg-white text-[#FF7E67]'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#FF7E67] text-white rounded-tr-none font-medium' 
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-400 italic text-xs ml-10">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Luna is thinking...
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about training, recovery..."
                  className="rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-[#FF7E67]"
                />
                <Button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-[#FF7E67] text-white rounded-2xl w-12 h-10 p-0 shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
