# Investing Foundations — complete tester

A mobile-first, installable, offline-capable introductory course for adult beginners.

**Family Edition:** v1.3

**Live course:** https://tonyscott-lab.github.io/investing-foundations-course/

## Included

- 14 complete lessons, each designed for about 20–30 minutes
- 59 short teaching sections with outcomes, core reading, worked examples, key ideas, key words, and summaries
- 79 assessment questions, presented one at a time with large choices and explanatory feedback
- Free built-in device narration in every section, with voice and speed selection
- One static Google-generated studio narration at the central share-ownership lesson
- A lesson-end reading cooldown followed by each assessment
- The Long View Reading Room with ten honest seven-minute original book guides and four reading labs
- Search, device narration, critical-reading notes, and a neutral “continue with your copy” ending for every guide
- Original concept maps, section roadmaps, reading-progress indicators, practical applications, and questions for continuing into the full books
- A two-level glossary that keeps the formal course definition and adds an expandable everyday-language explanation for every term
- Local-only progress, text sizing, glossary, disclosures, offline support, and home-screen installation

## Run locally

From this folder:

```powershell
python -m http.server 8766 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8766/`.

## Publish and share

Use `GITHUB_PAGES_RELEASE.md`. After publishing, use the exact family handoff in `FAMILY_TEXT_MESSAGE.md`. Access and installation instructions intentionally do not appear inside the learning app.

## Cost and privacy

The shipped course makes no runtime AI or voice API calls. Section narration uses the browser/device speech engine; the polished clip is a static WAV file. No API key is required or included. There is no account system, analytics, advertising, database, or cloud progress service.

## Content boundary

The course is general education, not individualized financial, legal, or tax advice. It does not recommend an investment, fund, account, broker, or portfolio. Core concepts were checked against official SEC/Investor.gov, FINRA, and CFPB educational material; links appear in the app's Sources screen.

Reading Room entries are original educational commentary, not excerpts or replacements for the books. The learner-facing project does not include PDFs, copied chapters, cover art, unofficial downloads, retailer links, publisher links, purchase prompts, affiliate links, or sales relationships.
