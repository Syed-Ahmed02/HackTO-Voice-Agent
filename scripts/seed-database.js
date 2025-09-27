#!/usr/bin/env node

/**
 * Script to seed the Convex database with dummy data
 * 
 * Usage:
 *   node scripts/seed-database.js
 * 
 * Make sure you have:
 * 1. Convex dev server running (npx convex dev)
 * 2. Proper environment variables set up
 */

const { ConvexHttpClient } = require("convex/browser");

async function seedDatabase() {
  try {
    // Initialize Convex client
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    
    console.log("🌱 Starting database seeding...");
    
    // Call the seed function
    const result = await client.mutation("seed:seedDatabase", {});
    
    console.log("✅ Database seeded successfully!");
    console.log("📊 Summary:");
    console.log(`   - Users created: ${result.usersCreated}`);
    console.log(`   - Exercises created: ${result.exercisesCreated}`);
    console.log(`   - Workouts created: ${result.workoutsCreated}`);
    console.log(`   - Workout sessions created: ${result.sessionsCreated}`);
    console.log(`   - Progress entries created: ${result.progressEntriesCreated}`);
    console.log(`   - Meals created: ${result.mealsCreated}`);
    console.log(`   - Diary entries created: ${result.diaryEntriesCreated}`);
    console.log(`   - Visions created: ${result.visionsCreated}`);
    console.log(`   - Conversations created: ${result.conversationsCreated}`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
