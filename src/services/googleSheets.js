/**
 * Survey Submission Service
 * Direct persistence to NeonDB PostgreSQL via Next.js internal API route (/api/survey/submit)
 * Optional: Google Sheets webhook backup (if NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL is set)
 */

const GOOGLE_SHEETS_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL || '';

export async function submitToGoogleSheets(answers, leadInfo) {
  // Format payload with student details and all question answers
  const payload = {
    name: leadInfo.name,
    email: leadInfo.email,
    phone: leadInfo.phone || 'N/A',
    learning_stage: answers.learning_stage || '',
    college_year: answers.college_year || answers.school_class || '',
    college_stream: answers.college_stream || '',
    theme_used: leadInfo.theme || 'retro',
    answers: { ...answers },
  };

  console.log('[Survey] Submitting response to NeonDB (/api/survey/submit):', payload);

  let neonSuccess = false;
  let responseData = null;

  // 1. Submit directly to Next.js NeonDB route (relative path, zero external port dependencies)
  try {
    const res = await fetch('/api/survey/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      responseData = await res.json();
      neonSuccess = true;
      console.log('[Survey] NeonDB verified saved:', responseData);
    } else {
      const errText = await res.text();
      console.error('[Survey] API error response:', res.status, errText);
    }
  } catch (err) {
    console.error('[Survey] Direct API fetch failed:', err);
  }

  // 2. Dual-write to Google Sheets if configured (optional backup)
  if (GOOGLE_SHEETS_URL) {
    try {
      const sheetPayload = {
        submittedAt: new Date().toISOString(),
        name: leadInfo.name,
        email: leadInfo.email,
        phone: leadInfo.phone || 'N/A',
        ...answers,
      };

      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetPayload),
      });
      console.log('[Survey] Google Sheets backup synced.');
    } catch (sheetErr) {
      console.error('[Survey] Google Sheets error:', sheetErr);
    }
  }

  if (neonSuccess) {
    return { success: true, data: responseData };
  }

  // If failed, throw clear error
  throw new Error('Database connection failed. Please check connection and try again.');
}
