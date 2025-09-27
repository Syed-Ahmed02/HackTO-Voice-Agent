import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Save a chatbot conversation to the database
export const saveConversation = mutation({
  args: {
    userId: v.id("users"),
    title: v.optional(v.string()),
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      timestamp: v.string(),
    })),
    context: v.optional(v.object({
      currentWorkout: v.optional(v.id("workouts")),
      currentNutritionTarget: v.optional(v.id("nutritionTargets")),
      recentDiaryEntry: v.optional(v.id("diaryEntries")),
    })),
    triggerDetected: v.optional(v.boolean()),
    triggerMessage: v.optional(v.string()),
    detectedIn: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const conversationId = await ctx.db.insert("chatbotConversations", {
      userId: args.userId,
      title: args.title || `Conversation ${new Date().toLocaleDateString()}`,
      messages: args.messages,
      context: args.context,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // If trigger was detected, we could also create a diary entry or update user progress
    if (args.triggerDetected) {
      console.log(`Trigger message "${args.triggerMessage}" detected in conversation ${conversationId}`);
      
      // Optionally create a diary entry about the conversation
      await ctx.db.insert("diaryEntries", {
        userId: args.userId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        entry: `Completed AI coaching session. Trigger phrase "${args.triggerMessage}" was mentioned.`,
        mood: "content",
        tags: ["ai-coaching", "session-complete"],
        recommendations: [
          "Review the conversation insights",
          "Apply the coaching advice",
          "Schedule follow-up if needed"
        ],
      });
    }

    return conversationId;
  },
});

// Get conversations for a specific user
export const getUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatbotConversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get a specific conversation
export const getConversation = query({
  args: { conversationId: v.id("chatbotConversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

// Update conversation title
export const updateConversationTitle = mutation({
  args: {
    conversationId: v.id("chatbotConversations"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      title: args.title,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Delete a conversation
export const deleteConversation = mutation({
  args: { conversationId: v.id("chatbotConversations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.conversationId);
  },
});

// Get recent conversations for dashboard
export const getRecentConversations = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatbotConversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 5);
  },
});

// Search conversations by content
export const searchConversations = query({
  args: { 
    userId: v.id("users"), 
    searchTerm: v.string() 
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("chatbotConversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter conversations that contain the search term in messages
    return conversations.filter(conversation => 
      conversation.messages.some(message => 
        message.content.toLowerCase().includes(args.searchTerm.toLowerCase())
      )
    );
  },
});
