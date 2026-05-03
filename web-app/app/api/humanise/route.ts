import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";


const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

type HumaniseMode = "subtle" | "casual" | "executive";

const MODE_PROMPTS: Record<HumaniseMode, string> = {
  subtle: `You are rewriting text to sound authentically human. 

DETECTION SIGNALS TO AVOID:
- Low perplexity: Don't always pick the most obvious next word
- Uniform burstiness: Vary sentence length dramatically (5 words, then 25, then 12)
- Predictable transitions: Never use "Furthermore", "Moreover", "Additionally"
- Hedging phrases: Remove "It's important to note", "It should be mentioned"
- Over-organization: Don't make every paragraph follow the same structure

HUMAN PATTERNS TO ADD:
- Occasional sentence fragments. Like this.
- Start some sentences with "And" or "But"
- Use specific details over generic statements
- Include one slightly unexpected word choice per paragraph
- Let some sentences run a bit long with natural tangents
- Vary paragraph lengths (some 2 sentences, some 5)

Keep the meaning intact. Output ONLY the rewritten text.`,

  casual: `Rewrite this like a real person texting a friend.

AVOID AI TELLS:
- Perfect grammar (break rules sometimes)
- Uniform rhythm (mix it up wildly)
- Generic phrases ("in today's world", "it goes without saying")
- Balanced structure (humans ramble, then get punchy)

ADD HUMAN ELEMENTS:
- Contractions everywhere (don't, won't, it's, that's, we're)
- Filler words scattered naturally: "like", "honestly", "I mean", "you know"
- Rhetorical questions: "Right?" "Know what I mean?"
- Incomplete thoughts that trail off...
- Mix formal and slang in the same sentence
- Personal interjections: "which is wild", "kind of annoying actually"
- One run-on sentence that captures how people actually talk when they're explaining something they're excited about

Output ONLY the rewritten text.`,

  executive: `Rewrite as a confident executive speaking to a peer. Direct, human, no corporate speak.

AVOID AI PATTERNS:
- Hedge words (potentially, might, could possibly)
- Passive voice (use active: "We did X" not "X was done")
- Balanced paragraph structure
- Predictable sentence openings
- Generic business phrases ("leverage synergies", "move the needle")

EXECUTIVE VOICE:
- Lead with the point. Support after.
- Short declarative sentences. Then a longer one to explain.
- "Look," "Here's the reality," "Bottom line"
- Specific numbers and examples over vague claims
- Confident but not arrogant: "This works" not "This could work"
- Occasional informal aside: "—and honestly, that surprised me—"
- One bold opinion per paragraph

Output ONLY the rewritten text.`,
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

    const validMode: HumaniseMode = ["subtle", "casual", "executive"].includes(mode)
        ? mode
        : "subtle";

    const prompt = MODE_PROMPTS[validMode];

    const message = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages: [
            {
                role: "user",
                content: `${prompt}\n\nText to humanise:\n${text}`,
            },
        ],
    });

    const humanisedText = message.content[0].type === "text"
    ? message.content[0].text
    : "";

    return NextResponse.json({ humanisedText });
  } catch (error) {
    console.error("Humanisation error:", error);
    return NextResponse.json(
      { error: "Failed to humanise text. Please try again." },
      { status: 500 }
    );
  }
}
