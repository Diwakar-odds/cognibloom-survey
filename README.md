# CogniBloom — Interactive Cognitive Diagnostic Survey & Waitlist

A high-converting interactive diagnostic questionnaire and early-access waitlist web application built for **CogniBloom** (*"The AI That Teaches, Not Just Answers"*). Engineered with a retro OS window aesthetic, 10 structured diagnostic question clusters, direct serverless PostgreSQL persistence on **Neon**, and optional dual-write backup to Google Sheets.

---

## Key Features

- **Retro OS Interactive Experience**
  - High-contrast neo-brutalist retro aesthetic (`#f7f6f2` canvas, `#95d9c0` mint accents, pixel display typography).
  - Peeking robot mascot (`PeekingCharacter`) providing live visual feedback while answering.
  - Walking avatar progress bar (`WalkingAvatarProgressBar`) tracking phase progression across all 10 clusters.
  - Zero-audio interaction design with celebratory confetti on waitlist completion.
- **10-Phase Cluster Diagnostic Questionnaire**
  - Groups 20+ conditional questions into 10 focused clusters to minimize cognitive load and vertical scroll fatigue.
  - Supports conditional branching (`showIf`), single-select cards, multi-select pill matrices, custom "Other" text inputs, and custom retro range sliders.
- **Serverless Neon PostgreSQL Persistence**
  - Built-in Next.js App Router API route (`POST /api/survey/submit`) powered by `@neondatabase/serverless`.
  - Parameterized SQL queries (SQL-injection safe) storing full survey responses in `JSONB` (`survey_responses`) and automatically upserting leads into `waitlist`.
  - Server-side input sanitization, email regex validation, and safe error handling.
- **Optional Google Sheets Dual-Write Backup**
  - Automatically syncs responses to a Google Sheet via Apps Script webhook if `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` is configured.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js `16.4.6` (App Router + Turbopack) |
| **UI Library** | React `19.2.6` |
| **Styling** | Tailwind CSS `v4` (`@tailwindcss/postcss`) |
| **Animations & Effects** | Framer Motion `12`, Lucide React, Canvas Confetti |
| **Database** | Neon Serverless PostgreSQL (`@neondatabase/serverless`) |
| **Optional Backup** | Google Apps Script Web App (`GoogleAppsScript_Code.js`) |

---

## Project Structure

```text
cognibloom-survey/
├── app/
│   ├── layout.jsx                     # Root layout, metadata, Google Fonts
│   ├── page.jsx                       # Entry page mounting the survey app
│   └── api/
│       └── survey/
│           └── submit/
│               └── route.js           # POST /api/survey/submit (NeonDB persistence)
├── db/
│   └── schema.sql                     # Idempotent PostgreSQL DDL (survey_responses + waitlist)
├── public/
│   ├── favicon.svg
│   └── logo.png
├── src/
│   ├── App.jsx                        # Main client view wrapper
│   ├── index.css                      # Tailwind v4 + custom retro font utilities
│   ├── data/
│   │   └── surveyQuestions.js         # 10 diagnostic clusters + conditional logic
│   ├── services/
│   │   └── googleSheets.js            # Client submission service (/api/survey/submit + optional Sheets)
│   └── themes/
│       └── retro/
│           ├── RetroSurveyView.jsx    # Primary multi-step survey & waitlist UI
│           ├── PeekingCharacter.jsx   # Animated mascot component
│           ├── RetroScaleSlider.jsx   # Custom tactile scale slider
│           └── WalkingAvatarProgressBar.jsx
├── GoogleAppsScript_Code.js           # Optional Google Sheets Apps Script handler
├── .env.example                       # Environment variable template
├── next.config.mjs                    # Next.js config (reactStrictMode + security agentUpgrade)
└── postcss.config.mjs                 # Tailwind v4 PostCSS plugin config
```

---

## Prerequisites

