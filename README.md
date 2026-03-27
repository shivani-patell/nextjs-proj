# JHealthcare Initiative – Frontline Feedback

Anonymous, three-step survey for reporting unusual drug effects: **Disclaimer → Questions → Resources**, then submit. Built with [Next.js](https://nextjs.org) and Tailwind CSS.

## What’s in this repo

- **`app/page.tsx`** – Survey UI (progress, all questions, resources, OPC opt-in).
- **`app/api/submit/route.ts`** – Receives submissions as `multipart/form-data`. On Vercel, payloads appear under **Project → Logs** (for demos; replace with a database or email service for production use).
- **`public/j-healthcare-logo.png`** – Header logo.

## Run it on your computer

1. Install [Node.js](https://nodejs.org) (LTS).
2. In this folder, install dependencies and start the dev server:

```bash
npm install
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run build   # production build
npm run lint    # ESLint
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), **Import** the repository and deploy (defaults work for Next.js).
3. Each deploy will use the latest `main` branch.

## Privacy policy link

The disclaimer links to the published privacy policy at  
`https://survey-tool-j-healthcare.vercel.app/privacy-policy`  
(update the constant in `app/page.tsx` if that URL changes).
