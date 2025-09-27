// File: app/api/save-transcript/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  console.log('🚀 API route called - POST /api/save-transcript');
  
  try {
    const transcriptData = await req.json();
    console.log('📝 Received transcript data:', {
      sessionId: transcriptData.sessionId,
      messageCount: transcriptData.messages?.length || 0,
      triggerDetected: transcriptData.triggerDetected
    });
    
    // Define the directory where you want to save the files
    const saveDir = path.join(process.cwd(), 'data', 'transcripts');
    console.log('📁 Save directory:', saveDir);
    
    // Ensure the directory exists
    await fs.mkdir(saveDir, { recursive: true });
    console.log('✅ Directory created/verified');
    
    // Create filename with timestamp
    const filename = `vapi-transcript-${Date.now()}.json`;
    const filePath = path.join(saveDir, filename);
    console.log('💾 File path:', filePath);
    
    // Write the file
    await fs.writeFile(filePath, JSON.stringify(transcriptData, null, 2));
    console.log('✅ File saved successfully');
    
    return NextResponse.json({ 
      success: true,
      message: 'Transcript saved successfully',
      filename,
      path: filePath,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error saving transcript:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error saving transcript', 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Optional: Add a GET method for testing
export async function GET() {
  console.log('🔍 API route test - GET /api/save-transcript');
  return NextResponse.json({ 
    message: 'Save transcript API is working',
    method: 'Use POST to save transcripts',
    timestamp: new Date().toISOString()
  });
}