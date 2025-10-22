import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import SourceList from './SourceList';

interface MessageProps {
  message: Message;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1">
    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
  </div>
);

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  const messageContainerClasses = `flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`;
  const messageBubbleClasses = `max-w-xl px-4 py-3 rounded-2xl ${
    isBot
      ? 'bg-slate-700 text-slate-200 rounded-tl-none'
      : 'bg-indigo-600 text-white rounded-tr-none'
  }`;

  return (
    <div className={messageContainerClasses}>
      <div className="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center">
        {isBot ? <BotIcon /> : <UserIcon />}
      </div>
      <div className="flex flex-col gap-2">
        <div className={messageBubbleClasses}>
            {message.isStreaming && !message.text ? (
                <TypingIndicator />
            ) : (
                <ReactMarkdown 
                    className="prose prose-invert prose-sm max-w-none"
                    remarkPlugins={[remarkGfm]}>
                    {message.text}
                </ReactMarkdown>
            )}
        </div>
        {message.sources && message.sources.length > 0 && <SourceList sources={message.sources} />}
      </div>
    </div>
  );
};

export default MessageComponent;