
import React from 'react';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-4xl flex flex-col h-screen">
        <header className="text-center py-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
            Exam Prep AI Assistant
          </h1>
          <p className="text-slate-400 mt-2">
            Your smart search companion for Indian Government Exams, powered by Gemini.
          </p>
        </header>
        <main className="flex-grow flex flex-col min-h-0">
          <ChatWindow />
        </main>
      </div>
    </div>
  );
};

export default App;
