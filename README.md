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
| 3. 경험을 연결하다 | Changing roles → portfolio goals and evidence → open source → resumes → AI interview practice → continuous learning and adaptation |

The three-hour format is a five-minute opening, three sessions of **40 minutes of
presentation + 10 minutes of Q&A**, two ten-minute breaks, and a five-minute closing.
The current deck contains 60 slides, including the opening and session Q&As.

Session 3 uses the same experience records throughout portfolio, resume, and
interview preparation. Its presentation time is divided as follows:

| Slides | Topic | Minutes |
| --- | --- | --- |
| 048–050 | 역할의 변화: overlapping responsibilities, problem definition, and execution planning | 10 |
| 051–052 | 포트폴리오: choosing a problem and summarizing problem definition, execution, and validation evidence | 6 |
| 053–054 | 오픈소스: real requirements, contributing, testing evidence, and the community review loop | 4 |
| 055–057 | 이력서: hiring-side AI, AI-assisted resume drafting and editing, and LaTeX/PDF | 12 |
| 058 | 면접: AI mock interviews with follow-up questions and feedback | 5 |
| 059 | 학습: learning quickly and continuously, trying new approaches, and adapting to change | 3 |
| 060 | Q&A | 10 |

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

Use `step` to determine reveals and honor `instant` so backward navigation and
catch-up restore the correct state. For example, `maxStep: 2` means steps 0, 1, and 2.

When adding or reordering slides, move the matching CSS/import, notes, and asset
references together. Keep numbering contiguous. URLs and saved slide references
use presentation indices, so recheck links after changing the order.

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
to `0.0.0.0` for access from other devices. Local setup creates missing presenter
and question-posting keys in ignored `.dev.vars` and initializes local storage;
existing credentials and saved data are retained. Local development needs no cloud login.

## Presenter and viewer rehearsal

Open `/presenter` with the local `PRESENTER_KEY` for presenter controls, notes,
annotations, and the question list. Open `/` for the audience view. Viewers can read
questions freely; posting requires a name and `COMMENT_PASSWORD`.

Speaker notes require presenter authentication, including a previously saved
presenter-key cookie. Direct note-file URLs are blocked in the local preview.

Use arrow keys or the step buttons to navigate. A link such as `/?index=5&step=0`
opens a specific slide paused; `/` follows a connected presenter. `재생` and `정지`
control following, and `재생` is disabled without a presenter.

**슬라이드 전체 화면** shows just the slide at the largest size that preserves its
16:9 proportions. Use arrow keys to navigate and **Esc** to return to the controls
and open panels. The **⛶** button keeps the usual controls visible in fullscreen.

Use **목차**, **발표 노트**, and **질문** to review the presentation with its panels.
The menu stays open after selection and scrolls manually. Menu and question-panel
visibility, along with unfinished question drafts, survive refresh. Check layouts
with panels both open and closed.

Presenter annotations support pen and inline text. **Cmd+Z / Ctrl+Z** undo the last
visible annotation; text fields keep normal text undo. Enter or clicking away saves
annotation text, Shift+Enter adds a line, and Escape cancels it.

## Hosting

The presentation is hosted at [lecture-presentation.chris-ryu.workers.dev](https://lecture-presentation.chris-ryu.workers.dev/).
Open [/presenter](https://lecture-presentation.chris-ryu.workers.dev/presenter) for presenter controls.
Access keys are stored in ignored `.dev.vars` locally and Cloudflare secrets in
production. Run `npm run deploy` to validate and publish changes when requested.
Local previews use a separate database.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local preview with live updates |
| `node scripts/audit-lecture.mjs` | Check slide IDs, note titles, and file/order connections |
| `npm run typecheck` | Check source and test types |
| `npm run build` | Build the presentation |
| `npx vitest run --config vitest.ui.config.ts` | Run slide and frontend interaction tests |
| `npm test` | Run backend and frontend tests |
| `npm run test:browser:install` | Install Chromium for browser checks |
| `npm run test:browser` | Review every slide/reveal and interactions on desktop and narrow screens |
| `npm run test:browser:report` | Open the last browser report and screenshots |
| `npm run verify` | Generate types, type-check, test, build, and check deployment packaging without publishing |

Choose checks appropriate to the change. Copy and source updates need content and
visual review; component/reveal changes also need type checks and relevant tests.
Shared behavior changes warrant broader checks. Ordinary copy edits do not need new
tests. Browser checks run separately from `verify` and use port 4173, which must be
free; they keep their cache separate from the working preview.

Keep credentials, local data, test reports, and generated output out of Git.
Deployment is a separate task and requires an explicit request.

## License

Original project source and documentation are available under the [MIT License](LICENSE).
Third-party icons, logos, screenshots, and reference materials retain their respective
licenses and credits, recorded in `public/shared/` and the slide asset folders.
