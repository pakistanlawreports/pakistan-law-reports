import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_TEXT_LENGTH = 20000;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const pastedText = formData.get('text');

    let judgmentText = '';

    if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        return Response.json({ error: 'File too large. Please upload a PDF under 10MB.' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const pdfParse = (await import('pdf-parse')).default;
      const parsed = await pdfParse(buffer);
      judgmentText = parsed.text;
    } else if (pastedText) {
      judgmentText = pastedText;
    }

    if (!judgmentText || judgmentText.trim().length < 200) {
      return Response.json(
        { error: 'Could not find enough readable text. Please upload a text-based PDF (not a scanned image), or paste the judgment text directly.' },
        { status: 400 }
      );
    }

    const truncated = judgmentText.slice(0, MAX_TEXT_LENGTH);

    const prompt = `Below is the text of a court judgment. Read it and produce a structured
one-page brief, based STRICTLY on what's actually in this text - do not invent facts, cases,
or holdings not present in the document. Respond with ONLY a JSON object in this exact format,
no other text:

{
  "case_name": "the case name/title as it appears in the text",
  "citation": "the citation if present, otherwise empty string",
  "facts": "2-4 sentences summarizing the key facts",
  "issues": "the legal issue(s) the court had to decide, as a short list or 2-3 sentences",
  "holding": "what the court actually decided/ruled, 2-4 sentences",
  "precedents_cited": ["list of specific case citations mentioned in the text, if any - empty array if none found"],
  "practical_takeaways": "2-3 sentences on why this case matters practically"
}

If the text doesn't appear to actually be a court judgment (e.g. it's something else entirely),
respond with exactly: NOT_A_JUDGMENT

Judgment text:
${truncated}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = response.content[0].text.trim();

    if (responseText === 'NOT_A_JUDGMENT') {
      return Response.json(
        { error: 'This doesn\'t appear to be a court judgment. Please double-check the document and try again.' },
        { status: 400 }
      );
    }

    let brief;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      brief = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch {
      return Response.json({ error: 'Could not process this document. Please try again.' }, { status: 500 });
    }

    return Response.json({ brief, truncated: judgmentText.length > MAX_TEXT_LENGTH });
  } catch (error) {
    console.error('summarize-judgment API error:', error);
    return Response.json({ error: 'Something went wrong processing your document. Please try again.' }, { status: 500 });
  }
}
