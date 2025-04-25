// pages/session.tsx
import React from 'react';
import TimerBox from './timerbox/page';
import ChatBox from './chat/page';


const SessionPage: React.FC = () => {
  return (
    <div className="bg-focusmate min-h-screen flex items-center justify-center px-6 py-10">
      <div className="flex flex-row w-full max-w-6xl gap-6">
        
        {/* 🕒 Timer section – 80% */}
        <div className="w-full md:w-[80%] flex flex-col items-center justify-center">
          <TimerBox />
        </div>

        {/* 💬 Chat section – 20% */}
        <div className="w-full md:w-[20%] flex flex-col items-center justify-start">
          <h2 className="text-xl font-medium mb-4">Chat with your FocusMate</h2>
          <ChatBox />
        </div>
        
      </div>
    </div>
  );
};

export default SessionPage;
