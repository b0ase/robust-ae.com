import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Get form data from request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const section = formData.get('section') as string; // section can be testimonials, projects, logos
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Determine the storage folder based on section
    let storagePath = '';
    switch (section) {
      case 'testimonials':
        storagePath = 'client-face-pics';
        break;
      case 'projects':
        storagePath = 'projects';
        break;
      case 'logos':
        storagePath = 'logos';
        break;
      default:
        storagePath = 'uploads';
    }
    
    // Generate unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const fullPath = `${storagePath}/${fileName}`;
    
    // Convert file to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('robust-ae-images')
      .upload(fullPath, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading to Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('robust-ae-images')
      .getPublicUrl(fullPath);
    
    // Log upload in the images table for tracking
    const { error: dbError } = await supabase
      .from('images')
      .insert({
        path: fullPath,
        url: publicUrl,
        section: section,
        original_name: file.name,
        content_type: file.type,
        size: file.size
      });
    
    if (dbError) {
      console.error('Error logging image to database:', dbError);
      // We'll still return success since the upload worked
    }
    
    return NextResponse.json({ 
      success: true, 
      path: fullPath,
      url: publicUrl
    });
    
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image'
    }, { status: 500 });
  }
} 