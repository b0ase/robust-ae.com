import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define the path to the JSON file
// Adjust the path based on your project structure if needed
const contentFilePath = path.join(process.cwd(), 'data', 'content.json');

// GET handler to read the content
export async function GET() {
  try {
    const fileContent = await fs.readFile(contentFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading content file:', error);
    // If file doesn't exist, maybe return default content or an error
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return NextResponse.json({ error: 'Content file not found.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to read content file.' }, { status: 500 });
  }
}

// POST handler to update the content
export async function POST(request: Request) {
  try {
    const updatedContent = await request.json();

    // Basic validation (optional, could add more specific checks)
    if (!updatedContent || typeof updatedContent !== 'object') {
      return NextResponse.json({ error: 'Invalid content data received.' }, { status: 400 });
    }

    // Read current content to potentially merge or validate (optional)
    // const currentFileContent = await fs.readFile(contentFilePath, 'utf-8');
    // const currentData = JSON.parse(currentFileContent);

    // Write the updated content back to the file
    await fs.writeFile(contentFilePath, JSON.stringify(updatedContent, null, 2), 'utf-8');

    console.log('Content file updated successfully.');
    return NextResponse.json({ message: 'Content updated successfully.' });

  } catch (error) {
    console.error('Error writing content file:', error);
    return NextResponse.json({ error: 'Failed to update content file.' }, { status: 500 });
  }
} 