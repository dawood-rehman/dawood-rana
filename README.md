# Dawood Rehman Portfolio

A modern portfolio website with a lightweight admin CMS for managing homepage content. The project is built with Next.js, React, Tailwind CSS, Framer Motion, and MongoDB.

## Overview

This portfolio is designed to present professional profile information, selected projects, skills, education, contact details, and resume access in a clean production-ready UI. The admin panel allows the portfolio owner to update the visible homepage sections without editing code.

## Features

- Responsive portfolio homepage
- Light and dark theme support
- Smooth, restrained page transitions
- Admin dashboard for portfolio content
- MongoDB-backed content persistence
- Local browser cache for fast development previews
- Resume upload support
- Professional sections for About, Passion, Projects, Education, Skills, and Contact

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Framer Motion
- MongoDB
- Mongoose
- React Icons
- React Hot Toast

## Project Structure

```text
app/
  api/              API routes for admin auth, content, and resume upload
  components/       Portfolio UI and admin dashboard components
  context/          Admin authentication context
lib/                Storage, MongoDB, and admin auth utilities
models/             Mongoose schemas
public/             Static assets such as images and resume files
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file such as `.env.local` and add placeholder values for your own deployment:

```env
MONGODB_URI=your-mongodb-connection-string
ADMIN_PASSWORD=your-secure-admin-password
```

Run the development server:

```bash
npm run dev
```

Open the local URL printed by Next.js, usually:

```text
http://localhost:3000
```

## Admin CMS

The admin dashboard is available at:

```text
/admin
```

The dashboard is intentionally scoped to the same sections visible on the homepage:

- About
- Passion
- Projects
- Education
- Skills
- Contact

When MongoDB is configured, content is saved through the `/api/content` routes. The app also keeps a local cached copy in the browser so development remains fast and resilient.

## Environment Variables

Use environment variables through your local `.env.local` file or your hosting provider dashboard.

```env
MONGODB_URI=your-mongodb-connection-string
ADMIN_PASSWORD=your-secure-admin-password
```

Security notes:

- Do not commit real `.env` files.
- Do not place database credentials in `NEXT_PUBLIC_*` variables.
- Use a strong admin password before deploying.
- Rotate credentials if they are ever exposed.

## Resume Handling

When MongoDB is configured, resume uploads are stored in the portfolio content record and served through `/api/resume`. This avoids relying on writable deployment storage and works more reliably on serverless platforms. During local development without MongoDB, the app can still fall back to writing a resume file into `public/`.

## Scripts

```bash
npm run dev
npm run build
npm run start
```

## Production Checklist

- Configure MongoDB in the deployment environment.
- Set a strong admin password.
- Verify the Resume button opens the correct CV.
- Test both light and dark themes.
- Run a production build before deployment.

```bash
npm run build
```

## Privacy

This README intentionally uses placeholder environment values only. Do not add real passwords, database connection strings, tokens, or private credentials to documentation.
