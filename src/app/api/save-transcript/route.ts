import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const transcriptData = req.body;
    
    // Define the directory where you want to save the files
    const saveDir = path.join(process.cwd(), 'data', 'transcripts');
    
    // Ensure the directory exists
    await fs.mkdir(saveDir, { recursive: true });
    
    // Create filename with timestamp
    const filename = `vapi-transcript-${Date.now()}.json`;
    const filePath = path.join(saveDir, filename);
    
    // Write the file
    await fs.writeFile(filePath, JSON.stringify(transcriptData, null, 2));
    
    res.status(200).json({ 
      message: 'Transcript saved successfully',
      filename,
      path: filePath 
    });
  } catch (error) {
    console.error('Error saving transcript:', error);
    res.status(500).json({ message: 'Error saving transcript' });
  }
}