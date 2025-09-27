# Database Seeding Guide

This guide explains how to populate your Convex database with sample data for development and testing.

## Files Created

- `convex/seed.ts` - Contains the seeding functions
- `convex/queries.ts` - Contains query functions to retrieve data
- `scripts/seed-database.js` - Node.js script to run seeding

## How to Seed the Database

### Method 1: Using Convex Dashboard (Recommended)

1. Start your Convex development server:
   ```bash
   npx convex dev
   ```

2. Open the Convex dashboard in your browser (usually at `http://localhost:3000`)

3. Navigate to the "Functions" tab

4. Find the `seed:seedDatabase` function and click "Run"

5. The function will populate your database with sample data

### Method 2: Using the Node.js Script

1. Make sure you have your environment variables set up:
   ```bash
   # In your .env.local file
   NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
   ```

2. Run the seeding script:
   ```bash
   node scripts/seed-database.js
   ```

### Method 3: Using Convex CLI

1. Start your Convex development server:
   ```bash
   npx convex dev
   ```

2. In another terminal, run:
   ```bash
   npx convex run seed:seedDatabase
   ```

## What Gets Created

The seeding function creates the following sample data:

### Users (2 users)
- **Alex Johnson** - Primary user with full data
- **Sarah Chen** - Secondary user for testing multi-user scenarios

### Exercises (6 exercises)
- Bicep Curls
- Squats  
- Push-ups
- Deadlifts
- Running
- Plank

### Workouts (2 workout templates)
- Upper Body Strength
- Lower Body Power

### Workout Sessions (2 sessions)
- Recent upper body session
- Previous lower body session

### Progress Entries (4 entries)
- Weight tracking over the past week
- Body measurements and notes

### Nutrition Data
- Daily nutrition targets
- Sample meals (breakfast, lunch, snack, dinner)

### Diary Entries (2 entries)
- Recent energetic entry
- Previous tired entry with recommendations

### Visions/Goals (2 goals)
- Weight loss and muscle building goal
- Half marathon running goal

### Chatbot Conversation (1 conversation)
- Sample conversation about workout planning

## Clearing the Database

To clear all data and start fresh:

1. Use the Convex dashboard to run `seed:clearDatabase`
2. Or run: `npx convex run seed:clearDatabase`

## Querying the Data

Use the query functions in `convex/queries.ts` to retrieve data:

```typescript
// Get all users
const users = await ctx.runQuery("queries:getUsers", {});

// Get exercises by category
const strengthExercises = await ctx.runQuery("queries:getExercisesByCategory", { 
  category: "strength" 
});

// Get dashboard data for a user
const dashboardData = await ctx.runQuery("queries:getDashboardData", { 
  userId: "user_id_here" 
});
```

## Customizing the Seed Data

To modify the sample data:

1. Edit the `seedDatabase` function in `convex/seed.ts`
2. Adjust the data objects as needed
3. Run the seeding function again

## Best Practices

1. **Always seed in development** - Never run seeding functions in production
2. **Clear before seeding** - Use `clearDatabase` before seeding to avoid duplicates
3. **Test your queries** - Use the query functions to verify the data was created correctly
4. **Customize for your needs** - Modify the seed data to match your application's requirements

## Troubleshooting

### Common Issues

1. **"Function not found"** - Make sure your Convex dev server is running
2. **"Permission denied"** - Check your Convex authentication setup
3. **"Schema validation error"** - Ensure your schema matches the data structure

### Getting Help

- Check the Convex documentation: https://docs.convex.dev
- Review the schema in `convex/schema.ts`
- Check the query functions in `convex/queries.ts`
