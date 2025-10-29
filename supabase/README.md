# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Click "New Project"
3. Fill in:
   - **Project Name**: curious-forge
   - **Database Password**: (create a strong password and save it)
   - **Region**: Choose closest to your location (e.g., Singapore, Tokyo)
4. Click "Create new project"

## 2. Run Database Migration

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- Tables: `profiles`, `blueprints`, `submissions`, `saved_blueprints`
- Row Level Security (RLS) policies
- Triggers for auto-updating timestamps
- Function to create profile on user signup

## 3. Get API Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

## 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace with your actual Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_KEY=your-anon-public-key-here
   NUXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

## 5. Enable Authentication Providers (Optional)

### Email/Password (Already enabled by default)
No additional setup needed.

### Google OAuth
1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Follow instructions to create OAuth credentials in Google Cloud Console
4. Add credentials to Supabase

### GitHub OAuth
1. Go to **Authentication** → **Providers** → **GitHub**
2. Enable GitHub provider
3. Create OAuth App in GitHub Settings
4. Add credentials to Supabase

## 6. Migrate Existing Blueprints Data

To migrate your existing blueprints from `public/assets/data/blueprints.json` to Supabase:

1. Go to **SQL Editor** in Supabase
2. Run this query to insert sample data:

```sql
INSERT INTO blueprints (
  title, description, category, difficulty, duration,
  materials, tools, steps, science_explanation, safety_notes,
  image_url, video_url, status
) VALUES (
  'DIY Volcano',
  'Create your own erupting volcano using common household materials',
  'chemistry',
  'beginner',
  '30-45 minutes',
  '["Baking soda", "Vinegar", "Food coloring", "Dish soap", "Clay or paper mache"]'::jsonb,
  '["Bottle or container", "Tray to catch spills"]'::jsonb,
  '[{"number": 1, "title": "Build the volcano", "description": "Shape clay around a bottle"}]'::jsonb,
  'The reaction between baking soda (base) and vinegar (acid) produces carbon dioxide gas',
  '["Adult supervision required", "Wear safety goggles"]'::jsonb,
  '/assets/images/volcano.jpg',
  null,
  'published'
);
```

Or use the Table Editor in Supabase to manually add blueprints.

## 7. Test Authentication

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/login`
3. Try creating an account
4. Check Supabase **Authentication** → **Users** to see if user was created
5. Check **Table Editor** → **profiles** to see if profile was auto-created

## 8. Security Checklist

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Environment variables in `.env` (not committed to git)
- ✅ Email confirmation enabled (optional, in Authentication settings)
- ✅ Rate limiting enabled (optional, in Authentication settings)

## Troubleshooting

### "Invalid API key" error
- Make sure you copied the **anon public** key, not the service role key
- Check that there are no extra spaces in your `.env` file

### Users can't sign up
- Check Authentication → Settings → Email Auth is enabled
- Check Email Templates are configured
- For production, configure SMTP settings

### Can't see data in tables
- Make sure RLS policies are correct
- Try viewing data in Supabase Table Editor first
- Check browser console for errors

## Next Steps

After setup:
1. Migrate existing blueprints data
2. Test authentication flow
3. Test creating/saving blueprints
4. Deploy to Vercel/Cloudflare Pages
