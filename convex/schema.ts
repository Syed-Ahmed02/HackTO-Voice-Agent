import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table for authentication and user management
  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    // External auth provider ID (e.g., Clerk, Auth0)
    externalId: v.optional(v.string()),
    // User preferences and settings
    preferences: v.optional(v.object({
      units: v.union(v.literal("metric"), v.literal("imperial")),
      timezone: v.optional(v.string()),
      notifications: v.optional(v.object({
        email: v.boolean(),
        push: v.boolean(),
      })),
    })),
  })
    .index("by_external_id", ["externalId"])
    .index("by_email", ["email"]),

  // Progress tracking - weight and measurements over time
  progressEntries: defineTable({
    userId: v.id("users"),
    date: v.string(), // ISO date string
    weight: v.optional(v.number()),
    bodyFat: v.optional(v.number()),
    muscleMass: v.optional(v.number()),
    measurements: v.optional(v.object({
      chest: v.optional(v.number()),
      waist: v.optional(v.number()),
      hips: v.optional(v.number()),
      arms: v.optional(v.number()),
      thighs: v.optional(v.number()),
    })),
    notes: v.optional(v.string()),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),

  // Exercise definitions and templates
  exercises: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    category: v.union(
      v.literal("strength"),
      v.literal("cardio"),
      v.literal("flexibility"),
      v.literal("sports")
    ),
    muscleGroups: v.array(v.string()),
    equipment: v.optional(v.array(v.string())),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    // Default targets for this exercise
    defaultTargets: v.optional(v.object({
      reps: v.optional(v.number()),
      sets: v.optional(v.number()),
      weight: v.optional(v.string()),
      duration: v.optional(v.number()), // in seconds
      distance: v.optional(v.number()), // in meters
    })),
    isActive: v.boolean(),
  })
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"])
    .searchIndex("search_exercises", {
      searchField: "name",
      filterFields: ["category", "difficulty", "isActive"],
    }),

  // Workout plans and sessions
  workouts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("strength"),
      v.literal("cardio"),
      v.literal("hiit"),
      v.literal("yoga"),
      v.literal("sports"),
      v.literal("mixed")
    ),
    duration: v.number(), // in minutes
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    exercises: v.array(v.object({
      exerciseId: v.id("exercises"),
      targetReps: v.optional(v.number()),
      targetSets: v.optional(v.number()),
      targetWeight: v.optional(v.string()),
      targetDuration: v.optional(v.number()),
      targetDistance: v.optional(v.number()),
      restTime: v.optional(v.number()), // in seconds
      order: v.number(),
    })),
    isTemplate: v.boolean(), // true for reusable templates
    isActive: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_type", ["userId", "type"])
    .index("by_user_template", ["userId", "isTemplate"]),

  // Workout sessions - actual completed workouts
  workoutSessions: defineTable({
    userId: v.id("users"),
    workoutId: v.id("workouts"),
    date: v.string(), // ISO date string
    startTime: v.string(), // ISO datetime string
    endTime: v.optional(v.string()), // ISO datetime string
    actualDuration: v.optional(v.number()), // in minutes
    exercises: v.array(v.object({
      exerciseId: v.id("exercises"),
      sets: v.array(v.object({
        reps: v.optional(v.number()),
        weight: v.optional(v.string()),
        duration: v.optional(v.number()),
        distance: v.optional(v.number()),
        restTime: v.optional(v.number()),
        notes: v.optional(v.string()),
      })),
    })),
    notes: v.optional(v.string()),
    rating: v.optional(v.number()), // 1-5 scale
    caloriesBurned: v.optional(v.number()),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user_workout", ["userId", "workoutId"])
    .index("by_workout", ["workoutId"]),

  // Nutrition tracking - daily macro targets
  nutritionTargets: defineTable({
    userId: v.id("users"),
    date: v.string(), // ISO date string
    calories: v.number(),
    protein: v.number(), // in grams
    carbs: v.number(), // in grams
    fat: v.number(), // in grams
    fiber: v.optional(v.number()),
    sugar: v.optional(v.number()),
    sodium: v.optional(v.number()),
    water: v.optional(v.number()), // in liters
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),

  // Food items and meals
  meals: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack"),
      v.literal("pre-workout"),
      v.literal("post-workout")
    ),
    date: v.string(), // ISO date string
    time: v.string(), // Time string like "8:00 AM"
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    fiber: v.optional(v.number()),
    sugar: v.optional(v.number()),
    sodium: v.optional(v.number()),
    ingredients: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    // Reference to nutrition target for the day
    nutritionTargetId: v.optional(v.id("nutritionTargets")),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user_type", ["userId", "type"])
    .index("by_user_date_type", ["userId", "date", "type"]),

  // Diary entries for mood and reflection
  diaryEntries: defineTable({
    userId: v.id("users"),
    date: v.string(), // ISO date string
    time: v.string(), // Time string like "9:15 AM"
    entry: v.string(),
    mood: v.union(
      v.literal("excited"),
      v.literal("energetic"),
      v.literal("happy"),
      v.literal("content"),
      v.literal("neutral"),
      v.literal("tired"),
      v.literal("stressed"),
      v.literal("sad"),
      v.literal("anxious")
    ),
    energyLevel: v.optional(v.number()), // 1-10 scale
    sleepHours: v.optional(v.number()),
    stressLevel: v.optional(v.number()), // 1-10 scale
    tags: v.optional(v.array(v.string())),
    // AI-generated recommendations
    recommendations: v.optional(v.array(v.string())),
    // Related workout session
    workoutSessionId: v.optional(v.id("workoutSessions")),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user_mood", ["userId", "mood"])
    .searchIndex("search_entries", {
      searchField: "entry",
      filterFields: ["userId", "mood", "date"],
    }),

  // Long-term vision and goals
  visions: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("fitness"),
      v.literal("nutrition"),
      v.literal("health"),
      v.literal("lifestyle"),
      v.literal("career"),
      v.literal("personal")
    ),
    targetDate: v.optional(v.string()), // ISO date string
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("paused"),
      v.literal("cancelled")
    ),
    milestones: v.optional(v.array(v.object({
      title: v.string(),
      description: v.optional(v.string()),
      targetDate: v.optional(v.string()),
      completed: v.boolean(),
      completedDate: v.optional(v.string()),
    }))),
    createdAt: v.string(), // ISO datetime string
    updatedAt: v.string(), // ISO datetime string
  })
    .index("by_user", ["userId"])
    .index("by_user_category", ["userId", "category"])
    .index("by_user_status", ["userId", "status"])
    .index("by_user_priority", ["userId", "priority"]),

  // Chatbot conversations for AI assistance
  chatbotConversations: defineTable({
    userId: v.id("users"),
    title: v.optional(v.string()),
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      timestamp: v.string(), // ISO datetime string
    })),
    context: v.optional(v.object({
      currentWorkout: v.optional(v.id("workouts")),
      currentNutritionTarget: v.optional(v.id("nutritionTargets")),
      recentDiaryEntry: v.optional(v.id("diaryEntries")),
    })),
    createdAt: v.string(), // ISO datetime string
    updatedAt: v.string(), // ISO datetime string
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"]),
});
