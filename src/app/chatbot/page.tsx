"use client";

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Phone } from 'lucide-react';
import Vapi from '@vapi-ai/web';

interface VapiWidgetProps {
  apiKey?: string;
  assistantId?: string;
  config?: Record<string, unknown>;
}

const VapiWidget: React.FC<VapiWidgetProps> = ({ 
  apiKey, 
  assistantId, 
  config = {} 
}) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [transcript, setTranscript] = useState<Array<{role: string, text: string, timestamp: number}>>([]);
  const [pendingAiResponse, setPendingAiResponse] = useState<string>("");

  const vapiApiKey = apiKey || process.env.NEXT_PUBLIC_VAPI_API_KEY || process.env.VAPI_API_KEY;
  const vapiAssistantId = assistantId || "7cf2fed6-379a-49de-9230-1b81c355b98b";

  const triggerMessage = "I have everything I need";

  // Function to save transcript via API
  const saveTranscriptToServer = async (transcriptData: any) => {
    try {
      const response = await fetch('/api/save-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transcriptData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Transcript saved to server:', result);
      } else {
        console.error('Failed to save transcript:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving transcript:', error);
    }
  };

  const checkForTriggerMessage = (text: string) => {
    return text.toLowerCase().includes(triggerMessage.toLowerCase());
  };

  useEffect(() => {
    if (!vapiApiKey) {
      return;
    }

    const vapiInstance = new Vapi(vapiApiKey);
    setVapi(vapiInstance);

    vapiInstance.on('call-start', () => {
      setIsConnected(true);
      vapiInstance.setMuted(true);
    });

    vapiInstance.on('call-end', () => {
      setIsConnected(false);
      setIsMuted(true);
      setTranscript([]);
      setPendingAiResponse("");
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript') {
        if (message.transcriptType === 'final') {
          const newMessage = {
            role: message.role,
            text: message.transcript,
            timestamp: Date.now()
          };

          setTranscript(prev => {
            const updatedTranscript = [...prev, newMessage];
            
            if (message.role === 'assistant' && checkForTriggerMessage(message.transcript)) {
              console.log('Trigger message detected:', message.transcript);
              
              const transcriptData = {
                sessionId: Date.now().toString(),
                timestamp: new Date().toISOString(),
                messages: updatedTranscript,
                triggerDetected: true,
                triggerMessage: triggerMessage,
                detectedIn: message.transcript
              };

              // Save to server instead of downloading
              saveTranscriptToServer(transcriptData);
            }
            
            return updatedTranscript;
          });
        }
      } else if (message.type === 'conversation-update') {
        if (message.conversation && message.conversation.length > 0) {
          const lastMessage = message.conversation[message.conversation.length - 1];
          if (lastMessage.role === 'assistant' && lastMessage.message) {
            setPendingAiResponse(lastMessage.message);
            
            const newMessage = {
              role: 'assistant',
              text: lastMessage.message,
              timestamp: Date.now()
            };

            setTranscript(prev => {
              const updatedTranscript = [...prev, newMessage];
              
              if (checkForTriggerMessage(lastMessage.message)) {
                console.log('Trigger message detected in conversation update:', lastMessage.message);
                
                const transcriptData = {
                  sessionId: Date.now().toString(),
                  timestamp: new Date().toISOString(),
                  messages: updatedTranscript,
                  triggerDetected: true,
                  triggerMessage: triggerMessage,
                  detectedIn: lastMessage.message
                };

                // Save to server
                saveTranscriptToServer(transcriptData);
              }
              
              return updatedTranscript;
            });
            
            setTimeout(() => setPendingAiResponse(""), 100);
          }
        }
      }
    });

    vapiInstance.start(vapiAssistantId, {});

    return () => {
      vapiInstance?.stop();
    };
  }, [vapiApiKey, vapiAssistantId, triggerMessage]);

  const toggleMute = () => {
    if (vapi && isConnected) {
      if (isMuted) {
        vapi.setMuted(false);
        setIsMuted(false);
      } else {
        vapi.setMuted(true);
        setIsMuted(true);
      }
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  if (!vapiApiKey) {
    return null;
  }

  return (
    <>
      {isConnected && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex gap-4">
          <button
            onClick={toggleMute}
            className="w-20 h-20 rounded-full shadow-lg transition-all duration-200 
                       flex items-center justify-center hover:scale-110"
            style={{
              background: isMuted 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            }}
          >
            {isMuted ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>
          
          <button
            onClick={endCall}
            className="w-20 h-20 rounded-full shadow-lg transition-all duration-200 
                       flex items-center justify-center hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
            }}
          >
            <Phone className="w-8 h-8 text-white transform rotate-[135deg]" />
          </button>
        </div>
      )}

      {isConnected && (transcript.length > 0 || transcript) && (
        <div className="fixed bottom-6 left-6 right-6 max-w-2xl mx-auto z-40">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-64 overflow-y-auto">
            {transcript.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
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
            
            {transcript && (
              <div
                className={`mb-3 flex ${transcript.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm border-2 border-dashed opacity-70 ${
                    transcript.role === 'user'
                      ? 'bg-blue-100 text-blue-800 border-blue-300 rounded-br-none'
                      : 'bg-gray-50 text-gray-600 border-gray-300 rounded-bl-none'
                  }`}
                >
                  <div className="font-medium text-xs mb-1 opacity-75 flex items-center gap-1">
                    {transcript.role === 'user' ? 'You' : 'Coach'}
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                  </div>
                  {transcript.text}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VapiWidget;