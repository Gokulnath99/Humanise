import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Import your existing MODE_PROMPTS and types
type HumaniseMode = "subtle" | "casual" | "executive";

const MODE_PROMPTS: Record<HumaniseMode, string> = {
  subtle: `Rewrite this AI text into authentic human writing.

            LENGTH (HARD RULE):
            - Output length must stay within ±10% of the input's word count.
            - Do NOT add new examples, asides, intros, conclusions, or commentary.
            - Rewrite the existing sentences. Do not expand them.

            STATISTICAL MANIPULATION:
            - Increase perplexity: swap obvious words for unexpected alternatives.
            - Vary sentence length (mix short and long), but do not add new sentences.

            SYNTAX RULES:
            - Simplify multi-clause sentences into direct statements.
            - NEVER use: "Furthermore", "Moreover", "Additionally", "It's worth noting", "In conclusion".

            HUMAN PATTERNS:
            - Use contractions: don't, won't, it's, that's.
            - At most 1 em-dash in the whole output.
            - At most 1 sentence fragment.

            Output ONLY the rewritten text. No preamble, no closing line.`,

  casual: `Rewrite this as a real person explaining the SAME content to a friend.

            LENGTH (HARD RULE):
            - Output length must stay within ±10% of the input's word count.
            - Do NOT add new examples, anecdotes, or tangents. Rewrite, don't expand.
            - No "like when Tesla did X" style additions unless the input already named Tesla.

            DESTROY AI PATTERNS:
            - No hedging ("it's important to note" → cut it).
            - No AI transitions (furthermore, additionally, moreover).
            - Vary sentence length, but do not add sentences.

            HUMAN VOICE (use sparingly — one or two of these per paragraph max):
            - Contractions, the occasional filler ("honestly", "I mean").
            - One qualifier ("maybe", "I think") if it fits.
            - At most 1 em-dash and 1 sentence fragment in the whole output.

            Output ONLY the rewritten text. No preamble, no closing line.`,

  executive: `Rewrite this as a confident executive speaking to an industry peer.

            LENGTH (HARD RULE):
            - Output length must stay within ±10% of the input's word count.
            - Do NOT add new examples, intros, or "bottom line" wrap-ups not in the input.
            - Rewrite, don't expand.

            ELIMINATE AI FINGERPRINTS:
            - No passive voice, hedge words (potentially, might, could possibly), or corporate jargon (leverage, synergies).
            - No AI transitions (furthermore, moreover, additionally).

            EXECUTIVE VOICE:
            - Lead with the point. Direct statements over hedges.
            - At most 1 em-dash in the whole output.

            Output ONLY the rewritten text. No preamble, no closing line.`,
};

export async function POST(request: NextRequest) {
  const { text, mode = "subtle" } = await request.json();

  const validMode: HumaniseMode = ["subtle", "casual", "executive"].includes(mode)
    ? mode
    : "subtle";
  const prompt = MODE_PROMPTS[validMode];

  // Create a streaming response
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Use Anthropic's streaming API
        const response = await anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          messages: [
            {
              role: "user",
              content: `${prompt}\n\nText to humanise:\n${text}`,
            },
          ],
        });

        // Process each chunk as it arrives
        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            // Send the text chunk to the client
            controller.enqueue(
              new TextEncoder().encode(event.delta.text)
            );
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
