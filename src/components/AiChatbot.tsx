import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, X, Send, Sparkles, RefreshCw, Mic, MicOff, Volume2, VolumeX, Copy, Check, RotateCcw
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface AiChatbotProps {
  isLoggedIn?: boolean;
  userRole?: string;
  loggedInUser?: string | null;
}

const FormattedMessageText: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Tokenize by **bold** and *italic*
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            const inner = part.slice(2, -2);
            return (
              <strong
                key={pIdx}
                className={isUser ? 'font-black text-slate-950' : 'font-bold text-slate-900'}
              >
                {inner}
              </strong>
            );
          }
          if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
            const inner = part.slice(1, -1);
            return (
              <em key={pIdx} className={isUser ? 'italic text-slate-900' : 'italic text-slate-700'}>
                {inner}
              </em>
            );
          }
          return part;
        });

        return (
          <div key={lineIdx} className="leading-relaxed">
            {renderedLine}
          </div>
        );
      })}
    </div>
  );
};

export const AiChatbot: React.FC<AiChatbotProps> = ({
  isLoggedIn = false,
  userRole = 'guest',
  loggedInUser = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const initialWelcomeText = isLoggedIn
    ? `Namaste ${loggedInUser || 'Member'}! 🙏 How can I help you today regarding your properties, ventures, legal documentation, or resort bookings?`
    : `Namaste! 🙏 I am SVS AI Assistant. Ask me any question about our HMDA/DTCP approved plots, luxury villas, prices, free site visits, or investment opportunities across Hyderabad, AP, and Bangalore.`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: initialWelcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Voice input recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeechText = text.replace(/[*#_•]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'model',
        text: initialWelcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    if (speakingMessageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => !m.id.startsWith('welcome'))
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          isLoggedIn,
          userRole,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.text || 'I apologize, I could not retrieve an answer right now.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: 'I am here to answer any questions regarding SVS approved plots, luxury villas, pricing, free site inspections, and legal documentation. Please ask your question.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Clean Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full font-bold text-xs shadow-lg flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border border-amber-600 cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <Bot className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span className="font-bold tracking-tight">
              SVS AI
            </span>
          </button>
        )}
      </div>

      {/* Clean Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">SVS AI Assistant</h3>
                <p className="text-[11px] text-slate-500">Ask any question anytime</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Reset Conversation"
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Reset Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (speakingMessageId) window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs leading-relaxed bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-xl p-3 space-y-1.5 shadow-2xs ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <FormattedMessageText text={m.text} isUser={m.role === 'user'} />

                  {/* Message Tools (TTS & Copy) */}
                  {m.role === 'model' && (
                    <div className="pt-1 flex items-center justify-end gap-1.5 text-slate-400 text-[10px]">
                      <button
                        onClick={() => handleSpeak(m.id, m.text)}
                        title={speakingMessageId === m.id ? "Stop audio" : "Read aloud"}
                        className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                          speakingMessageId === m.id ? 'text-amber-600 font-bold' : 'hover:text-slate-600'
                        }`}
                      >
                        {speakingMessageId === m.id ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        title="Copy response"
                        className="p-1 rounded hover:bg-slate-100 hover:text-slate-600 transition-colors"
                      >
                        {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 w-fit animate-pulse shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span className="text-[11px] font-medium">Generating answer...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Simple Clean Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? "Listening... (tap to stop)" : "Voice input"}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Ask any question...'}
              disabled={isLoading}
              className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-amber-600 transition-colors"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-lg transition-all font-bold shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
