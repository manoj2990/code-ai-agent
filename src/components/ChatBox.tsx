'use client';
import { useState, useRef } from 'react';
import axios from 'axios';

type Message = {
  role: 'user' | 'ai';
  text: string;
  audio?: string;
};

export default function ChatBox() {
  const [chat, setChat] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
        //api call to genrate the text and audio from openai/elevenlabs
      const { data } = await axios.post('/api/chat', { message: input });

      if (data) {
        setChat(prev => [
          ...prev,
          { role: 'user', text: input },
          { role: 'ai', text: data.text, audio: data.audio },// ai ka text & audioUrl
        ]);
        setInput('');
      } else {
        alert('Something went wrong');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (currentlyPlaying === audioUrl) {
      // Pause if clicking the same audio
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Create new audio element
      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      
      newAudio.play();
      setCurrentlyPlaying(audioUrl);
      
      // Handle when audio finishes
      newAudio.onended = () => {
        setCurrentlyPlaying(null);
      };
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
        <div className=" text-white">
        <h1 className="text-center text-3xl font-bold pt-6">🧠 Sidd — AI Coding Assistant</h1>
        </div>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {chat.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-2xl w-full flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                m.role === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
              }`}>
                {m.role === 'user' ? '👤' : '🤖'}
              </div>
              
              <div className={`flex-1 p-4 rounded-2xl ${
                m.role === 'user'
                  ? 'bg-blue-500/10 border border-blue-500/20'
                  : 'bg-gray-800 border border-gray-700'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm text-gray-300">
                    {m.role === 'user' ? 'You' : 'Code Assistant'}
                  </span>
                  {m.audio && (
                    <button 
                      onClick={() => playAudio(m.audio!)}
                      className={`p-2 rounded-full hover:bg-white/10 transition-all ${
                        currentlyPlaying === m.audio ? 'text-emerald-400 animate-pulse' : 'text-gray-400'
                      }`}
                    >
                      {currentlyPlaying === m.audio ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                <p className={`text-gray-100 leading-relaxed ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {m.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-6">
        <div className="max-w-4xl mx-auto flex gap-4 bg-gray-800 rounded-xl p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about coding..."
            className="flex-1 bg-transparent text-gray-100 px-4 py-3 focus:outline-none placeholder:text-gray-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}