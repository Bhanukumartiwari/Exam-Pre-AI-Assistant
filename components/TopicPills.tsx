
import React from 'react';

const topics = ['Science & Tech', 'History', 'Indian Polity', 'Geography', 'Current Affairs'];

interface TopicPillsProps {
  onTopicSelect: (topic: string) => void;
  disabled: boolean;
}

const TopicPills: React.FC<TopicPillsProps> = ({ onTopicSelect, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-2">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() => onTopicSelect(topic)}
          disabled={disabled}
          className="px-3 py-1 text-sm border border-slate-600 text-slate-300 rounded-full hover:bg-slate-700 hover:border-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicPills;