- **Node.js** `20.x` or later (recommended: `20 LTS` or `22 LTS`)
- **npm** `10.x` or later
- A **Neon PostgreSQL** project/database ([neon.tech](https://neon.tech))

---

## Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Diwakar-odds/cognibloom-survey.git
cd cognibloom-survey
```

### 2. Install Dependencies
Use `npm ci` to install exact lockfile-pinned versions cleanly:
```bash
npm ci
```

### 3. Provision Database Schema (Fresh Neon Database Only)
Open your **Neon Console → SQL Editor** and run the contents of [`db/schema.sql`](./db/schema.sql).
This idempotently creates:
- `survey_responses` (with `answers JSONB`, indexes on `email` and `submitted_at`)
- `waitlist` (with `UNIQUE (email)` constraint for upsert deduplication)

### 4. Configure Environment Variables
Copy `.env.example` to `.env` (never commit `.env` to Git):
```bash
cp .env.example .env
```

Fill in your Neon connection string:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `NEON_DATABASE_URL` | **Yes** *(or `DATABASE_URL`)* | Pooled Neon PostgreSQL connection string (`?sslmode=require`). |
| `DATABASE_URL` | Optional alias | Supported fallback if `NEON_DATABASE_URL` is not set. |
| `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` | Optional | Deployed Google Apps Script Web App URL for secondary backup. |

Example `.env`:
```env
NEON_DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-your-host-pooler.region.aws.neon.tech/neondb?sslmode=require"
# NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Optional: Google Sheets Dual-Write Setup

If you also want every submission mirrored into a Google Sheet:
1. Open a Google Sheet and go to **Extensions → Apps Script**.
2. Paste the full contents of [`GoogleAppsScript_Code.js`](./GoogleAppsScript_Code.js) into `Code.gs` and save.
3. Click **Deploy → New deployment → Web app**:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Copy the generated Web App `/exec` URL and set it as `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` in your environment variables.

---

## API Reference

### `POST /api/survey/submit`

Persists a completed survey to `survey_responses` and upserts the respondent into `waitlist`.

**Request Body (`application/json`):**
```json
{
  "name": "Diwakar Chaurasia",
  "email": "student@example.com",
  "phone": "+91 98765 43210",
  "learning_stage": "College / University",
  "college_year": "3rd Year",
  "college_stream": "Engineering / CS",
  "theme_used": "retro",
  "answers": {
    "learning_stage": "College / University",
    "memory_loss_timeframe": "Within a week"
  }
}
```

**Responses:**
- `200 OK` — `{ "success": true, "message": "...", "lead_id": "4" }`
- `400 Bad Request` — Missing `name`/`email` or invalid email format
- `500 Internal Server Error` — Missing DB connection env var or database failure (internal details are logged server-side and never exposed to clients)

---

## Production Deployment

### Deploy on Vercel (Recommended)
1. Import `Diwakar-odds/cognibloom-survey` in the [Vercel Dashboard](https://vercel.com/new).
2. Framework Preset: **Next.js** (auto-detected).
   - **Build Command:** `npm run build`
   - **Install Command:** `npm ci`
3. Add Environment Variables under **Project Settings → Environment Variables**:
   - `NEON_DATABASE_URL` (Production, Preview, Development)
   - `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` *(optional)*
4. Click **Deploy**.

### Deploy on Netlify
1. Import `Diwakar-odds/cognibloom-survey` in the [Netlify Dashboard](https://app.netlify.com).
2. Build settings:
   - **Build Command:** `npm run build`
   - **Node Version:** `20` (via `NODE_VERSION=20` env var)
3. Add `NEON_DATABASE_URL` in **Site Configuration → Environment Variables**.
4. Deploy and verify `POST /api/survey/submit` by submitting a test response and checking NeonDB.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start local Next.js development server (`http://localhost:3000`) |
| `npm run build` | Compile optimized production build |
| `npm run start` | Start production server locally after `npm run build` |
| `npm run lint` | Run Next.js linting checks |

---

## Security & Pre-Launch Checklist

- [ ] `.env` is excluded via `.gitignore` and never committed.
- [ ] `NEON_DATABASE_URL` is configured in the hosting provider's encrypted Environment Variables.
- [ ] Neon database tables exist (`db/schema.sql` executed).
- [ ] `npm audit` reports `0 vulnerabilities` (Next.js `16.4.6`).
- [ ] Clean `npm run build` succeeds with zero errors.
