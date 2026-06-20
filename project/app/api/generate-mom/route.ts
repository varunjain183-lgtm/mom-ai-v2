import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const prompt = `You are a professional meeting secretary. Analyze the following meeting transcript and generate a comprehensive Minutes of Meeting (MOM) document.

Return your response as a valid JSON object with exactly this structure:
{
  "summary": "A concise 2-3 sentence overview of the meeting",
  "discussionPoints": ["point 1", "point 2", ...],
  "decisions": ["decision 1", "decision 2", ...],
  "actionItems": [
    { "task": "task description", "owner": "person name or TBD", "deadline": "deadline or TBD" }
  ],
  "risks": ["risk 1", "risk 2", ...],
  "nextSteps": ["next step 1", "next step 2", ...]
}

If any section has no relevant content, return an empty array [] for that field.
Do NOT include markdown formatting, code blocks, or any text outside the JSON object.

Meeting Transcript:
${transcript}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate MOM. Please check your API key.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ error: 'No response from Gemini' }, { status: 500 });
    }

    // Strip any potential markdown code fences
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let mom;
    try {
      mom = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ mom });
  } catch (err) {
    console.error('Error generating MOM:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
