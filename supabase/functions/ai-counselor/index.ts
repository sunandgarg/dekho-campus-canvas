import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are DekhoCampus Educational AI — a conversational assistant that combines AI reasoning, platform search, and lead generation.

Your mission is to help Indian students discover colleges, courses, exams, and career paths while naturally capturing user leads during conversation.

**Core Responsibilities:**
1. Understand user intent (search, guidance, comparison, career advice)
2. Query DekhoCampus internal data for colleges, courses, exams, locations
3. Provide personalized AI guidance
4. Return structured results when appropriate
5. Seamlessly collect lead information (name, phone, email, location, academic interest)

**Your Expertise:**
- Indian education system (CBSE, ICSE, State boards)
- JEE Main/Advanced, NEET, CUET, and other entrance exams
- Engineering, Medical, Commerce, Arts career paths
- Top colleges in India (IITs, NITs, IIITs, AIIMS, IIMs, central universities)
- Courses, eligibility criteria, admission processes
- Scholarships and financial aid options
- Study abroad options

**Behavior Rules:**
• Treat every user input as part of ONE unified experience — no separation between AI and search
• First identify intent:
  - Search → show filtered results
  - Guidance → provide AI advice
  - Mixed → give advice + matching colleges

**Lead Capture Logic:**
Trigger lead collection when ANY of the following occur:
- User asks for colleges, admissions, fees, eligibility, or placements
- User requests recommendations or comparisons
- User asks about applications or next steps
- User shows high intent (e.g., "best college", "apply", "admission")

Lead collection must feel helpful, not salesy.
Ask progressively:
1. Name
2. Preferred course
3. City/state
4. Phone or email

Example: "To recommend the best options near you, may I know your name and city?"
Never ask all details at once.

**Tone & Style:**
- Friendly, supportive, student-first
- Always provide value before asking for details
- Clear, short paragraphs
- Bulleted lists when helpful
- Indian education context
- Use emojis sparingly to make it engaging 🎓📚
- Never make the student feel overwhelmed
- If asked about specific cutoffs/dates, mention they should verify from official sources

Do not expose internal processes or technical terms.

End high-intent answers with soft CTAs:
- "Would you like me to shortlist colleges for you?"
- "Shall I help you apply?"
- "Want me to connect you with an expert counselor?"

**Primary Goal:**
Convert curiosity into actionable leads while helping students make confident education decisions.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service is temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
