"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Vapi from '@vapi-ai/web';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface VapiMessage {
  role: string;
  text: string;
  timestamp: number;
}

interface VapiContextType {
  // Vapi instance
  vapi: Vapi | null;
  
  // Connection state
  isConnected: boolean;
  isMuted: boolean;
  
  // Transcript data
  transcript: VapiMessage[];
  pendingAiResponse: string;
  
  // Actions
  startCall: (assistantId?: string) => void;
  endCall: () => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  
  // Configuration
  setAssistantId: (id: string) => void;
  setApiKey: (key: string) => void;
  
  // Save functionality
  saveConversation: (conversationData: any) => Promise<void>;
  
  // Callbacks
  onTranscriptUpdate?: (transcript: VapiMessage[]) => void;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onError?: (error: any) => void;
}

const VapiContext = createContext<VapiContextType | undefined>(undefined);

interface VapiProviderProps {
  children: ReactNode;
  apiKey?: string;
  assistantId?: string;
  onTranscriptUpdate?: (transcript: VapiMessage[]) => void;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onError?: (error: any) => void;
}

export const VapiProvider: React.FC<VapiProviderProps> = ({
  children,
  apiKey: initialApiKey,
  assistantId: initialAssistantId,
  onTranscriptUpdate,
  onCallStart,
  onCallEnd,
  onError,
}) => {
  const { user } = useUser();
  const saveConversationMutation = useMutation(api.queries.saveConversation);
  
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [transcript, setTranscript] = useState<VapiMessage[]>([]);
  const [pendingAiResponse, setPendingAiResponse] = useState<string>("");
  const [currentApiKey, setCurrentApiKey] = useState<string>(initialApiKey || '');
  const [currentAssistantId, setCurrentAssistantId] = useState<string>(initialAssistantId || '');

  // Save conversation to Convex
  const saveConversationToConvex = useCallback(async (conversationTranscript: VapiMessage[]) => {
    if (!user?.id) {
      console.warn('No user ID available to save conversation');
      return;
    }

    try {
      const conversationData = {
        userId: user.id as any, // Type assertion for Convex ID
        title: `AI Coaching Session - ${new Date().toLocaleDateString()}`,
        messages: conversationTranscript.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.text,
          timestamp: new Date(msg.timestamp).toISOString(),
        })),
        context: {
          currentWorkout: undefined,
          currentNutritionTarget: undefined,
          recentDiaryEntry: undefined,
        },
        triggerDetected: conversationTranscript.some(msg => 
          msg.role === 'assistant' && 
          msg.text.toLowerCase().includes('i have everything i need')
        ),
        triggerMessage: 'I have everything I need',
        detectedIn: conversationTranscript.find(msg => 
          msg.role === 'assistant' && 
          msg.text.toLowerCase().includes('i have everything i need')
        )?.text,
      };

      await saveConversationMutation(conversationData);
      console.log('Conversation saved to Convex successfully');
    } catch (error) {
      console.error('Error saving conversation to Convex:', error);
    }
  }, [user?.id, saveConversationMutation]);

  // Initialize Vapi instance
  useEffect(() => {
    const apiKey = currentApiKey || process.env.NEXT_PUBLIC_VAPI_API_KEY || process.env.VAPI_API_KEY;
    
    if (!apiKey) {
      console.warn('Vapi API key not provided');
      return;
    }

    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    // Set up event listeners
    vapiInstance.on('call-start', () => {
      setIsConnected(true);
      setIsMuted(true); // Start muted by default
      onCallStart?.();
    });

    vapiInstance.on('call-end', () => {
      setIsConnected(false);
      setIsMuted(true);
      
      // Save conversation before clearing transcript
      if (transcript.length > 0 && user?.id) {
        saveConversationToConvex(transcript);
      }
      
      setTranscript([]);
      setPendingAiResponse("");
      onCallEnd?.();
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript') {
        if (message.transcriptType === 'final') {
          const newMessage: VapiMessage = {
            role: message.role,
            text: message.transcript,
            timestamp: Date.now()
          };

          setTranscript(prev => {
            const updatedTranscript = [...prev, newMessage];
            onTranscriptUpdate?.(updatedTranscript);
            return updatedTranscript;
          });
        }
      } else if (message.type === 'conversation-update') {
        if (message.conversation && message.conversation.length > 0) {
          const lastMessage = message.conversation[message.conversation.length - 1];
          if (lastMessage.role === 'assistant' && lastMessage.message) {
            setPendingAiResponse(lastMessage.message);
            
            const newMessage: VapiMessage = {
              role: 'assistant',
              text: lastMessage.message,
              timestamp: Date.now()
            };

            setTranscript(prev => {
              const updatedTranscript = [...prev, newMessage];
              onTranscriptUpdate?.(updatedTranscript);
              return updatedTranscript;
            });
            
            setTimeout(() => setPendingAiResponse(""), 100);
          }
        }
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
      onError?.(error);
    });

    return () => {
      vapiInstance?.stop();
    };
  }, [currentApiKey, onTranscriptUpdate, onCallStart, onCallEnd, onError, saveConversationToConvex, transcript, user?.id]);

  const startCall = useCallback((assistantId?: string) => {
    if (vapi && !isConnected) {
      const idToUse = assistantId || currentAssistantId || "7cf2fed6-379a-49de-9230-1b81c355b98b";
      vapi.start(idToUse, {});
    }
  }, [vapi, isConnected, currentAssistantId]);

  const endCall = useCallback(() => {
    if (vapi && isConnected) {
      vapi.stop();
    }
  }, [vapi, isConnected]);

  const toggleMute = useCallback(() => {
    if (vapi && isConnected) {
      const newMutedState = !isMuted;
      vapi.setMuted(newMutedState);
      setIsMuted(newMutedState);
    }
  }, [vapi, isConnected, isMuted]);

  const setMuted = useCallback((muted: boolean) => {
    if (vapi && isConnected) {
      vapi.setMuted(muted);
      setIsMuted(muted);
    }
  }, [vapi, isConnected]);

  const setAssistantId = useCallback((id: string) => {
    setCurrentAssistantId(id);
  }, []);

  const setApiKey = useCallback((key: string) => {
    setCurrentApiKey(key);
  }, []);

  const contextValue: VapiContextType = {
    vapi,
    isConnected,
    isMuted,
    transcript,
    pendingAiResponse,
    startCall,
    endCall,
    toggleMute,
    setMuted,
    setAssistantId,
    setApiKey,
    saveConversation: saveConversationToConvex,
    onTranscriptUpdate,
    onCallStart,
    onCallEnd,
    onError,
  };

  return (
    <VapiContext.Provider value={contextValue}>
      {children}
    </VapiContext.Provider>
  );
};

export const useVapi = (): VapiContextType => {
  const context = useContext(VapiContext);
  if (context === undefined) {
    throw new Error('useVapi must be used within a VapiProvider');
  }
  return context;
};
