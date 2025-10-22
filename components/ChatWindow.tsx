
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { GroundingChunk } from "@google/genai";
import { sendMessageStream } from '../services/geminiService';
import type { Message, Source } from '../types';
import MessageComponent from './Message';
import TopicPills from './TopicPills';
import { SendIcon } from './icons/SendIcon';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-bot-message',
      text: "Hello! I'm here to help you prepare for your exams. What topic would you like to explore today?",
      sender: 'bot'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: prompt, sender: 'user' };
    const botMessagePlaceholder: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      sender: 'bot',
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, botMessagePlaceholder]);
    setUserInput('');
    setIsLoading(true);

    try {
      await sendMessageStream(prompt, (streamedText, sourcesData) => {
        const sources: Source[] = (sourcesData ?? [])
            .map(s => s.web)
            .filter((s): s is { uri: string; title: string; } => !!s && 'uri' in s && 'title' in s);
            
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'bot') {
            lastMessage.text = streamedText;
            lastMessage.sources = sources;
          }
          return newMessages;
        });
      });
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'bot') {
          lastMessage.text = 'Sorry, I encountered an error. Please try again.';
          lastMessage.isStreaming = false;
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
       setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.sender === 'bot') {
                lastMessage.isStreaming = false;
            }
            return newMessages;
        });
    }
  }, [isLoading]);

  const handleTopicSelect = (topic: string) => {
    const prompt = `Tell me about ${topic} for my exam preparation.`;
    setUserInput(prompt);
    handleSendMessage(prompt);
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput);
  }

  return (
    <div className="flex flex-col h-full w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl">
      <div className="flex-grow p-4 md:p-6 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <MessageComponent key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 md:p-6 border-t border-slate-700">
        <TopicPills onTopicSelect={handleTopicSelect} disabled={isLoading} />
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 mt-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about a topic, e.g., 'What was the Harappan Civilization?'"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="bg-indigo-600 text-white p-3 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors duration-200 flex-shrink-0"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
