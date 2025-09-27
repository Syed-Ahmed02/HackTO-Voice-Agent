import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Seed function to populate the database with dummy data
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Create sample users
    const user1Id = await ctx.db.insert("users", {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      externalId: "auth0|123456789",
      preferences: {
        units: "metric",
        timezone: "America/New_York",
        notifications: {
          email: true,
          push: true,
        },
      },
    });

    const user2Id = await ctx.db.insert("users", {
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      externalId: "auth0|987654321",
      preferences: {
        units: "imperial",
        timezone: "America/Los_Angeles",
        notifications: {
          email: true,
          push: false,
        },
      },
    });

    // Create sample exercises
    const exercises = [
      {
        name: "Bicep Curls",
        description: "Classic bicep isolation exercise using dumbbells",
        category: "strength" as const,
        muscleGroups: ["biceps", "forearms"],
        equipment: ["dumbbells"],
        difficulty: "beginner" as const,
        defaultTargets: {
          reps: 12,
          sets: 3,
          weight: "10-15 lbs",
        },
        isActive: true,
      },
      {
        name: "Squats",
        description: "Compound lower body exercise",
        category: "strength" as const,
        muscleGroups: ["quadriceps", "glutes", "hamstrings", "calves"],
        equipment: [],
        difficulty: "beginner" as const,
        defaultTargets: {
          reps: 15,
          sets: 3,
          weight: "bodyweight",
        },
        isActive: true,
      },
      {
        name: "Push-ups",
        description: "Upper body strength exercise",
        category: "strength" as const,
        muscleGroups: ["chest", "shoulders", "triceps"],
        equipment: [],
        difficulty: "beginner" as const,
        defaultTargets: {
          reps: 10,
          sets: 3,
          weight: "bodyweight",
        },
        isActive: true,
      },
      {
        name: "Deadlifts",
        description: "Compound posterior chain exercise",
        category: "strength" as const,
        muscleGroups: ["hamstrings", "glutes", "lower back", "traps"],
        equipment: ["barbell", "plates"],
        difficulty: "intermediate" as const,
        defaultTargets: {
          reps: 8,
          sets: 3,
          weight: "135 lbs",
        },
        isActive: true,
      },
      {
        name: "Running",
        description: "Cardiovascular endurance exercise",
        category: "cardio" as const,
        muscleGroups: ["legs", "core"],
        equipment: [],
        difficulty: "beginner" as const,
        defaultTargets: {
          duration: 1800, // 30 minutes
          distance: 5000, // 5km
        },
        isActive: true,
      },
      {
        name: "Plank",
        description: "Core stability exercise",
        category: "strength" as const,
        muscleGroups: ["core", "shoulders"],
        equipment: [],
        difficulty: "beginner" as const,
        defaultTargets: {
          duration: 60, // 60 seconds
          sets: 3,
        },
        isActive: true,
      },
    ];

    const exerciseIds = [];
    for (const exercise of exercises) {
      const exerciseId = await ctx.db.insert("exercises", exercise);
      exerciseIds.push(exerciseId);
    }

    // Create sample workouts
    const upperBodyWorkoutId = await ctx.db.insert("workouts", {
      userId: user1Id,
      name: "Upper Body Strength",
      description: "Focus on chest, shoulders, and arms",
      type: "strength" as const,
      duration: 45,
      difficulty: "intermediate" as const,
      exercises: [
        {
          exerciseId: exerciseIds[0], // Bicep Curls
          targetReps: 12,
          targetSets: 3,
          targetWeight: "15 lbs",
          restTime: 60,
          order: 1,
        },
        {
          exerciseId: exerciseIds[2], // Push-ups
          targetReps: 15,
          targetSets: 3,
          targetWeight: "bodyweight",
          restTime: 90,
          order: 2,
        },
      ],
      isTemplate: true,
      isActive: true,
    });

    const lowerBodyWorkoutId = await ctx.db.insert("workouts", {
      userId: user1Id,
      name: "Lower Body Power",
      description: "Legs and glutes focus",
      type: "strength" as const,
      duration: 50,
      difficulty: "intermediate" as const,
      exercises: [
        {
          exerciseId: exerciseIds[1], // Squats
          targetReps: 15,
          targetSets: 4,
          targetWeight: "bodyweight",
          restTime: 90,
          order: 1,
        },
        {
          exerciseId: exerciseIds[3], // Deadlifts
          targetReps: 8,
          targetSets: 3,
          targetWeight: "135 lbs",
          restTime: 120,
          order: 2,
        },
      ],
      isTemplate: true,
      isActive: true,
    });

    // Create sample workout sessions
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    await ctx.db.insert("workoutSessions", {
      userId: user1Id,
      workoutId: upperBodyWorkoutId,
      date: today,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      actualDuration: 45,
      exercises: [
        {
          exerciseId: exerciseIds[0],
          sets: [
            { reps: 12, weight: "15 lbs", notes: "Good form" },
            { reps: 10, weight: "15 lbs", notes: "Slightly tired" },
            { reps: 8, weight: "15 lbs", notes: "Last set was tough" },
          ],
        },
        {
          exerciseId: exerciseIds[2],
          sets: [
            { reps: 15, weight: "bodyweight", notes: "Perfect form" },
            { reps: 12, weight: "bodyweight", notes: "Good" },
            { reps: 10, weight: "bodyweight", notes: "Struggled on last few" },
          ],
        },
      ],
      notes: "Great workout! Felt strong today.",
      rating: 4,
      caloriesBurned: 320,
    });

    await ctx.db.insert("workoutSessions", {
      userId: user1Id,
      workoutId: lowerBodyWorkoutId,
      date: yesterday,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 50 * 60 * 1000).toISOString(),
      actualDuration: 50,
      exercises: [
        {
          exerciseId: exerciseIds[1],
          sets: [
            { reps: 15, weight: "bodyweight", notes: "Warm up set" },
            { reps: 15, weight: "bodyweight", notes: "Good depth" },
            { reps: 12, weight: "bodyweight", notes: "Felt the burn" },
            { reps: 10, weight: "bodyweight", notes: "Last set" },
          ],
        },
        {
          exerciseId: exerciseIds[3],
          sets: [
            { reps: 8, weight: "135 lbs", notes: "Perfect form" },
            { reps: 8, weight: "135 lbs", notes: "Good" },
            { reps: 6, weight: "135 lbs", notes: "Tough but completed" },
          ],
        },
      ],
      notes: "Legs are feeling it today!",
      rating: 5,
      caloriesBurned: 450,
    });

    // Create sample progress entries
    const progressDates = [
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
    ];

    for (let i = 0; i < progressDates.length; i++) {
      await ctx.db.insert("progressEntries", {
        userId: user1Id,
        date: progressDates[i],
        weight: 75.5 - (i * 0.2), // Gradual weight loss
        bodyFat: 15.2 - (i * 0.1),
        muscleMass: 65.8 + (i * 0.1),
        measurements: {
          chest: 100 - (i * 0.5),
          waist: 85 - (i * 0.3),
          hips: 95 - (i * 0.2),
          arms: 35 + (i * 0.1),
          thighs: 58 - (i * 0.2),
        },
        notes: i === 0 ? "Starting new program" : `Day ${i + 1} of program`,
      });
    }

    // Create sample nutrition targets
    await ctx.db.insert("nutritionTargets", {
      userId: user1Id,
      date: today,
      calories: 2200,
      protein: 150,
      carbs: 250,
      fat: 80,
      fiber: 35,
      sugar: 50,
      sodium: 2300,
      water: 3.0,
    });

    await ctx.db.insert("nutritionTargets", {
      userId: user1Id,
      date: yesterday,
      calories: 2200,
      protein: 150,
      carbs: 250,
      fat: 80,
      fiber: 35,
      sugar: 50,
      sodium: 2300,
      water: 3.0,
    });

    // Create sample meals
    const meals = [
      {
        name: "Greek Yogurt with Berries",
        type: "breakfast" as const,
        time: "8:00 AM",
        calories: 250,
        protein: 20,
        carbs: 30,
        fat: 8,
        fiber: 5,
        sugar: 20,
        sodium: 150,
        ingredients: ["Greek yogurt", "Mixed berries", "Honey", "Granola"],
        notes: "Delicious and filling",
      },
      {
        name: "Grilled Chicken Salad",
        type: "lunch" as const,
        time: "12:30 PM",
        calories: 400,
        protein: 35,
        carbs: 25,
        fat: 18,
        fiber: 8,
        sugar: 12,
        sodium: 600,
        ingredients: ["Chicken breast", "Mixed greens", "Avocado", "Cherry tomatoes", "Olive oil"],
        notes: "Perfect post-workout meal",
      },
      {
        name: "Protein Smoothie",
        type: "snack" as const,
        time: "3:00 PM",
        calories: 180,
        protein: 25,
        carbs: 15,
        fat: 4,
        fiber: 3,
        sugar: 8,
        sodium: 200,
        ingredients: ["Protein powder", "Banana", "Almond milk", "Spinach"],
        notes: "Quick and nutritious",
      },
      {
        name: "Salmon with Quinoa",
        type: "dinner" as const,
        time: "7:00 PM",
        calories: 550,
        protein: 40,
        carbs: 45,
        fat: 22,
        fiber: 6,
        sugar: 8,
        sodium: 500,
        ingredients: ["Salmon fillet", "Quinoa", "Broccoli", "Lemon", "Herbs"],
        notes: "Great end to the day",
      },
    ];

    for (const meal of meals) {
      await ctx.db.insert("meals", {
        userId: user1Id,
        ...meal,
        date: today,
      });
    }

    // Create sample diary entries
    await ctx.db.insert("diaryEntries", {
      userId: user1Id,
      date: today,
      time: "9:15 AM",
      entry: "Feeling energetic after breakfast. Ready for today's upper body workout! The weather is perfect and I'm motivated to push myself.",
      mood: "energetic" as const,
      energyLevel: 8,
      sleepHours: 7.5,
      stressLevel: 3,
      tags: ["motivated", "energetic", "workout"],
      recommendations: [
        "Increase protein intake by 10g",
        "Add 15 minutes to cardio session",
        "Consider adding more complex carbs pre-workout"
      ],
    });

    await ctx.db.insert("diaryEntries", {
      userId: user1Id,
      date: yesterday,
      time: "7:30 PM",
      entry: "Completed full workout but felt tired. Maybe need more sleep. The deadlifts were particularly challenging today.",
      mood: "tired" as const,
      energyLevel: 5,
      sleepHours: 6.5,
      stressLevel: 6,
      tags: ["tired", "challenging", "deadlifts"],
      recommendations: [
        "Aim for 8 hours of sleep",
        "Consider reducing workout intensity",
        "Add more recovery time between sets"
      ],
    });

    // Create sample visions/goals
    await ctx.db.insert("visions", {
      userId: user1Id,
      title: "Lose 10kg and Build Muscle",
      description: "My goal is to lose 10kg of body fat while building lean muscle mass. I want to achieve a more toned and athletic physique through consistent training and proper nutrition.",
      category: "fitness" as const,
      targetDate: "2024-06-01",
      priority: "high" as const,
      status: "in_progress" as const,
      milestones: [
        {
          title: "Lose first 3kg",
          description: "Initial weight loss milestone",
          targetDate: "2024-02-01",
          completed: true,
          completedDate: "2024-01-15",
        },
        {
          title: "Complete 30 workout sessions",
          description: "Consistency milestone",
          targetDate: "2024-03-01",
          completed: false,
        },
        {
          title: "Reach 12% body fat",
          description: "Body composition goal",
          targetDate: "2024-05-01",
          completed: false,
        },
      ],
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: new Date().toISOString(),
    });

    await ctx.db.insert("visions", {
      userId: user1Id,
      title: "Run a Half Marathon",
      description: "Complete my first half marathon in under 2 hours. This will require building endurance and maintaining consistent training.",
      category: "fitness" as const,
      targetDate: "2024-09-15",
      priority: "medium" as const,
      status: "not_started" as const,
      milestones: [
        {
          title: "Run 5km without stopping",
          description: "Build base endurance",
          targetDate: "2024-03-01",
          completed: false,
        },
        {
          title: "Run 10km",
          description: "Double the distance",
          targetDate: "2024-05-01",
          completed: false,
        },
        {
          title: "Run 15km",
          description: "Close to half marathon distance",
          targetDate: "2024-07-01",
          completed: false,
        },
      ],
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: new Date().toISOString(),
    });

    // Create sample chatbot conversation
    await ctx.db.insert("chatbotConversations", {
      userId: user1Id,
      title: "Workout Planning Discussion",
      messages: [
        {
          role: "user" as const,
          content: "I want to start a new workout routine. What would you recommend for someone who's been inactive for a few months?",
          timestamp: "2024-01-15T10:00:00Z",
        },
        {
          role: "assistant" as const,
          content: "Great question! For someone getting back into fitness after a break, I'd recommend starting with a 3-day full-body routine focusing on compound movements. This will help you build a solid foundation while avoiding overtraining. Would you like me to create a specific plan for you?",
          timestamp: "2024-01-15T10:01:00Z",
        },
        {
          role: "user" as const,
          content: "Yes, that sounds perfect! I have access to a gym with basic equipment.",
          timestamp: "2024-01-15T10:02:00Z",
        },
        {
          role: "assistant" as const,
          content: "Perfect! I'll create a beginner-friendly 3-day routine using basic gym equipment. The routine will include squats, push-ups, rows, and planks. Each workout should take about 30-45 minutes. I'll also include some cardio recommendations for your off days.",
          timestamp: "2024-01-15T10:03:00Z",
        },
      ],
      context: {
        currentWorkout: upperBodyWorkoutId,
        currentNutritionTarget: undefined,
        recentDiaryEntry: undefined,
      },
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:03:00Z",
    });

    return {
      message: "Database seeded successfully!",
      usersCreated: 2,
      exercisesCreated: exercises.length,
      workoutsCreated: 2,
      sessionsCreated: 2,
      progressEntriesCreated: progressDates.length,
      mealsCreated: meals.length,
      diaryEntriesCreated: 2,
      visionsCreated: 2,
      conversationsCreated: 1,
    };
  },
});

// Function to clear all data (useful for testing)
export const clearDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "chatbotConversations",
      "visions", 
      "diaryEntries",
      "meals",
      "nutritionTargets",
      "progressEntries",
      "workoutSessions",
      "workouts",
      "exercises",
      "users"
    ];

    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    return { message: "Database cleared successfully!" };
  },
});
