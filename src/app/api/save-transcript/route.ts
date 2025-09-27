// File: app/api/save-transcript/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

interface TranscriptMessage {
  role: string;
  text: string;
  timestamp: number;
}

interface TranscriptData {
  sessionId: string;
  timestamp: string;
  messages: TranscriptMessage[];
  triggerDetected: boolean;
  triggerMessage: string;
  detectedIn: string;
}

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

interface PersonalizedPlan {
  summary: string;
  userProfile: {
    preferences: string[];
    constraints: string[];
    goals: string[];
    timeAvailability: string;
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  };
  workoutPlans: {
    immediate: WorkoutPlan[];  // Next 1-2 workouts
    weekly: WorkoutPlan[];     // This week's remaining workouts
    upcoming: WorkoutPlan[];   // Next week's workouts
  };
  recommendations: {
    shortTerm: string[];
    longTerm: string[];
    actionItems: string[];
  };
  nextSteps: string[];
}

// Initialize Cerebras client
const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

// Helper function to extract JSON from a text response
function extractJSON(text: string): any {
  // Try to find JSON in the text
  const jsonMatches = text.match(/\{[\s\S]*\}/);
  if (jsonMatches) {
    try {
      return JSON.parse(jsonMatches[0]);
    } catch (e) {
      console.error('Found JSON-like content but failed to parse:', e);
    }
  }
  
  // Try to clean and parse the entire text
  const cleanedText = text.trim();
  if (cleanedText.startsWith('{') && cleanedText.endsWith('}')) {
    try {
      return JSON.parse(cleanedText);
    } catch (e) {
      console.error('Failed to parse cleaned text:', e);
    }
  }
  
  return null;
}

