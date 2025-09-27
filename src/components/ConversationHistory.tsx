"use client";

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MessageSquare, Clock } from 'lucide-react';

interface ConversationHistoryProps {
  limit?: number;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  limit = 10 
}) => {
  const { user } = useUser();
  const conversations = useQuery(api.queries.getUserConversations, 
    user?.id ? { userId: user.id as any } : "skip"
  );

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Please sign in to view your conversation history.</p>
        </CardContent>
      </Card>
    );
  }

  if (!conversations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading conversations...</p>
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No conversations yet. Start a voice chat to see your history here!</p>
        </CardContent>
      </Card>
    );
  }

  const recentConversations = conversations.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Conversation History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentConversations.map((conversation: any) => (
            <div
              key={conversation._id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">{conversation.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(conversation.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {conversation.messages.length} messages
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(conversation.createdAt).toLocaleTimeString()}
                </div>
              </div>

              {/* Show first few messages as preview */}
              <div className="space-y-2">
                {conversation.messages.slice(0, 2).map((message: any, index: number) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded ${
                      message.role === 'user'
                        ? 'bg-blue-50 text-blue-800 ml-4'
                        : 'bg-gray-50 text-gray-700 mr-4'
                    }`}
                  >
                    <span className="font-medium text-xs opacity-75">
                      {message.role === 'user' ? 'You' : 'Coach'}:
                    </span>{' '}
                    {message.content.length > 100 
                      ? `${message.content.substring(0, 100)}...`
                      : message.content
                    }
                  </div>
                ))}
                
                {conversation.messages.length > 2 && (
                  <p className="text-xs text-gray-500 italic">
                    +{conversation.messages.length - 2} more messages
                  </p>
                )}
              </div>

              {/* Show trigger detection badge if applicable */}
              {conversation.messages.some((msg: any) => 
                msg.role === 'assistant' && 
                msg.content.toLowerCase().includes('i have everything i need')
              ) && (
                <div className="mt-3">
                  <Badge variant="secondary" className="text-xs">
                    Session Completed
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationHistory;
