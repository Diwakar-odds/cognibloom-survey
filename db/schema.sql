-- CogniBloom Survey & Waitlist Database Schema (Neon PostgreSQL)
-- Run this once in the Neon SQL Editor when provisioning a fresh database.

CREATE TABLE IF NOT EXISTS survey_responses (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT 'N/A',
  learning_stage TEXT DEFAULT '',
  college_year TEXT DEFAULT '',
  college_stream TEXT DEFAULT '',
  theme_used TEXT DEFAULT 'retro',
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_survey_responses_email
  ON survey_responses (email);

CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at
  ON survey_responses (submitted_at DESC);

CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
