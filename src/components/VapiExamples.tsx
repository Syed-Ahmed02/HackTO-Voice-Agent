"use client";

import React from 'react';
import { VapiVoiceButton, VapiStartButton, VapiMuteButton, VapiEndButton } from './VapiVoiceButton';

export const VapiExamples: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Vapi Voice Button Examples</h2>
      
      {/* Example 1: Full Control Button */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Full Control Button</h3>
        <p className="text-gray-600 mb-4">
          Complete voice control with start, mute, and end functionality.
        </p>
        <VapiVoiceButton
          size="lg"
          variant="primary"
          assistantId="7cf2fed6-379a-49de-9230-1b81c355b98b"
        />
      </div>

      {/* Example 2: Start Only Button */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Start Only Button</h3>
        <p className="text-gray-600 mb-4">
          Simple button to start a voice conversation.
        </p>
        <VapiStartButton
          size="md"
          variant="secondary"
          startText="Talk to Coach"
          assistantId="7cf2fed6-379a-49de-9230-1b81c355b98b"
        />
      </div>

      {/* Example 3: Minimal Style */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Minimal Style</h3>
        <p className="text-gray-600 mb-4">
          Subtle button that fits into any design.
        </p>
        <VapiVoiceButton
          size="sm"
          variant="minimal"
          className="border-2 border-dashed border-gray-300"
        />
      </div>

      {/* Example 4: Custom Callbacks */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">With Custom Callbacks</h3>
        <p className="text-gray-600 mb-4">
          Button with custom event handlers for analytics or logging.
        </p>
        <VapiVoiceButton
          size="md"
          variant="primary"
          onCallStart={() => {
            console.log('Voice call started');
            // Add analytics tracking here
          }}
          onCallEnd={() => {
            console.log('Voice call ended');
            // Add analytics tracking here
          }}
          onMuteToggle={(muted) => {
            console.log('Mute toggled:', muted);
            // Add analytics tracking here
          }}
        />
      </div>

      {/* Example 5: Different Assistant IDs */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Different Assistants</h3>
        <p className="text-gray-600 mb-4">
          Buttons that connect to different AI assistants.
        </p>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Fitness Coach</p>
            <VapiStartButton
              size="sm"
              variant="primary"
              assistantId="fitness-coach-id"
              startText="Fitness"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Nutrition Expert</p>
            <VapiStartButton
              size="sm"
              variant="secondary"
              assistantId="nutrition-expert-id"
              startText="Nutrition"
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Motivation Coach</p>
            <VapiStartButton
              size="sm"
              variant="minimal"
              assistantId="motivation-coach-id"
              startText="Motivation"
            />
          </div>
        </div>
      </div>

      {/* Example 6: Inline Usage */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Inline Usage</h3>
        <p className="text-gray-600 mb-4">
          Voice buttons can be embedded anywhere in your UI.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Need help? </span>
          <VapiStartButton
            size="sm"
            variant="minimal"
            startText="Ask AI"
          />
          <span className="text-gray-500 text-sm">or</span>
          <button className="text-blue-500 hover:text-blue-700 text-sm underline">
            read our FAQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default VapiExamples;
