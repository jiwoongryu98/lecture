# AGENTS.md

## Focus

- The main objective is creating lecture content, narrative, visuals,
  speaker notes, and pacing. Change website functionality when the user requests it
  or the teaching material needs it; keep it simple.
- Write slide copy in Korean unless requested otherwise.
- Read README's [Lecture brief](README.md#lecture-brief) for the audience and
  session goals, and [Slide authoring](README.md#slide-authoring) for file conventions.
- Assume a Korean audience with basic AI knowledge and varied professional and
  coding backgrounds. Use familiar Korean consumer products for everyday examples;
  use widely recognized companies and tools for technical/B2B examples regardless
  of nationality. Explain unfamiliar terms and names plainly.
- Verify factual claims, use documented real products, and base personal anecdotes
  on supplied facts. Avoid hypothetical scenarios and invented outcomes.

## Slides and notes

- Give each slide one teaching point and an intuitive visual story. Balance
  overviews, presenter interpretations, documented cases, and brief references.
- Keep slides concise and readable. Put detailed explanations, sources, and image
  credits in speaker notes.
- Consider composition and animation deliberately. Avoid defaulting to boxes
  revealed left to right; use that layout only when it fits the explanation.
- Use downloaded, sourced images where they naturally support the teaching point.
- Author slides as `content/slides/NNN.tsx` and matching `NNN.css`, in contiguous
  three-digit order. Keep literal slide metadata and stable IDs; derive reveals
  from `step` and honor `instant`.
- Each slide author must maintain its matching `notes/NNN.md`, with an unnumbered
  title. Keep slide, note, and asset numbering aligned when reordering.
- Speaker notes are private local files ignored by Git. Never commit or push
  them; the public checkout must build and run without them.
- Put slide-specific assets in `public/slides/NNN/` and reused assets in
  `public/shared/`. Preserve source links and credits.
- Reuse existing controls and presentation behavior. Do not add
  reduced-motion-specific functionality or tests.

## Review and checks

- Review neighboring slides for coherent terminology, visual language, transitions,
  and pacing. Check initial, intermediate, and final reveal states, forward and
  backward, on desktop and narrow screens.
- Run `node scripts/audit-lecture.mjs` for slide/note changes. This checks file
  connections, not factual accuracy or visual quality.
- Use npm and the existing lockfile. Preview with `npm run dev`; build with
  `npm run build`. Run checks appropriate to the change; see README's
  [Commands](README.md#commands). Use `npm run verify` for full validation.
- Ordinary copy edits do not require new tests. Test changed behavior and complete
  relevant existing checks.

## Boundaries

- Preserve configured credentials and keep secrets out of source, output, and logs.
- Edit source files rather than generated output.
- Keep changes local unless deployment is requested.
