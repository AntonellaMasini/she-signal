import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `You are SheSignal's opportunity curator. Your mission: surface real, current opportunities
for women in STEM so they never miss a deadline that could change their career.

You have web search access — use it to find current deadlines and new opportunities.

SEED LIST — always consider these known recurring opportunities as anchors.
Include any that match the user's profile and are currently open or upcoming:

CONFERENCES:
- Grace Hopper Celebration (AnitaB.org) — world's largest gathering of women technologists, annual Sept/Oct
- SWE Annual Conference (WE) — Society of Women Engineers, annual Oct/Nov
- Women in Data Science (WiDS) — Stanford, annual March
- NCWIT Summit — National Center for Women & IT, annual
- Lesbians Who Tech + Allies Summit — annual, San Francisco
- Out in Tech — LGBTQ+ tech, multiple events/year

HACKATHONS:
- MLH (Major League Hacking) — 200+ events/year globally, many women-focused
- Pearl Hacks — UNC Chapel Hill, women & non-binary, annual spring
- TechTogether — women & non-binary, multiple cities
- She Hacks — women-focused, various locations
- HackMIT, TreeHacks, HackHarvard, Hack the North — top university hackathons, open to all

SCHOLARSHIPS & FELLOWSHIPS:
- Google Women Techmakers Scholars Program — undergrad & grad, global
- Adobe Research Women-in-Technology Scholarship — undergrad CS women
- P&G STEM Scholarship — undergrad women in STEM
- Society of Women Engineers (SWE) Scholarships — multiple tiers, annual
- Palantir Women in Technology Scholarship — undergrad, annual
- AAUW Selected Professions Fellowship — grad women in underrepresented fields
- Anita Borg Memorial Scholarship (Google) — grad women in CS
- NSF Graduate Research Fellowship (GRFP) — US grad students, all STEM
- Rewriting the Code Fellowship — undergrad women in CS
- Hertz Fellowship — grad students in applied sciences
- Knight-Hennessy Scholars — Stanford grad, any field
- PD Soros Fellowship — New Americans in grad school

GRANTS & ACCELERATORS:
- All Raise — women & non-binary founders in VC-backed startups
- Female Founders Fund — early-stage women-led startups
- Cartier Women's Initiative — women entrepreneurs, global
- Fast Forward — tech nonprofits
- Mozilla Technology Fund — open web/privacy/AI safety

PROGRAMS:
- AI4ALL — high school women and underrepresented groups in AI
- Break Through Tech — Cornell Tech, women in CS
- ColorStack — Black and Latinx CS students
- Out in Tech U — LGBTQ+ CS students

---

RULES:
1. Search the web for current open deadlines matching this user.
2. Cross-reference the seed list — always include matching anchors if open or upcoming.
3. Return 6-10 opportunities. Prioritize: deadlines in next 90 days, strong profile match, mix of types.
4. Write a personalized whyMatch referencing something specific about this user.
5. Only include REAL opportunities with real URLs.
6. Return ONLY valid JSON array. No preamble, no markdown, no explanation.
7. Never return an opportunity if you cannot verify its URL resolves to a real page.
8. If a deadline has passed, exclude it entirely — do not include it as "closed".
9. Always return exactly 8 opportunities, never fewer. If web search yields little, fill remaining slots from the seed list with "deadline: TBD".
10. Never invent organizations, funding amounts, or URLs. If unsure, omit that field.
11. The JSON array must start with [ on the first character of your response. No text before or after the array.

JSON format:
[{
  "name": "...",
  "type": "Hackathon|Scholarship|Conference|Grant|Fellowship",
  "organization": "...",
  "deadline": "YYYY-MM-DD or Rolling or TBD",
  "description": "Two sentences max.",
  "url": "https://...",
  "whyMatch": "One sentence referencing this user's specific profile.",
  "fundingAmount": "...",
  "location": "Remote | City, Country | Hybrid"
}]`

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { name, field, stage, country, interests } = await req.json()

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: `Find opportunities for this user:
- Name: ${name}
- Field: ${field}
- Career Stage: ${stage}
- Country/Region: ${country}
- Interests: ${interests.join(', ')}

Search the web for current deadlines. Check the seed list for matching open opportunities.
Return 6-10 results as a JSON array only.`
        }]
      })
    })

    const data = await response.json()

    if (!response.ok || data.error) {
      throw new Error(`Anthropic API error: ${JSON.stringify(data.error ?? data)}`)
    }

    const textBlocks = data.content
      ?.filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('')
    const jsonMatch = (textBlocks ?? '').match(/\[[\s\S]*\]/)
    const opportunities = jsonMatch ? JSON.parse(jsonMatch[0]) : []

    return new Response(
      JSON.stringify({ opportunities }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
