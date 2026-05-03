import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type HumaniseMode = "subtle" | "natural" | "casual";

const MODE_PROMPTS: Record<HumaniseMode, string> = {
  subtle: `You are a text humaniser. Your job is to lightly polish AI-generated text while keeping its structure intact.

Rules:
- Keep the original structure and flow mostly unchanged
- Use contractions (don't, won't, it's) instead of formal forms
- Replace 2-3 overly formal words with natural equivalents
- Vary sentence length slightly where it feels robotic
- Keep the tone professional but not stiff
- Minimal changes - just enough to remove the "AI feel"

IMPORTANT: Output ONLY the humanised text. No explanations, no preamble. Just the rewritten text.`,

  natural: `You are a text humaniser. Your job is to make AI-generated text sound like it was written by a real person.

Rules:
- Vary sentence length naturally (mix short punchy sentences with longer ones)
- Add transitional phrases humans use: "honestly", "I think", "to be fair", "basically"
- Occasionally start sentences with "And" or "But"
- Replace overly formal words with casual equivalents
- Add 1-2 minor imperfections per paragraph (but nothing distracting)
- Use contractions (don't, won't, it's) instead of formal forms
- Break up long sentences into shorter ones sometimes
- Add the occasional filler word or hesitation
- Keep the core meaning intact

IMPORTANT: Output ONLY the humanised text. No explanations, no preamble. Just the rewritten text.`,

  casual: `You are a text humaniser. Your job is to make AI-generated text sound conversational and informal.

Rules:
- Write like you're texting a friend or colleague
- Use plenty of contractions and casual phrases
- Add filler words: "like", "you know", "I mean", "kinda", "pretty much"
- Start sentences with "So", "And", "But", "Honestly", "Look"
- Break formal sentences into shorter, punchier ones
- Use casual expressions and slang where appropriate
- Add personal asides or reactions
- It's okay to be slightly imperfect - that's the point
- Keep the core meaning but make it sound like real speech

IMPORTANT: Output ONLY the humanised text. No explanations, no preamble. Just the rewritten text.`,
};

export async function POST(request: NextRequest) {
  try {
    const { text, mode = "natural" } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Please provide text to humanise" },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: "Text too long. Maximum 10,000 characters." },
        { status: 400 }
      );
    }

    const validMode: HumaniseMode = ["subtle", "natural", "casual"].includes(mode)
      ? mode
      : "natural";
    const prompt = MODE_PROMPTS[validMode];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `${prompt}\n\nText to humanise:\n${text}`,
        },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    });

    const humanisedText = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ humanisedText });
  } catch (error) {
    console.error("Humanisation error:", error);
    return NextResponse.json(
      { error: "Failed to humanise text. Please try again." },
      { status: 500 }
    );
  }
}
