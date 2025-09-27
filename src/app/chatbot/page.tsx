"use client";

import React from 'react';
import { useVapi } from '@/contexts/VapiContext';
import { VapiVoiceButton } from '@/components/VapiVoiceButton';

interface ChatbotPageProps {
  assistantId?: string;
}

const ChatbotPage: React.FC<ChatbotPageProps> = ({ 
  assistantId = "7cf2fed6-379a-49de-9230-1b81c355b98b"
}) => {
  const { isConnected, transcript, pendingAiResponse } = useVapi();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Voice Coach</h1>
          <p className="text-gray-600 mb-6">
            Start a conversation with your AI fitness coach. The coach can help you with workout plans, 
            nutrition advice, and motivation. Say "I have everything I need" to end the session.
          </p>
          
          <div className="flex justify-center">
            <VapiVoiceButton
              assistantId={assistantId}
              size="lg"
              variant="primary"
              onCallStart={() => console.log('Call started')}
              onCallEnd={() => console.log('Call ended')}
              onMuteToggle={(muted) => console.log('Mute toggled:', muted)}
            />
          </div>
        </div>

        {/* Transcript Display */}
        {isConnected && transcript.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h2>
            <div className="space-y-3">
              {transcript.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className="font-medium text-xs mb-1 opacity-75">
                      {msg.role === 'user' ? 'You' : 'Coach'}
                    </div>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {pendingAiResponse && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm border-2 border-dashed opacity-70 bg-gray-50 text-gray-600 border-gray-300 rounded-bl-none">
                    <div className="font-medium text-xs mb-1 opacity-75 flex items-center gap-1">
                      Coach
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    </div>
                    {pendingAiResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotPage;