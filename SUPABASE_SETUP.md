# Curious Forge - Supabase Integration Setup

## 📋 Summary

This project now includes full Supabase integration for:
- ✅ User authentication (email/password, OAuth)
- ✅ Database for blueprints, submissions, saved items
- ✅ Row-level security (RLS)
- ✅ User profiles

## 🚀 Quick Start

### 1. Install Dependencies (Already done)
```bash
npm install @supabase/supabase-js
```

### 2. Setup Supabase Project
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run SQL from `supabase/schema.sql` in SQL Editor
4. Get API credentials from Settings → API

### 3. Configure Environment
```bash
# Copy example file
cp .env.example .env

# Edit .env with your Supabase credentials
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-anon-key-here
```

### 4. Test
```bash
npm run dev
```
Visit `http://localhost:3000/login` to test authentication.

## 📁 New Files Created

### Composables
- `composables/useSupabase.ts` - Supabase client initialization
- `composables/useAuth.ts` - Authentication methods and state

### Middleware
- `middleware/auth.ts` - Protected route middleware

### Plugins
- `plugins/01.auth.client.ts` - Initialize auth state on app load

### Pages
- `pages/login.vue` - Login/signup page with email and OAuth

### Database
- `supabase/schema.sql` - Complete database schema with RLS
- `supabase/sample-data.sql` - Sample blueprint data
- `supabase/README.md` - Detailed setup instructions

### Types
- `types/database.ts` - TypeScript types for Supabase tables

### Translations
- Added `auth` section to `i18n/locales/en.json`
- Added `auth` section to `i18n/locales/th.json`

## 🔐 Authentication Usage

### In Components
```vue
<script setup>
const { user, isAuthenticated, signIn, signOut } = useAuth()
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Welcome {{ user.email }}</p>
    <button @click="signOut">Sign Out</button>
  </div>
</template>
```

### Protected Routes
```vue
<script setup>
definePageMeta({
  middleware: 'auth' // Require authentication
})
</script>
```

## 📊 Database Schema

### Tables
1. **profiles** - User profiles (auto-created on signup)
2. **blueprints** - Science projects/blueprints
3. **submissions** - User-submitted ideas (pending moderation)
4. **saved_blueprints** - User bookmarks

### Key Features
- Row Level Security (RLS) enabled
- Auto-create profile trigger
- Timestamps auto-updated
- Proper foreign key relationships

## 🔄 Next Steps

### Phase 2: Implement Core Features

1. **Update Blueprint Library** (`composables/useBlueprints.ts`)
   - Fetch from Supabase instead of static JSON
   - Add pagination
   - Add real-time search

2. **Implement Save/Bookmark Feature**
   - Update profile page
   - Add save/unsave buttons
   - Show saved count

3. **Update Submission System**
   - Connect form to Supabase
   - Add status tracking
   - Create admin moderation panel

4. **Optional: Add Cloudinary**
   - Image upload for blueprints
   - Image optimization
   - Transform API

## 🎯 Current Status

✅ **Completed:**
- Supabase client setup
- Authentication system
- Database schema
- Login/signup UI
- i18n translations for auth
- Middleware for protected routes

⏭️ **Next Priority:**
- Migrate blueprint data to Supabase
- Update library page to fetch from database
- Implement save/bookmark feature

## 📝 Notes

- TypeScript errors in composables are normal until dev server restarts
- `.env` file is gitignored for security
- Schema includes sample RLS policies (adjust as needed)
- OAuth requires additional setup in Supabase dashboard

## 🔒 Security

- Never commit `.env` file
- Use anon key (not service role key) in frontend
- RLS policies protect data access
- Email verification recommended for production

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Nuxt 3 Docs](https://nuxt.com)
- [Supabase Auth with Nuxt](https://supabase.com/docs/guides/getting-started/tutorials/with-nuxt-3)
