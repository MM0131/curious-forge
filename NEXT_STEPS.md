# 🚀 Quick Setup Guide - Next Steps

Your .env file is configured! Here's what to do next:

## ✅ Step 1: Configure Auth URLs in Supabase

Go to: **Supabase Dashboard → Authentication → URL Configuration**

Set these values:
- **Site URL**: `http://localhost:3001` (or 3000 if that's your port)
- **Redirect URLs**: Add `http://localhost:3001/auth/callback`

## ✅ Step 2: Run Database Schema

Go to: **Supabase Dashboard → SQL Editor → New Query**

1. Open `supabase/schema.sql` in your project
2. Copy the entire file content
3. Paste into SQL Editor
4. Click **Run**

Expected result: Tables created (profiles, blueprints, submissions, saved_blueprints) with RLS enabled

## ✅ Step 3: Add Sample Data

**Option A - Quick Sample (Recommended for testing)**
- SQL Editor → New Query
- Copy/paste `supabase/sample-data.sql`
- Run

**Option B - Import Full JSON Data**
```bash
# Add this to .env temporarily (don't commit):
# SUPABASE_SERVICE_KEY=your-service-role-key

npm run import:blueprints

# Remove SERVICE_KEY from .env after import
```

## ✅ Step 4: Test the App

**Test Authentication:**
- Open: http://localhost:3001/login
- Try signing up with email/password
- Check Supabase Dashboard → Authentication → Users

**Test Blueprint Loading:**
- Open: http://localhost:3001/library
- Should load blueprints from Supabase (if Step 3 done)
- Open: http://localhost:3001/blueprints/volcano
- Should show blueprint detail from database

## 🎯 Current Status

- ✅ Supabase credentials configured
- ✅ Dev server running (port 3001)
- ⏳ Waiting for: Schema creation + data import
- ⏳ Next: Test auth + blueprint loading
- ⏳ After that: Saved/bookmark feature

---

**Need help?** 
- If you get stuck, check `supabase/README.md` for detailed troubleshooting
- See `SETUP_COMPLETE.md` for the full setup overview
