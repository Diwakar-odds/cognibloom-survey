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

    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';

    if (!cleanName || !cleanEmail) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
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
        ${cleanName}, 
        ${cleanEmail}, 
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
      VALUES (${cleanName}, ${cleanEmail})
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;
    `;

    console.log(`[NeonDB API] Successfully saved survey response for ${cleanEmail} (ID: ${result[0]?.id})`);

    return NextResponse.json({
      success: true,
      message: 'Survey response and waitlist entry saved to NeonDB successfully!',
      lead_id: result[0]?.id,
    });
  } catch (error) {
    console.error('[NeonDB API] Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save response. Please try again later.' },
      { status: 500 }
    );
  }
}
