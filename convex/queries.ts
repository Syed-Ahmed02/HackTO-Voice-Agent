import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all users
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Get user by ID
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get all exercises
export const getExercises = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("exercises").filter((q) => q.eq(q.field("isActive"), true)).collect();
  },
});

// Get exercises by category
export const getExercisesByCategory = query({
  args: { category: v.union(v.literal("strength"), v.literal("cardio"), v.literal("flexibility"), v.literal("sports")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exercises")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get all workouts for a user
export const getUserWorkouts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get workout templates
export const getWorkoutTemplates = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workouts")
      .withIndex("by_user_template", (q) => q.eq("userId", args.userId).eq("isTemplate", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Get workout sessions for a user
export const getUserWorkoutSessions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);
  },
});

// Get recent workout sessions
export const getRecentWorkoutSessions = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 5);
  },
});

// Get progress entries for a user
export const getUserProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("progressEntries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get recent progress entries
export const getRecentProgress = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("progressEntries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 7);
  },
});

// Get nutrition targets for a user
export const getUserNutritionTargets = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("nutritionTargets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get meals for a specific date
export const getMealsByDate = query({
  args: { userId: v.id("users"), date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("meals")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId).eq("date", args.date))
      .collect();
  },
});

// Get recent meals
export const getRecentMeals = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("meals")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 10);
  },
});

// Get diary entries for a user
export const getUserDiaryEntries = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("diaryEntries")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get recent diary entries
export const getRecentDiaryEntries = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("diaryEntries")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 5);
  },
});

// Get diary entries by mood
export const getDiaryEntriesByMood = query({
  args: { userId: v.id("users"), mood: v.union(v.literal("excited"), v.literal("energetic"), v.literal("happy"), v.literal("content"), v.literal("neutral"), v.literal("tired"), v.literal("stressed"), v.literal("sad"), v.literal("anxious")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("diaryEntries")
      .withIndex("by_user_mood", (q) => q.eq("userId", args.userId).eq("mood", args.mood))
      .order("desc")
      .collect();
  },
});

// Get visions/goals for a user
export const getUserVisions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("visions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get visions by status
export const getVisionsByStatus = query({
  args: { userId: v.id("users"), status: v.union(v.literal("not_started"), v.literal("in_progress"), v.literal("completed"), v.literal("paused"), v.literal("cancelled")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("visions")
      .withIndex("by_user_status", (q) => q.eq("userId", args.userId).eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// Get chatbot conversations for a user
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

// Get recent conversations
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

// Search exercises by name (using filter instead of search index)
export const searchExercises = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exercises")
      .filter((q) => 
        q.and(
          q.eq(q.field("isActive"), true),
          q.or(
            q.eq(q.field("name"), args.searchTerm),
            q.gt(q.field("name"), args.searchTerm)
          )
        )
      )
      .collect();
  },
});

// Search diary entries (using filter instead of search index)
export const searchDiaryEntries = query({
  args: { userId: v.id("users"), searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("diaryEntries")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.or(
            q.eq(q.field("entry"), args.searchTerm),
            q.gt(q.field("entry"), args.searchTerm)
          )
        )
      )
      .collect();
  },
});

// Get dashboard data for a user
export const getDashboardData = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const [
      recentProgress,
      recentSessions,
      recentMeals,
      recentDiaryEntries,
      activeVisions,
    ] = await Promise.all([
      ctx.db
        .query("progressEntries")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .take(7),
      ctx.db
        .query("workoutSessions")
        .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
        .order("desc")
        .take(5),
      ctx.db
        .query("meals")
        .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
        .order("desc")
        .take(10),
      ctx.db
        .query("diaryEntries")
        .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
        .order("desc")
        .take(5),
      ctx.db
        .query("visions")
        .withIndex("by_user_status", (q) => q.eq("userId", args.userId).eq("status", "in_progress"))
        .collect(),
    ]);

    return {
      recentProgress,
      recentSessions,
      recentMeals,
      recentDiaryEntries,
      activeVisions,
    };
  },
});
