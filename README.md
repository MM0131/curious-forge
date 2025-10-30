# Curious Forge

Short guide to finish deployment, DB setup, and local development.

## Goals
- Deploy to Vercel with Supabase backend
- Save/bookmark and submit flows backed by Supabase
- Admin moderation UI for submissions

## Quickstart (local)

1. Copy `.env.example` to `.env` and fill values (see `.env` in repo)

2. Install and run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Required environment variables

- SUPABASE_URL — your Supabase project URL
- SUPABASE_KEY — anon/public key
- NUXT_PUBLIC_SITE_URL — production site URL (e.g. https://your-site.vercel.app)
- SUPABASE_SERVICE_KEY (optional, sensitive) — service_role key; required to run the import script and server admin endpoints

When deploying to Vercel, add the keys via the Environment Variables UI and mark `SUPABASE_SERVICE_KEY` as Sensitive.

## Database setup (Supabase)

1. Open Supabase Dashboard → SQL Editor
2. Paste and run the contents of `supabase/schema.sql` to create tables, triggers, and RLS policies
3. (Optional) For quick sample data, run `supabase/sample-data.sql`

To perform a full import from `assets/data/blueprints.json` use the import script (requires `SUPABASE_SERVICE_KEY`):

```bash
# set SUPABASE_SERVICE_KEY in your environment (local .env or CI)
npm run import:blueprints
```

## CI / Automation

This repo includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that will:

- install dependencies
- run typecheck (`vue-tsc`) and build (`npm run build`)
- if `SUPABASE_SERVICE_KEY` secret is configured in repository secrets, it will run the import script to upsert blueprints

Secrets used by CI (optional):

- `SUPABASE_SERVICE_KEY` — service_role key (only needed to run the import)

## Admin moderation

- Admins are identified by email suffix `@admin.curiousforge.com` in this prototype.
- Admin UI: `/admin/submissions` — approve/reject submissions

## Troubleshooting

- If save/bookmark doesn't persist, ensure Supabase env vars are set and `supabase/schema.sql` has been executed
- For auth redirect issues, ensure Supabase Authentication URL Configuration includes your production and localhost URLs

## Next steps (if you want me to continue)

1. I can run the import script in CI if you add `SUPABASE_SERVICE_KEY` to GitHub Secrets
2. I can add automated tests (vitest) and e2e smoke tests if desired
3. I can harden RLS policies or add role-based admin handling
# The Curious Forge 🔬

แพลตฟอร์มการเรียนรู้วิทยาศาสตร์ผ่านการทดลอง สร้างด้วย Nuxt 3 + TailwindCSS

## การติดตั้ง

```bash
# ติดตั้ง dependencies
npm install

# รันเซิร์ฟเวอร์สำหรับพัฒนา
npm run dev

# build สำหรับ production
npm run build
```

## คุณสมบัติ

- คลังพิมพ์เขียวการทดลอง
- คำแนะนำทีละขั้นตอน 
- บันทึกการทดลองที่ชอบ
- ส่งไอเดียการทดลองใหม่
- ธีมสีมืด (Dark Theme)
- รองรับการแสดงผลบนมือถือ

## เทคโนโลยีที่ใช้

- Nuxt 3
- TypeScript
- TailwindCSS 
- Vue Composition API

## โครงสร้างโปรเจกต์

```
pages/
 ├─ index.vue             → หน้า Home
 ├─ library.vue           → คลังพิมพ์เขียว
 ├─ blueprints/[id].vue   → รายละเอียดโปรเจกต์
 ├─ submit.vue            → แบบฟอร์มส่งไอเดีย
 ├─ profile.vue           → โปรไฟล์
 ├─ contact.vue           → ติดต่อเรา
 └─ about.vue             → เกี่ยวกับเรา

components/
 ├─ BlueprintCard.vue     → การ์ดโปรเจกต์
 ├─ StatCard.vue          → การ์ดสถิติ
 └─ AppFooter.vue         → ส่วนท้ายเว็บ

assets/
 ├─ css/tailwind.css      → สไตล์หลัก
 └─ data/blueprints.json  → ข้อมูลตัวอย่าง
```