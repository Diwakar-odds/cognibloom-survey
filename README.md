# Cognibloom Interactive System Diagnostic & Waitlist 🎓🚀

A modern, high-converting interactive diagnostic questionnaire and waitlist web application engineered for **Cognibloom**. Built with a retro OS window aesthetic, relatable multi-question cluster layouts, and direct serverless PostgreSQL persistence.

---

## 🌟 Key Features

* **Retro OS Interactive UI:**
  * Authentic retro-terminal aesthetic with window title controls, pixel fonts, and tactile button states.
  * Peeking character mascot providing contextual feedback and gamified progression.
  * Walking avatar progress bar indicating cluster stage and live completion percentage.
* **Smart Cluster-Based Questionnaire:**
  * 10 thematic, relatable question clusters (2 questions per view) eliminating vertical page fatigue and excessive scrolling.
  * Sliders, multi-select pill matrices, and auto-expanding custom feedback inputs.
  * Comprehensive study habits, cognitive blindspots, and preferred AI learning companion diagnostics.
* **Direct Neon Database Integration:**
  * Next.js API Route (`/api/survey/submit`) utilizing `@neondatabase/serverless`.
  * Auto-initializes schema (`survey_responses` and `waitlist` tables).
  * Stores complete structured answers in `JSONB` alongside upserting waitlist contact leads.
* **Fallback Webhook Support:**
  * Redundant fallback client-side submission to Google Sheets via Google Apps Script Webhook.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Frontend:** React 19
* **Database:** Neon PostgreSQL Serverless (`@neondatabase/serverless`)
* **Styling:** Tailwind CSS v4
* **Animations:** Framer Motion 12
* **Effects:** Canvas Confetti & Lucide React Icons

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Diwakar-odds/cognibloom-survey.git
cd cognibloom-survey
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Neon PostgreSQL Connection String
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Optional: Google Sheets Webhook Fallback
VITE_GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

```bash
npm run build
npm run start
```
