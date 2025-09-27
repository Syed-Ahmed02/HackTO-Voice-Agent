"use client";

import React from 'react';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { useVapi } from '@/contexts/VapiContext';

interface VapiVoiceButtonProps {
  // Button appearance
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  
  // Button behavior
  showEndButton?: boolean;
  showMuteButton?: boolean;
  startMuted?: boolean;
  
  // Custom assistant ID for this button
  assistantId?: string;
  
  // Callbacks
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onMuteToggle?: (muted: boolean) => void;
  
  // Button text
  startText?: string;
  endText?: string;
  muteText?: string;
  unmuteText?: string;
  
  // Disabled state
  disabled?: boolean;
}

export const VapiVoiceButton: React.FC<VapiVoiceButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  showEndButton = true,
  showMuteButton = true,
  startMuted = true,
  assistantId,
  onCallStart,
  onCallEnd,
  onMuteToggle,
  startText = 'Start Voice Chat',
  endText = 'End Call',
  muteText = 'Mute',
  unmuteText = 'Unmute',
  disabled = false,
}) => {
  const {
    isConnected,
    isMuted,
    startCall,
    endCall,
    toggleMute,
    setMuted,
  } = useVapi();

  const handleStartCall = () => {
    if (startMuted) {
      setMuted(true);
    }
    startCall(assistantId);
    onCallStart?.();
  };

  const handleEndCall = () => {
    endCall();
    onCallEnd?.();
  };

  const handleToggleMute = () => {
    toggleMute();
    onMuteToggle?.(!isMuted);
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: {
      start: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg',
      end: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg',
      mute: isMuted 
        ? 'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg'
        : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg',
    },
    secondary: {
      start: 'bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 shadow-md',
      end: 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 shadow-md',
      mute: isMuted
        ? 'bg-white border-2 border-gray-500 text-gray-500 hover:bg-gray-50 shadow-md'
        : 'bg-white border-2 border-green-500 text-green-500 hover:bg-green-50 shadow-md',
    },
    minimal: {
      start: 'bg-transparent text-blue-500 hover:bg-blue-50 border border-blue-200',
      end: 'bg-transparent text-red-500 hover:bg-red-50 border border-red-200',
      mute: isMuted
        ? 'bg-transparent text-gray-500 hover:bg-gray-50 border border-gray-200'
        : 'bg-transparent text-green-500 hover:bg-green-50 border border-green-200',
    },
  };

  const baseClasses = 'rounded-full transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

  if (!isConnected) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <button
          onClick={handleStartCall}
          disabled={disabled}
          className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant].start}`}
          title={startText}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {showMuteButton && (
        <button
          onClick={handleToggleMute}
          disabled={disabled}
          className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant].mute}`}
          title={isMuted ? unmuteText : muteText}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      )}
      
      {showEndButton && (
        <button
          onClick={handleEndCall}
          disabled={disabled}
          className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant].end}`}
          title={endText}
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

// Convenience components for common use cases
export const VapiStartButton: React.FC<Omit<VapiVoiceButtonProps, 'showEndButton' | 'showMuteButton'>> = (props) => (
  <VapiVoiceButton {...props} showEndButton={false} showMuteButton={false} />
);

export const VapiMuteButton: React.FC<Omit<VapiVoiceButtonProps, 'showEndButton'>> = (props) => (
  <VapiVoiceButton {...props} showEndButton={false} />
);

export const VapiEndButton: React.FC<Omit<VapiVoiceButtonProps, 'showMuteButton'>> = (props) => (
  <VapiVoiceButton {...props} showMuteButton={false} />
);

export default VapiVoiceButton;
