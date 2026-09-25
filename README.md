# Charbage

A markdown-based blogging/publishing platform built with Next.js.

🔗 [Live Demo](https://charbage.netlify.app)

## Features

- **Markdown Editor** — write posts with live preview, syntax highlighting
- **Authentication** — secure sign-up/login with session-based auth
- **Social Interaction** — comment, like, and bookmark posts
- **Database** — persistent storage for posts, users, and interactions
- **Responsive UI** — clean, mobile-friendly design with light/dark mode

## Tech Stack

- **Language:** TypeScript
- **Frontend:** Next.js 15, React 19, Tailwind CSS, shadcn/ui, Radix UI
- **Backend:** Next.js (API routes), RESTful API
- **Authentication:** Email/Password + OAuth (GitHub, Google) via Oslo.js, Arctic, bcrypt
- **Database:** PostgreSQL (NeonDB), Drizzle ORM
- **Editor:** react-md-editor, react-markdown, highlight.js
- **Media Storage:** Cloudinary
- **HTTP Client:** Fetch API
- **Hosting:** Netlify
- **Other:** Zod, React Hook Form, next-share, dayjs

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn/bun)
- A Neon Postgres database
- Cloudinary account (for image uploads)

### Installation

1. Clone the repo
```bash
   git clone https://github.com/SheIsBukki/charbage.git
   cd charbage
```

2. Install dependencies
```bash
   pnpm install
```

3. Set up environment variables
```bash
   cp .env.example .env
```
Fill in your database URL, Cloudinary credentials, and auth secrets.

4. Run database migrations
```bash
   pnpm drizzle-kit push
```

5. Start the dev server
```bash
   pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
charbage/ 
├── app/ # Next.js app router pages & routes
├── components/ # Reusable UI components
├── context/ # React context providers
├── db/ # Database schema & config
├── lib/ # Core utilities/helpers
├── migrations/ # Drizzle database migrations
├── public/ # Static assets
└── utils/ # Utility functions
```