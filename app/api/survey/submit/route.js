import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone = 'N/A',
      learning_stage = '',
      college_year = '',
      college_stream = '',
      theme_used = 'retro',
      answers = {},
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('[NeonDB API] NEON_DATABASE_URL or DATABASE_URL is not defined in environment variables');
      return NextResponse.json(
        { success: false, error: 'Database connection string not configured. Please set NEON_DATABASE_URL or DATABASE_URL in Netlify Environment Variables.' },
        { status: 500 }
      );
    }

    const sql = neon(databaseUrl);

    // 1. Insert complete survey responses including all 15-20 answers in JSONB
    const result = await sql`
      INSERT INTO survey_responses (
        name, email, phone, learning_stage, college_year, college_stream, theme_used, answers
      ) VALUES (
        ${name}, 
        ${email.toLowerCase().trim()}, 
        ${phone}, 
        ${learning_stage}, 
        ${college_year}, 
        ${college_stream}, 
        ${theme_used}, 
        ${JSON.stringify(answers)}
      )
      RETURNING id, submitted_at;
    `;

    // 2. Also enroll into the waitlist table automatically
    await sql`
      INSERT INTO waitlist (name, email)
      VALUES (${name}, ${email.toLowerCase().trim()})
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;
    `;

    console.log(`[NeonDB API] Successfully saved survey response for ${email} (ID: ${result[0]?.id})`);

    return NextResponse.json({
      success: true,
      message: 'Survey response and waitlist entry saved to NeonDB successfully!',
      lead_id: result[0]?.id,
    });
  } catch (error) {
    console.error('[NeonDB API] Database error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save to NeonDB' },
      { status: 500 }
    );
  }
}
