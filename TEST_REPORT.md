# Tester release verification

Verified July 10, 2026 against product version `Family Edition v1.3` and technical release `v28`.

## Automated content checks — passed

- 14 lessons load in order
- Every lesson is 20–30 minutes and has at least four sections
- Every lesson has at least three learning objectives
- Every section has substantive core reading
- Every section has at least one visible key word with a definition
- Every glossary term has both a formal definition and a curated everyday-language explanation
- Plain-language explanations use native, keyboard-accessible expandable controls
- Family Edition v1.3 appears in the persistent top navigation
- Every Reading Room book credit uses the title followed by “By, Author”
- Every section has an outcome, key idea, worked example, and summary
- Every lesson has a five-question or longer assessment
- Every question has exactly one correct answer and feedback for all choices
- Correct answers appear in all three choice positions
- Full lesson data is included in the offline cache
- Exactly ten original book guides of at least 1,100 words load with unique routes
- Every guide includes title, author, central argument, four-part overview, at least seven deeper-reading sections, five principles, three applications, three continuation questions, strengths, limitations, reader fit, reflection, and an official publisher-information link
- Every guide is labeled as a seven-minute original guide and is included in the offline cache
- Every guide includes a course-made concept map, section roadmap, and reading-progress indicator
- No guide uses “buy” framing, Amazon prioritization, or affiliate language
- Four non-book lesson days receive structured reading labs
- Every lesson flows through a cooldown before its assessment
- The Reading Room is included in the offline cache
- No local PDF, training-folder path, copied chapter, or unofficial download link is exposed
- No family access/install instructions appear inside the learning app
- No API key is stored in the project

## Live browser checks — passed

- All 14 lessons appear on the course home
- Lesson 1 displays the complete academic section hierarchy
- Phone viewport tested at 390 × 844
- No horizontal overflow at phone size
- Key words and definitions fit at phone size
- Assessment shows one question at a time
- Phone assessment choices measured 85px high
- Correct-answer feedback appeared immediately
- Assessment selection and feedback survived a reload
- Browser console returned no warnings or errors
- Text remains usable with built-in size controls
- Glossary displays 186 formal definitions with 186 matching plain-language explanations
- Searching checks the term, formal definition, and everyday-language explanation without interrupting typing
- Phone glossary controls measured at least 53px high with no horizontal overflow
- Reading Room search filters by title, author, category, and idea
- Reading Room reports 10 seven-minute guides and approximately 70 minutes of original reading
- Desktop concept map displays one central thesis and three connected idea branches
- Phone guide roadmap scrolls horizontally without creating page overflow
- Roadmap buttons move to synopsis, concept map, deeper context, applications, and full-book sections
- Reading progress updates while moving through the guide
- Full-book section contains no Amazon reference, sales prompt, affiliate relationship, PDF, or unofficial download
- Book-guide narration uses the same free device voice controls as the course
- Cooldowns were verified for both featured-book and reading-lab lesson days

## Voice checks

- The listen control is present in every section
- Learners can select any English voice installed on their phone or computer
- The default automatically prefers voices labeled natural, neural, premium, or enhanced
- Narration speed can be changed and is remembered on the device
- Unsupported browsers fail safely with a status announcement
- The static studio WAV exists and is playable through a normal HTML audio control
- No voice request autoplays and no runtime key is required

## Before sending the public link

Perform the short post-deployment checklist in `GITHUB_PAGES_RELEASE.md`, because GitHub Pages caching, phone speech voices, and home-screen installation must be confirmed on the actual public address.
