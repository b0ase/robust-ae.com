import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role for server-side
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET handler to read the content
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('robust_ae_content')
      .select('data')
      .eq('id', 1)
      .single();
    if (error) throw error;
    return NextResponse.json(data.data);
  } catch (error) {
    console.error('Error reading content from Supabase:', error);
    return NextResponse.json({ error: 'Failed to fetch content.' }, { status: 500 });
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
    const { error } = await supabaseAdmin
      .from('robust_ae_content')
      .upsert({ id: 1, data: updatedContent, updated_at: new Date() });
    if (error) throw error;

    console.log('Content file updated successfully.');
    return NextResponse.json({ message: 'Content updated successfully.' });

  } catch (error) {
    console.error('Error writing content to Supabase:', error);
    return NextResponse.json({ error: 'Failed to update content.' }, { status: 500 });
  }
} 