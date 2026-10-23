# Automed Dashboard

<p align="center">
  <strong>A bilingual workspace for monitoring business operations.</strong><br />
  Track orders, activity, and project performance from one Automed dashboard.
</p>

<p align="center">
  <a href="https://automed-dashboard.vercel.app/">Production app</a>
  ·
  <a href="https://github.com/ahmed-abdlhamid/Automed-Dashboard">Source code</a>
</p>

<p align="center">
  <img src="./public/og.jpg" alt="Automed Dashboard — تابع أعمالك" width="720" />
</p>

---

## Overview

Automed Dashboard is a web application for viewing operational data connected to Automed projects. It provides a shared interface for orders, activity, analytics, project settings, and automation-related tools, with access scoped by user and project.

## Features

- **Overview:** At-a-glance operational metrics and recent activity.
- **Orders:** Order records, details, and payment status.
- **Analytics:** Visual summaries of available project data.
- **Activity:** A timeline of recorded events.
- **Automation:** Admin tools for connected automation workflows.
- **Project settings and users:** Project configuration and account management.
- **Project-scoped access:** Keep the dashboard context tied to the selected project and user permissions.
- **Arabic and English:** RTL/LTR interface with language selection.
- **Light and dark themes:** Theme preference applied across the interface.
- **Responsive UI:** Layouts for desktop and mobile.
- **Observability:** Vercel Analytics and Speed Insights integrations.

## Technology stack

- [Next.js](https://nextjs.org/) 16 App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Supabase](https://supabase.com/) Auth and Postgres
- [Vercel Analytics](https://vercel.com/docs/analytics) and Speed Insights
- [Vercel](https://vercel.com/) hosting

## Getting started

### Requirements

- Node.js 20.9 or newer
- npm
- A Supabase project

### Install dependencies

```bash
git clone https://github.com/ahmed-abdlhamid/Automed-Dashboard.git
cd Automed-Dashboard
npm ci
```

### Configure environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

Use the values from your Supabase project. Never commit real credentials, access tokens, or service-role keys. Keep privileged keys on the server and out of `NEXT_PUBLIC_*` variables.

### Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Repository layout

```text
.
├── public/                 # Logos, illustrations, and Open Graph image
├── src/
│   ├── app/                # App Router pages, layouts, and API routes
│   ├── components/         # Shared interface components
│   └── lib/                # Shared utilities and service clients
├── supabase/               # Database migrations and SQL setup
├── package.json
└── README.md
```

## Deployment

The application is configured for deployment on Vercel. Connect the repository to the Vercel project, set the required Supabase environment variables in the project's environment settings, and deploy the intended branch.

Vercel Analytics and Speed Insights are included in the root layout. Their reports become available in the connected Vercel project after deployment and collection of visitor data.

## Security

- Do not commit `.env.local` or other secret-bearing files.
- Never expose a Supabase service-role key to the browser.
- Configure Supabase Row Level Security and policies for the application's data.
- Validate role- and project-based access with the relevant account types when changing permissions.

## Indexing

This application is an operational dashboard. Search-engine indexing is disabled in its metadata by default.

---

<p align="center"><sub>Automed — وفر وقتك</sub></p>
