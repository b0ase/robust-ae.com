# Robust AE Website Setup

## Supabase Configuration for Image Uploads

To enable image uploads for testimonial photos, client logos, and project images, you need to set up a Supabase project:

1. **Create a Supabase Project**
   - Sign up at [supabase.com](https://supabase.com) if you haven't already
   - Create a new project
   - Note your project URL and anon/public key

2. **Configure Storage**
   - In your Supabase dashboard, go to Storage
   - Create a new bucket called `robust-ae-images`
   - Set the bucket's privacy to public (or configure appropriate policies)
   - Create the following folders in your bucket:
     - `client-face-pics` (for testimonial images)
     - `projects` (for project images)
     - `logos` (for client logos)

3. **Create Images Table**
   - Go to SQL Editor in your Supabase dashboard
   - Run the following SQL to create a table to track uploaded images:

```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL,
  url TEXT NOT NULL,
  section TEXT NOT NULL,
  original_name TEXT,
  content_type TEXT,
  size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. **Environment Variables**
   - Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. **Restart the Development Server**
   - After configuring everything, restart your Next.js development server

## Security Considerations

- The current implementation uses the anon/public key, which is suitable for basic setups
- For a production environment, consider implementing more robust authentication and Row Level Security (RLS) policies
- Set up appropriate CORS configurations in your Supabase project settings 