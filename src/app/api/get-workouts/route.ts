// File: app/api/get-workouts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface WorkoutExercise {
  id: number;
  name: string;
  targetReps: number;
  targetSets: number;
  targetWeight: string;
  instructions?: string;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface WorkoutPlan {
  id: string;
  name: string;
  date: string;
  duration: string;
  exercises: WorkoutExercise[];
  benefits: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  restBetweenSets?: string;
  warmUpInstructions?: string;
  coolDownInstructions?: string;
}

interface GeneratedWorkouts {
  immediate: WorkoutPlan[];
  weekly: WorkoutPlan[];
  upcoming: WorkoutPlan[];
}

interface WorkoutFile {
  sessionId: string;
  generatedAt: string;
  userProfile: {
    preferences: string[];
    constraints: string[];
    goals: string[];
    timeAvailability: string;
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  };
  workoutPlans: GeneratedWorkouts;
  metadata: {
    totalWorkouts: number;
    fitnessLevel: string;
  };
}

export async function GET(req: NextRequest) {
  console.log('🔍 API route called - GET /api/get-workouts');
  
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Define the workouts directory
    const workoutsDir = path.join(process.cwd(), 'data', 'workouts');
    console.log('📁 Workouts directory:', workoutsDir);
    
    // Check if directory exists
    try {
      await fs.access(workoutsDir);
    } catch {
      console.log('📂 Workouts directory does not exist, creating...');
      await fs.mkdir(workoutsDir, { recursive: true });
      return NextResponse.json({
        success: true,
        message: 'No workout files found',
        workouts: {
          immediate: [],
          weekly: [],
          upcoming: []
        },
        totalFiles: 0,
        timestamp: new Date().toISOString()
      });
    }
    
    // Read all workout files
    const files = await fs.readdir(workoutsDir);
    const workoutFiles = files.filter(file => file.startsWith('generated-workouts-') && file.endsWith('.json'));
    
    console.log('📋 Found workout files:', workoutFiles.length);
    
    if (workoutFiles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No workout files found',
        workouts: {
          immediate: [],
          weekly: [],
          upcoming: []
        },
        totalFiles: 0,
        timestamp: new Date().toISOString()
      });
    }
    
    // Sort files by timestamp (newest first)
    workoutFiles.sort((a, b) => {
      const timestampA = parseInt(a.match(/generated-workouts-(\d+)\.json/)?.[1] || '0');
      const timestampB = parseInt(b.match(/generated-workouts-(\d+)\.json/)?.[1] || '0');
      return timestampB - timestampA;
    });
    
    // Load and combine workout data
    const allWorkouts: GeneratedWorkouts = {
      immediate: [],
      weekly: [],
      upcoming: []
    };
    
    let userProfile: WorkoutFile['userProfile'] | null = null;
    let processedFiles = 0;
    
    // If sessionId is provided, filter for that session
    const filesToProcess = sessionId 
      ? workoutFiles.slice(0, limit)  // Still limit for performance
      : workoutFiles.slice(0, limit);
    
    for (const filename of filesToProcess) {
      try {
        const filePath = path.join(workoutsDir, filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const workoutData: WorkoutFile = JSON.parse(fileContent);
        
        // Skip if sessionId filter is provided and doesn't match
        if (sessionId && workoutData.sessionId !== sessionId) {
          continue;
        }
        
        // Store user profile from the most recent file
        if (!userProfile) {
          userProfile = workoutData.userProfile;
        }
        
        // Add workouts to combined results
        allWorkouts.immediate.push(...workoutData.workoutPlans.immediate);
        allWorkouts.weekly.push(...workoutData.workoutPlans.weekly);
        allWorkouts.upcoming.push(...workoutData.workoutPlans.upcoming);
        
        processedFiles++;
        console.log(`✅ Processed workout file: ${filename}`);
        
      } catch (fileError) {
        console.error(`❌ Error processing file ${filename}:`, fileError);
        continue;
      }
    }
    
    // Remove duplicates based on workout ID
    const deduplicateWorkouts = (workouts: WorkoutPlan[]) => {
      const seen = new Set();
      return workouts.filter(workout => {
        if (seen.has(workout.id)) {
          return false;
        }
        seen.add(workout.id);
        return true;
      });
    };
    
    allWorkouts.immediate = deduplicateWorkouts(allWorkouts.immediate);
    allWorkouts.weekly = deduplicateWorkouts(allWorkouts.weekly);
    allWorkouts.upcoming = deduplicateWorkouts(allWorkouts.upcoming);
    
    // Sort workouts by relevance (immediate first, then by date if available)
    const sortWorkouts = (workouts: WorkoutPlan[]) => {
      return workouts.sort((a, b) => {
        // If one is marked as "Today" or "Next", prioritize it
        if (a.date.toLowerCase().includes('today') || a.date.toLowerCase().includes('next')) return -1;
        if (b.date.toLowerCase().includes('today') || b.date.toLowerCase().includes('next')) return 1;
        return 0;
      });
    };
    
    allWorkouts.immediate = sortWorkouts(allWorkouts.immediate);
    allWorkouts.weekly = sortWorkouts(allWorkouts.weekly);
    allWorkouts.upcoming = sortWorkouts(allWorkouts.upcoming);
    
    // Calculate totals
    const totalWorkouts = allWorkouts.immediate.length + allWorkouts.weekly.length + allWorkouts.upcoming.length;
    
    console.log('📊 Workout summary:', {
      immediate: allWorkouts.immediate.length,
      weekly: allWorkouts.weekly.length,
      upcoming: allWorkouts.upcoming.length,
      total: totalWorkouts,
      filesProcessed: processedFiles
    });
    
    // Return comprehensive response
    const response = {
      success: true,
      message: `Found ${totalWorkouts} workouts from ${processedFiles} files`,
      workouts: allWorkouts,
      userProfile: userProfile || {
        preferences: [],
        constraints: [],
        goals: [],
        timeAvailability: "Not specified",
        fitnessLevel: "intermediate" as const
      },
      metadata: {
        totalWorkouts,
        totalFiles: workoutFiles.length,
        processedFiles,
        sessionFilter: sessionId || null,
        breakdown: {
          immediate: allWorkouts.immediate.length,
          weekly: allWorkouts.weekly.length,
          upcoming: allWorkouts.upcoming.length
        }
      },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Error loading workouts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error loading workouts',
        error: error.message,
        workouts: {
          immediate: [],
          weekly: [],
          upcoming: []
        },
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// DELETE method to clean up old workout files
export async function DELETE(req: NextRequest) {
  console.log('🗑️ API route called - DELETE /api/get-workouts');
  
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const olderThanDays = parseInt(searchParams.get('olderThan') || '30'); // Default 30 days
    
    const workoutsDir = path.join(process.cwd(), 'data', 'workouts');
    
    // Check if directory exists
    try {
      await fs.access(workoutsDir);
    } catch {
      return NextResponse.json({
        success: true,
        message: 'No workouts directory found',
        deletedFiles: 0
      });
    }
    
    const files = await fs.readdir(workoutsDir);
    const workoutFiles = files.filter(file => file.startsWith('generated-workouts-') && file.endsWith('.json'));
    
    let deletedFiles = 0;
    const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    
    for (const filename of workoutFiles) {
      try {
        const timestamp = parseInt(filename.match(/generated-workouts-(\d+)\.json/)?.[1] || '0');
        
        // If sessionId is provided, only delete files from that session
        if (sessionId) {
          const filePath = path.join(workoutsDir, filename);
          const fileContent = await fs.readFile(filePath, 'utf8');
          const workoutData: WorkoutFile = JSON.parse(fileContent);
          
          if (workoutData.sessionId === sessionId) {
            await fs.unlink(filePath);
            deletedFiles++;
            console.log(`🗑️ Deleted workout file for session ${sessionId}: ${filename}`);
          }
        } else if (timestamp < cutoffTime) {
          // Delete files older than cutoff
          const filePath = path.join(workoutsDir, filename);
          await fs.unlink(filePath);
          deletedFiles++;
          console.log(`🗑️ Deleted old workout file: ${filename}`);
        }
      } catch (fileError) {
        console.error(`❌ Error deleting file ${filename}:`, fileError);
        continue;
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedFiles} workout files`,
      deletedFiles,
      criteria: sessionId ? `Session ID: ${sessionId}` : `Older than ${olderThanDays} days`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error deleting workout files:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting workout files',
        error: error.message,
        deletedFiles: 0
      },
      { status: 500 }
    );
  }
}