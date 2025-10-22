
import React from 'react';
import type { Source } from '../types';

interface SourceListProps {
  sources: Source[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="max-w-xl">
      <h4 className="text-xs text-slate-400 font-semibold mb-1">Sources:</h4>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-slate-600/50 text-indigo-300 px-2 py-1 rounded-md hover:bg-slate-600 transition-colors truncate"
            title={source.title}
          >
            {index + 1}. {new URL(source.uri).hostname}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SourceList;
