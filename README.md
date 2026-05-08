# Resume Video Portfolio

A bilingual resume and short-video portfolio built with Vite, React, TypeScript, Motion, Supabase, and Vercel.

## Local Development

```bash
npm install
npm run dev
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create an Auth user with email/password.
4. Add that email to `public.admin_users`.
5. Copy `.env.example` to `.env.local` and fill:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Admin

Open `/admin`, sign in with the configured admin user, then upload, edit, publish, unpublish, or delete portfolio videos.

## Build

```bash
npm run build
```

## Deploy

Deploy to Vercel and add the same Supabase environment variables in the Vercel project settings.