async function generatePersonalizedPlan(transcriptData: TranscriptData): Promise<PersonalizedPlan> {
  try {
    // Extract conversation content for analysis
    const conversation = transcriptData.messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.text}`)
      .join('\n');

    // Enhanced prompt for structured workout generation
    const systemPrompt = `You are an expert fitness coach and workout plan generator. Your task is to analyze conversation transcripts and generate personalized workout plans with specific, actionable exercises.

IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any explanatory text, markdown formatting, or code blocks. Just the raw JSON.

EXERCISE GUIDELINES:
- Each exercise must have specific rep counts, set counts, and weight recommendations
- Use realistic weights (e.g., "135 lbs", "25 lbs", "bodyweight", "15 lb dumbbells")
- Include clear muscle groups for each exercise
- Provide brief, actionable instructions
- Consider progression from beginner to advanced levels
- Include variety in exercise types (compound, isolation, bodyweight)`;

    const userPrompt = `Analyze this fitness coaching conversation and generate a comprehensive workout plan:

CONVERSATION:
${conversation}

Generate a JSON object with this EXACT structure:
{
  "summary": "Brief 2-3 sentence summary of the user's fitness discussion and key insights",
  "userProfile": {
    "preferences": ["Array of workout preferences mentioned (e.g., 'prefers morning workouts', 'likes strength training')"],
    "constraints": ["Array of limitations (e.g., 'limited to 45 minutes', 'no gym access', 'knee injury')"],
    "goals": ["Array of fitness goals (e.g., 'build muscle', 'lose weight', 'improve endurance')"],
    "timeAvailability": "Description of available workout time",
    "fitnessLevel": "beginner|intermediate|advanced"
  },
  "workoutPlans": {
    "immediate": [
      {
        "id": "workout_001",
        "name": "Next Workout - [Specific Name]",
        "date": "Today",
        "duration": "45-60 minutes",
        "type": "strength|cardio|flexibility|mixed",
        "exercises": [
          {
            "id": 1,
            "name": "Exercise Name",
            "targetReps": 10,
            "targetSets": 3,
            "targetWeight": "135 lbs",
            "instructions": "Brief form cue or instruction",
            "muscleGroups": ["chest", "triceps"],
            "difficulty": "intermediate"
          }
        ],
        "benefits": "What this workout will accomplish",
        "restBetweenSets": "60-90 seconds",
        "warmUpInstructions": "5-10 minute warm-up routine",
        "coolDownInstructions": "5-10 minute cool-down routine"
      }
    ],
    "weekly": [
      // 2-3 additional workouts for this week with similar structure
    ],
    "upcoming": [
      // 2-3 workouts for next week with progression
    ]
  },
  "recommendations": {
    "shortTerm": ["3-5 recommendations for next 1-2 weeks"],
    "longTerm": ["3-5 recommendations for next 3-6 months"],
    "actionItems": ["Specific measurable tasks"]
  },
  "nextSteps": ["3-5 prioritized concrete next steps"]
}

EXERCISE EXAMPLES FOR REFERENCE:
- Strength: Bench Press (8-12 reps, 3 sets, 135-185 lbs), Squats (10-15 reps, 3 sets, bodyweight to 225 lbs)
- Cardio: Treadmill Run (20-30 minutes, moderate pace), Burpees (10-15 reps, 3 rounds)
- Bodyweight: Push-ups (8-20 reps depending on fitness level), Pull-ups (5-12 reps)

MUSCLE GROUP OPTIONS: chest, back, shoulders, biceps, triceps, legs, glutes, core, full-body

DIFFICULTY SCALING:
- Beginner: Lower weights, higher reps, bodyweight focus
- Intermediate: Moderate weights, balanced rep ranges
- Advanced: Higher weights, complex movements, advanced techniques

Create realistic, progressive workouts that match the user's discussed goals and constraints. Each exercise should be specific enough to follow without additional research.

RESPOND WITH ONLY THE JSON OBJECT.`;

    console.log('🤖 Generating personalized workout plan with Cerebras...');
    console.log('📝 Conversation length:', conversation.length, 'characters');
    
    const completion = await cerebras.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      model: 'llama-4-scout-17b-16e-instruct',
      temperature: 0.3, // Lower temperature for more consistent JSON output
      max_tokens: 3000,  // Increased for detailed workout plans
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;
    console.log('📄 Raw Cerebras response:', responseContent?.substring(0, 200) + '...');
    
    if (!responseContent) {
      throw new Error('No response from Cerebras API');
    }

    console.log('✅ Received response from Cerebras, length:', responseContent.length);
    
    // Try multiple parsing strategies
    let personalizedPlan: PersonalizedPlan;
    
    // Strategy 1: Direct JSON parse
    try {
      personalizedPlan = JSON.parse(responseContent);
      console.log('✅ Successfully parsed response as JSON (direct)');
    } catch (parseError) {
      console.warn('⚠️ Direct JSON parsing failed, trying extraction...');
      
      // Strategy 2: Extract JSON from text
      const extractedJSON = extractJSON(responseContent);
      if (extractedJSON) {
        personalizedPlan = extractedJSON;
        console.log('✅ Successfully extracted and parsed JSON from response');
      } else {
        // Strategy 3: Generate a meaningful fallback workout plan
        console.warn('⚠️ Could not extract JSON, generating fallback workout plan...');
        
        const userMessages = transcriptData.messages
          .filter(msg => msg.role === 'user')
          .map(msg => msg.text)
          .join(' ');
        
        // Create a basic but functional workout plan
        personalizedPlan = {
          summary: `Fitness coaching session analyzed with ${transcriptData.messages.length} messages. Generated a foundational workout plan for immediate use.`,
          userProfile: {
            preferences: ["Structured workout routine", "Clear exercise guidance"],
            constraints: ["Time to be determined", "Equipment access to be confirmed"],
            goals: ["Establish consistent fitness routine", "Progressive strength building"],
            timeAvailability: "Flexible scheduling needed",
            fitnessLevel: "intermediate"
          },
          workoutPlans: {
            immediate: [
              {
                id: "fallback_workout_001",
                name: "Full Body Foundation Workout",
                date: "Today",
                duration: "45-60 minutes",
                type: "strength",
                exercises: [
                  {
                    id: 1,
                    name: "Bodyweight Squats",
                    targetReps: 15,
                    targetSets: 3,
                    targetWeight: "bodyweight",
                    instructions: "Keep chest up, knees track over toes",
                    muscleGroups: ["legs", "glutes"],
                    difficulty: "beginner"
                  },
                  {
                    id: 2,
                    name: "Push-ups",
                    targetReps: 10,
                    targetSets: 3,
                    targetWeight: "bodyweight",
                    instructions: "Full range of motion, keep body straight",
                    muscleGroups: ["chest", "triceps"],
                    difficulty: "intermediate"
                  },
                  {
                    id: 3,
                    name: "Plank Hold",
                    targetReps: 30,
                    targetSets: 3,
                    targetWeight: "bodyweight",
                    instructions: "Hold for 30 seconds, maintain straight line",
                    muscleGroups: ["core"],
                    difficulty: "beginner"
                  }
                ],
                benefits: "Build foundational strength across major muscle groups",
                restBetweenSets: "60 seconds",
                warmUpInstructions: "5 minutes light cardio and dynamic stretching",
                coolDownInstructions: "5-10 minutes static stretching"
              }
            ],
            weekly: [],
            upcoming: []
          },
          recommendations: {
            shortTerm: [
              "Complete the foundation workout 2-3 times this week",
              "Track your performance and progress",
              "Focus on proper form over speed or weight"
            ],
            longTerm: [
              "Gradually increase exercise difficulty",
              "Add resistance training with weights",
              "Develop a consistent 3-4 day per week routine"
            ],
            actionItems: [
              "Schedule specific workout times in your calendar",
              "Set up a dedicated workout space",
              "Track your reps and sets for each exercise"
            ]
          },
          nextSteps: [
            "Start with today's foundation workout",
            "Complete form check for each exercise",
            "Schedule next workout session",
            "Note any exercises that feel too easy or difficult"
          ]
        };
        
        console.log('📝 Generated fallback workout plan with structured exercises');
      }
    }
    
    // Validate the plan structure
    if (!personalizedPlan.summary || !personalizedPlan.userProfile || !personalizedPlan.workoutPlans) {
      console.error('❌ Invalid plan structure, using safe defaults');
      throw new Error('Invalid plan structure from LLM');
    }

    return personalizedPlan;

  } catch (error) {
    console.error('❌ Error generating personalized plan:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 500)
    });
    
    // Return a more informative error plan
    throw new Error(`Plan generation failed: ${error.message}`);
  }
}

export async function POST(req: NextRequest) {
  console.log('🚀 API route called - POST /api/save-transcript');
  
  try {
    const transcriptData: TranscriptData = await req.json();
    console.log('📝 Received transcript data:', {
      sessionId: transcriptData.sessionId,
      messageCount: transcriptData.messages?.length || 0,
      triggerDetected: transcriptData.triggerDetected
    });
    
    // Validate that we have actual messages
    if (!transcriptData.messages || transcriptData.messages.length === 0) {
      throw new Error('No messages in transcript');
    }
    
    // Define the directories
    const saveDir = path.join(process.cwd(), 'data', 'transcripts');
    const plansDir = path.join(process.cwd(), 'data', 'plans');
    const workoutsDir = path.join(process.cwd(), 'data', 'workouts');
    console.log('📁 Save directories:', { saveDir, plansDir, workoutsDir });
    
    // Ensure all directories exist
    await fs.mkdir(saveDir, { recursive: true });
    await fs.mkdir(plansDir, { recursive: true });
    await fs.mkdir(workoutsDir, { recursive: true });
    console.log('✅ Directories created/verified');
    
    // Create filenames with timestamp
    const timestamp = Date.now();
    const transcriptFilename = `vapi-transcript-${timestamp}.json`;
    const planFilename = `personalized-plan-${timestamp}.json`;
    const workoutFilename = `generated-workouts-${timestamp}.json`;
    
    const transcriptPath = path.join(saveDir, transcriptFilename);
    const planPath = path.join(plansDir, planFilename);
    const workoutPath = path.join(workoutsDir, workoutFilename);
    
    console.log('💾 File paths:', { transcriptPath, planPath, workoutPath });
    
    // Save the original transcript
    await fs.writeFile(transcriptPath, JSON.stringify(transcriptData, null, 2));
    console.log('✅ Transcript saved successfully');
    
    // Generate personalized plan using Cerebras LLM
    let personalizedPlan: PersonalizedPlan | null = null;
    let planGenerationError: string | null = null;
    
    try {
      console.log('🤖 Starting personalized workout plan generation...');
      console.log('📊 Messages to analyze:', transcriptData.messages.length);
      
      // Check if CEREBRAS_API_KEY is configured
      if (!process.env.CEREBRAS_API_KEY) {
        throw new Error('CEREBRAS_API_KEY not configured');
      }
      
      personalizedPlan = await generatePersonalizedPlan(transcriptData);
      
      // Save the personalized plan
      const planData = {
        sessionId: transcriptData.sessionId,
        originalTranscript: transcriptFilename,
        generatedAt: new Date().toISOString(),
        plan: personalizedPlan,
        metadata: {
          messageCount: transcriptData.messages.length,
          triggerDetected: transcriptData.triggerDetected,
          generationMethod: 'cerebras-llm',
          workoutPlansGenerated: personalizedPlan.workoutPlans.immediate.length + 
                                personalizedPlan.workoutPlans.weekly.length + 
                                personalizedPlan.workoutPlans.upcoming.length
        }
      };
      
      await fs.writeFile(planPath, JSON.stringify(planData, null, 2));
      
      // Save workout plans separately for easy fitness page integration
      const workoutData = {
        sessionId: transcriptData.sessionId,
        generatedAt: new Date().toISOString(),
        userProfile: personalizedPlan.userProfile,
        workoutPlans: personalizedPlan.workoutPlans,
        metadata: {
          totalWorkouts: personalizedPlan.workoutPlans.immediate.length + 
                        personalizedPlan.workoutPlans.weekly.length + 
                        personalizedPlan.workoutPlans.upcoming.length,
          fitnessLevel: personalizedPlan.userProfile.fitnessLevel
        }
      };
      
      await fs.writeFile(workoutPath, JSON.stringify(workoutData, null, 2));
      
      console.log('✅ Personalized plan and workouts saved successfully');
      console.log('📋 Plan summary:', personalizedPlan.summary.substring(0, 100) + '...');
      console.log('🏋️ Workouts generated:', workoutData.metadata.totalWorkouts);
      
    } catch (planError) {
      console.error('❌ Error generating personalized plan:', planError);
      planGenerationError = planError.message;
      
      // Still save a basic plan file with error information
      const errorPlanData = {
        sessionId: transcriptData.sessionId,
        originalTranscript: transcriptFilename,
        generatedAt: new Date().toISOString(),
        error: planGenerationError,
        plan: null
      };
      
      await fs.writeFile(planPath, JSON.stringify(errorPlanData, null, 2));
    }
    
    // Return comprehensive response
    const response = {
      success: true,
      message: personalizedPlan ? 'Transcript and workout plans saved successfully' : 'Transcript saved (plan generation failed)',
      files: {
        transcript: {
          filename: transcriptFilename,
          path: transcriptPath
        },
        ...(personalizedPlan && {
          plan: {
            filename: planFilename,
            path: planPath
          },
          workouts: {
            filename: workoutFilename,
            path: workoutPath
          }
        })
      },
      ...(personalizedPlan && { 
        personalizedPlan,
        workoutSummary: {
          totalPlans: personalizedPlan.workoutPlans.immediate.length + 
                     personalizedPlan.workoutPlans.weekly.length + 
                     personalizedPlan.workoutPlans.upcoming.length,
          immediateWorkouts: personalizedPlan.workoutPlans.immediate.length,
          weeklyWorkouts: personalizedPlan.workoutPlans.weekly.length,
          upcomingWorkouts: personalizedPlan.workoutPlans.upcoming.length,
          userFitnessLevel: personalizedPlan.userProfile.fitnessLevel
        }
      }),
      ...(planGenerationError && { planGenerationError }),
      timestamp: new Date().toISOString(),
      processingDetails: {
        messageCount: transcriptData.messages.length,
        triggerDetected: transcriptData.triggerDetected,
        planGenerated: !!personalizedPlan
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Error processing transcript:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error processing transcript', 
        error: error.message,
        details: error.stack?.substring(0, 500),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Enhanced GET method for testing
export async function GET() {
  console.log('🔍 API route test - GET /api/save-transcript');
  
  // Check if Cerebras API key is configured
  const cerebrasConfigured = !!process.env.CEREBRAS_API_KEY;
  
  return NextResponse.json({ 
    message: 'Enhanced save transcript API with Cerebras Workout Plan Generation',
    status: 'working',
    features: [
      'Transcript saving',
      'Cerebras LLM integration',
      'Structured workout plan generation',
      'Exercise-specific details (reps, sets, weight)',
      'Fitness level adaptation',
      'Multiple workout timeframes (immediate, weekly, upcoming)',
      'Fitness page integration ready'
    ],
    configuration: {
      cerebrasApiKey: cerebrasConfigured ? 'configured' : 'missing',
      apiKeyLength: process.env.CEREBRAS_API_KEY?.length || 0
    },
    workoutPlanFeatures: [
      'Specific exercise instructions',
      'Rep and set recommendations',
      'Weight suggestions based on fitness level',
      'Muscle group targeting',
      'Progressive difficulty scaling',
      'Warm-up and cool-down guidance'
    ],
    troubleshooting: {
      hint: 'Check console logs for detailed error messages',
      commonIssues: [
        'Ensure CEREBRAS_API_KEY is set in .env.local',
        'Verify API key is valid and has credits',
        'Check that conversation contains fitness-related content'
      ]
    },
    method: 'Use POST to save transcripts and generate workout plans',
    timestamp: new Date().toISOString()
  });
}