# Lecture Presentation

A Korean lecture about AI industry, practical workflows, and careers, presented as
an interactive website. The focus is creating slides, examples,
speaker notes, visuals, and pacing.

## Lecture brief

Help participants understand the AI industry, try useful ways of working with AI,
and connect their existing experience to meaningful projects and career choices.

### Audience

- Korean participants with introductory AI and AI agent knowledge; coding ability
  and technical familiarity vary.
- Backgrounds include development, HR, marketing, and service planning, from recent
  graduates to experienced professionals and people changing careers.
- Interests include employment, entrepreneurship, AX consulting, and building
  AI agents for specific domains.
- Use familiar Korean consumer products for everyday examples. Choose widely
  recognized companies and tools for technical/B2B topics regardless of nationality.
  Explain unfamiliar terms and names before relying on them.
- Connect existing expertise to practical problems, sound judgment, and evidence
  of capability. Include both entry-level and career-transition perspectives.

### Sessions and pacing

| Session | Main thread |
| --- | --- |
| 1. 산업을 읽다 | AI history and the industry map: products and AX, models, and infrastructure |
| 2. 실무를 만나다 | Agent tools, practical automation, making samples, validation, and improving how we use AI |
| 3. 커리어를 설계하다 | Changing roles → domain-specific skills and experience → portfolio goals and evidence → open source → resumes → AI interview practice → continuous learning and adaptation |

The three-hour format is three sessions of **45 minutes of presentation + 15 minutes
for Q&A and a break combined**. The introduction is included in the first session's
presentation time, and closing remarks fit within the final Q&A block.
The current deck contains 63 slides, including the opening and session Q&As.
The opening follows title → website → session agenda.

Session 3 uses the same experience records throughout portfolio, resume, and
interview preparation. Suggested pacing for its 45-minute presentation is:

| Slides | Topic | Minutes |
| --- | --- | --- |
| 048 | 역할의 변화: overlapping responsibilities | 3 |
| 049–051 | 영역별 역량: product development, model experiments, and computing/infrastructure experience | 8 |
| 052–053 | 문제 정의와 실행 계획: choosing a problem and planning implementation and validation | 7 |
| 054–055 | 포트폴리오: connecting the problem, execution, and validation evidence | 6 |
| 056–057 | 오픈소스: real requirements, testing evidence, and the community review loop | 5 |
| 058–060 | 이력서: hiring-side AI, AI-assisted drafting and editing, and LaTeX/PDF | 9 |
| 061 | 면접: AI mock interviews with follow-up questions and feedback | 5 |
| 062 | 학습: learning continuously and adapting to change | 2 |
| 063 | Q&A 및 휴식 | 15 |

### Teaching principles

Give each slide one teaching point and an intuitive visual story. Balance broad
context, presenter interpretations, documented cases, and brief technical references.
Keep Korean slide copy concise; put depth and sources in speaker notes. Use motion
and images to support the explanation, and maintain a coherent style across slides.
Verify current claims, use real products, and ground personal anecdotes in supplied
facts. Explain technical detail only as far as it serves the audience and message.

## Slide authoring

- **Slides:** `content/slides/NNN.tsx` and matching `NNN.css`, in contiguous
  three-digit presentation order. Follow a nearby slide's authoring pattern.
- **Metadata:** each slide exports a literal `metadata` object with `id`, `title`,
  `section`, `subsection`, and `maxStep`. Keep stable IDs when refining content.
- **Speaker notes:** `notes/NNN.md`, matching the slide number. Start with an
  unnumbered title; include narration, explanations, references, and image credits.
  These are private local files excluded from Git and repository history. A public
  checkout builds and runs without them. Keep administrative IDs and configuration in code.
- **Assets:** `public/slides/NNN/` for a single slide, `public/shared/` for reused
  material. Retain source records and credits for downloaded images.
- **Shared presentation material:** `content/components/`, `content/theme.css`, and
  `content/presentation.ts` contain reusable visuals, styling, and presentation labels.

Use `step` to determine reveals and honor `instant` so direct links and backward navigation
restore the correct state. For example, `maxStep: 2` means steps 0, 1, and 2.

When adding or reordering slides, move the matching CSS/import, notes, and asset
references together. Keep numbering contiguous and recheck shared slide links
after changing the order.

Review affected slides alongside their neighbors. Check readability, overflow,
initial/intermediate/final reveals, forward/backward navigation, desktop and narrow
screens, and the explanation's speaking time. The file audit does not verify facts
or visual quality; review those directly.

## Start locally

Use **Node.js 22.18 or newer** and npm with the existing lockfile.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173, or the LAN URL printed by the server. The preview binds
to `0.0.0.0` for access from other devices. The viewer runs entirely in the browser.

## Viewing the slides

Open `/` for the title slide or share a specific reveal with a link such as
`/?index=5&step=2`. Use the arrow keys or the previous and next buttons to move
through reveals, and use **목차** to jump to a slide. The menu stays open after
selection and remembers whether it was open the next time you visit. Slide links
use the original lecture numbers so shared URLs keep working. The old introduction
link (`?index=2`) opens the website overview.

On desktop, **슬라이드 전체 화면** fills the available screen with the slide.
Use **Esc** to return to the controls. The **⛶** button keeps the controls visible
in fullscreen. On phones, rotate to landscape to fit the slide between the
navigation controls.

## Static hosting

Run `npm run build` and serve the contents of `dist/` at the website root.
Only that directory is published. The build uses the slide source and public
assets, excluding private notes and presenter files. To check the built site
locally, run `npm run preview`.

For [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/),
point an assets-only Worker configuration at `./dist`. Use a separate Worker name
to preview the static build. For a later cutover at the
[existing URL](https://lecture-presentation.chris-ryu.workers.dev/), use the existing
account and Worker name, `lecture-presentation`. The live Worker owns the
`LectureSession` Durable Object class, so check its
[class migration requirements](https://developers.cloudflare.com/durable-objects/reference/durable-objects-migrations/)
before switching. Deleting that class also deletes its stored session data.
The static viewer does not need the D1 database.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local preview with live updates |
| `node scripts/audit-lecture.mjs` | Check slide IDs, note titles, and file/order connections |
| `npm run typecheck` | Check source and test types |
| `npm run build` | Build the presentation |
| `npm test` | Run deck and slide tests |
| `npm run test:browser:install` | Install Chromium and WebKit for desktop and mobile browser checks |
| `npm run test:browser` | Review every slide/reveal and interactions on desktop and narrow screens |
| `npm run test:browser:report` | Open the last browser report and screenshots |
| `npm run verify` | Type-check, run tests, and build the static site |

Choose checks appropriate to the change. Copy and source updates need content and
visual review; component/reveal changes also need type checks and relevant tests.
Shared behavior changes warrant broader checks. Ordinary copy edits do not need new
tests. Browser checks run separately from `verify` and use port 4173, which must be
free. They run against the production build.

Keep private files, test reports, and generated output out of Git.
Deployment is a separate task and requires an explicit request.

## License

Original project source and documentation are available under the [MIT License](LICENSE).
Third-party icons, logos, screenshots, and reference materials retain their respective
licenses and credits, recorded in `public/shared/` and the slide asset folders.
