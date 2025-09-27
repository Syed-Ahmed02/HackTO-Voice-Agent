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

interface PersonalizedPlan {
  summary: string;
  userProfile: {
    preferences: string[];
    constraints: string[];
    goals: string[];
    timeAvailability: string;
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

    // More specific prompt with clearer instructions
    const systemPrompt = `You are an expert life coach and plan generator. Your task is to analyze conversation transcripts and generate personalized action plans.

IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any explanatory text, markdown formatting, or code blocks. Just the raw JSON.`;

    const userPrompt = `Analyze this conversation and generate a personalized plan:

CONVERSATION:
${conversation}

Generate a JSON object with this EXACT structure:
{
  "summary": "Brief 2-3 sentence summary of conversation and key insights",
  "userProfile": {
    "preferences": ["Array of user preferences mentioned"],
    "constraints": ["Array of limitations or constraints"],
    "goals": ["Array of user goals"],
    "timeAvailability": "Description of time availability"
  },
  "recommendations": {
    "shortTerm": ["3-5 recommendations for next 1-2 weeks"],
    "longTerm": ["3-5 recommendations for next 3-6 months"],
    "actionItems": ["Specific measurable tasks"]
  },
  "nextSteps": ["3-5 prioritized concrete next steps"]
}

If you cannot extract specific information from the conversation, use reasonable defaults based on what was discussed.

RESPOND WITH ONLY THE JSON OBJECT.`;

    console.log('🤖 Generating personalized plan with Cerebras...');
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
      max_tokens: 2000,
      response_format: { type: "json_object" } // Request JSON format if supported
    });

    const responseContent = (completion as any).choices?.[0]?.message?.content;
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
        // Strategy 3: Generate a meaningful fallback based on actual conversation
        console.warn('⚠️ Could not extract JSON, generating fallback plan...');
        
        // Try to at least extract some information from the conversation
        const userMessages = transcriptData.messages
          .filter(msg => msg.role === 'user')
          .map(msg => msg.text)
          .join(' ');
        
        personalizedPlan = {
          summary: `Conversation analyzed with ${transcriptData.messages.length} messages. The user engaged with the coach about their needs and preferences.`,
          userProfile: {
            preferences: userMessages.includes('like') || userMessages.includes('prefer') 
              ? ["Based on conversation - specific preferences to be refined"]
              : ["Preferences to be identified through follow-up"],
            constraints: userMessages.includes('time') || userMessages.includes('busy')
              ? ["Time constraints mentioned - requires clarification"]
              : ["Constraints to be assessed"],
            goals: ["Goal setting in progress", "Further discussion needed for clarity"],
            timeAvailability: userMessages.includes('morning') ? "Mornings preferred" : 
                            userMessages.includes('evening') ? "Evenings preferred" : 
                            "Time availability to be determined"
          },
          recommendations: {
            shortTerm: [
              "Schedule a follow-up session to clarify goals",
              "Document current priorities and challenges",
              "Begin with one small, achievable action this week"
            ],
            longTerm: [
              "Develop a structured 3-month plan",
              "Establish regular check-in schedule",
              "Build sustainable habits aligned with goals"
            ],
            actionItems: [
              "Write down top 3 priorities for this week",
              "Identify one habit to start immediately",
              "Set up a simple tracking system"
            ]
          },
          nextSteps: [
            "Review this initial plan and identify what resonates",
            "Choose one action item to start today",
            "Schedule next coaching session",
            "Begin daily reflection practice (5 minutes)"
          ]
        };
        
        console.log('📝 Generated fallback plan based on conversation context');
      }
    }
    
    // Validate the plan structure
    if (!personalizedPlan.summary || !personalizedPlan.userProfile || !personalizedPlan.recommendations) {
      console.error('❌ Invalid plan structure, using safe defaults');
      throw new Error('Invalid plan structure from LLM');
    }

    return personalizedPlan;

  } catch (error) {
    console.error('❌ Error generating personalized plan:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined
    });
    
    // Return a more informative error plan
    throw new Error(`Plan generation failed: ${error instanceof Error ? error.message : String(error)}`);
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
    
    // Define the directory where you want to save the files
    const saveDir = path.join(process.cwd(), 'data', 'transcripts');
    const plansDir = path.join(process.cwd(), 'data', 'plans');
    console.log('📁 Save directories:', { saveDir, plansDir });
    
    // Ensure both directories exist
    await fs.mkdir(saveDir, { recursive: true });
    await fs.mkdir(plansDir, { recursive: true });
    console.log('✅ Directories created/verified');
    
    // Create filenames with timestamp
    const timestamp = Date.now();
    const transcriptFilename = `vapi-transcript-${timestamp}.json`;
    const planFilename = `personalized-plan-${timestamp}.json`;
    
    const transcriptPath = path.join(saveDir, transcriptFilename);
    const planPath = path.join(plansDir, planFilename);
    
    console.log('💾 File paths:', { transcriptPath, planPath });
    
    // Save the original transcript
    await fs.writeFile(transcriptPath, JSON.stringify(transcriptData, null, 2));
    console.log('✅ Transcript saved successfully');
    
    // Generate personalized plan using Cerebras LLM
    let personalizedPlan: PersonalizedPlan | null = null;
    let planGenerationError: string | null = null;
    
    try {
      console.log('🤖 Starting personalized plan generation...');
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
          generationMethod: 'cerebras-llm'
        }
      };
      
      await fs.writeFile(planPath, JSON.stringify(planData, null, 2));
      console.log('✅ Personalized plan saved successfully');
      console.log('📋 Plan summary:', personalizedPlan.summary.substring(0, 100) + '...');
      
    } catch (planError) {
      console.error('❌ Error generating personalized plan:', planError);
      planGenerationError = planError instanceof Error ? planError.message : String(planError);
      
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
      message: personalizedPlan ? 'Transcript and plan saved successfully' : 'Transcript saved (plan generation failed)',
      files: {
        transcript: {
          filename: transcriptFilename,
          path: transcriptPath
        },
        ...(personalizedPlan && {
          plan: {
            filename: planFilename,
            path: planPath
          }
        })
      },
      ...(personalizedPlan && { personalizedPlan }),
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
        error: error instanceof Error ? error.message : String(error),
        details: error instanceof Error ? error.stack?.substring(0, 500) : undefined,
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
    message: 'Enhanced save transcript API with Cerebras LLM integration',
    status: 'working',
    features: [
      'Transcript saving',
      'Cerebras LLM integration',
      'Personalized plan generation',
      'Dual file output (transcript + plan)',
      'Improved JSON parsing with fallback strategies'
    ],
    configuration: {
      cerebrasApiKey: cerebrasConfigured ? 'configured' : 'missing',
      apiKeyLength: process.env.CEREBRAS_API_KEY?.length || 0
    },
    troubleshooting: {
      hint: 'Check console logs for detailed error messages',
      commonIssues: [
        'Ensure CEREBRAS_API_KEY is set in .env.local',
        'Verify API key is valid and has credits',
        'Check that conversation has meaningful content'
      ]
    },
    method: 'Use POST to save transcripts and generate plans',
    timestamp: new Date().toISOString()
  });
}