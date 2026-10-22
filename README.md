# Automed Dashboard

لوحة تحكم Automed لمتابعة عمليات الأعمال والطلبات والأداء، وإدارة المشاريع وأنظمة الأتمتة من مكان واحد.

**Production:** https://automed-dashboard.vercel.app  
**Repository:** https://github.com/ahmed-abdlhamid/Automed-Dashboard

## What it includes

- **Overview:** ملخص سريع للأداء ومؤشرات الطلبات والإيرادات والعملاء.
- **Orders:** عرض الطلبات وتفاصيلها وحالات الدفع.
- **Analytics:** متابعة المؤشرات والتحليلات المتاحة للبيانات المسجلة.
- **Automation:** أدوات إدارة الأتمتة المخصصة للمسؤول.
- **Activity, Users, Settings:** صفحات النشاط وإدارة المستخدمين وإعدادات المشروع.
- **Multi-project access:** فصل بيانات المشاريع حسب صلاحيات المستخدم والمشروع.
- **Arabic and English:** واجهة ثنائية اللغة مع دعم اتجاه RTL/LTR.
- **Light and dark themes:** مظهر فاتح وداكن.
- **Responsive interface:** تصميم مناسب للشاشات الكبيرة والصغيرة.
- **Performance monitoring:** تكامل Vercel Analytics وVercel Speed Insights.

## Tech stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Supabase authentication and database
- Vercel Analytics and Speed Insights
- Vercel deployment

## Requirements

- Node.js version compatible with the installed Next.js version
- npm
- A Supabase project configured for this dashboard

## Local development

1. Clone the repository:

   ```bash
   git clone https://github.com/ahmed-abdlhamid/Automed-Dashboard.git
   cd Automed-Dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file named `.env.local` and add the public Supabase project values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
   ```

   Replace the example values with the ones from your Supabase project. Never commit real credentials or secrets.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |

## Deployment

The project is configured for deployment on Vercel. Connect the GitHub repository to the Vercel project, configure the required Supabase environment variables in the Vercel project settings, and deploy the selected branch.

Vercel Analytics and Speed Insights are included in the root layout. Their dashboards are available through the connected Vercel project after deployment.

## Metadata and indexing

The application provides Automed-branded metadata, the current light and dark Automed logos, PNG browser and Apple icons, and a branded Open Graph preview. Since this is an operational dashboard, search-engine indexing is disabled by default. Public marketing pages should use their own indexable metadata. Vercel Analytics is not the same as Google Analytics; a Google Analytics property and measurement ID are required if Google Analytics tracking is needed.

## Security notes

- Keep environment files and secrets out of Git.
- Use Supabase policies and project-level access controls to protect data.
- Do not expose service-role keys in client-side environment variables.
- Verify access with both administrator and client accounts after changes.

## Brand

Automed builds AI agents and automation systems for businesses. This dashboard provides a central place to monitor and manage the related operational data and workflows.
