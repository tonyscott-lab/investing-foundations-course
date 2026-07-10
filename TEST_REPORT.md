# Tester release verification

Verified July 10, 2026 against release `v21`.

## Automated content checks — passed

- 14 lessons load in order
- Every lesson is 20–30 minutes and has at least four sections
- Every lesson has at least three learning objectives
- Every section has substantive core reading
- Every section has at least one visible key word with a definition
- Every section has an outcome, key idea, worked example, and summary
- Every lesson has a five-question or longer assessment
- Every question has exactly one correct answer and feedback for all choices
- Correct answers appear in all three choice positions
- Full lesson data is included in the offline cache
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
