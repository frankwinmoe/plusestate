<a href="https://plusestate.vercel.app/">
  <img alt="PlusEstate - The ultimate real estate platform" src="/public/readme/hero.png">
  <h1 align="center">PlusEstate</h1>
</a>

<p align="center">
 The ultimate platform for real estate listings and property management
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
</p>
<br/>

## Features

- Built with [Next.js](https://nextjs.org) for a modern, scalable web application
  - App Router for seamless navigation
  - API Routes for server-side functionality
  - Client and Server Components for optimized rendering
- Authentication and user management powered by [Supabase](https://supabase.com)
- Styling with [Tailwind CSS](https://tailwindcss.com) for a responsive and modern design
- UI components built with [shadcn/ui](https://ui.shadcn.com/)
- Multi-language support with [next-intl](https://github.com/amannn/next-intl)
- Real estate-specific features:
  - Property listings with detailed information
  - Search and filter functionality
  - Favorites and comparisons

## Demo

You can view a fully working demo at [plusestate.vercel.app](https://plusestate-seven.vercel.app/en).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-org%2Fplusestate&project-name=plusestate&repository-name=plusestate&demo-title=PlusEstate&demo-description=The+ultimate+platform+for+real+estate+listings+and+property+management&demo-url=https%3A%2F%2Fplusestate.vercel.app%2F&demo-image=https%3A%2F%2Fplusestate.vercel.app%2Freadme%2Fhero.png)

The above will also clone the PlusEstate repository to your GitHub, which you can clone locally for development.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Clone the repository:

   ```bash
   git clone https://github.com/frankwinmoe/plusestate.git
   ```

3. Use `cd` to change into the app's directory:

   ```bash
   cd plusestate
   ```

4. Rename `.env.example` to `.env.local` and update the following:

```env
NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[INSERT SUPABASE PROJECT API PUBLISHABLE OR ANON KEY]
```

> Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true).

5. Install dependencies:

   ```bash
   npm install
   ```

6. Run the development server:

   ```bash
   npm run dev
   ```

   The app should now be running on [localhost:3000](http://localhost:3000/).

7. This project uses the default shadcn/ui style. If you want to customize the UI, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next).

## Feedback and issues

Please file feedback and issues over on the [PlusEstate GitHub repository](https://github.com/your-org/plusestate/issues).

## More resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
