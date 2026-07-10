# Publish the tester on GitHub Pages

The course is a static website. It needs no paid server, runtime API, database, Google key, or ElevenLabs account.

## Fast browser method

1. Sign in to GitHub and create a new **public** repository, for example `investing-foundations-tester`.
2. Choose **Add file → Upload files**.
3. Open the `investing-foundations` folder on your computer and upload its contents. `index.html` must be at the repository root—not inside another nested folder.
4. Commit the upload.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select branch **main**, folder **/(root)**, then **Save**.
8. Wait a few minutes. GitHub will show a public address similar to `https://YOUR-NAME.github.io/investing-foundations-tester/`.
9. Open that address on a phone and complete the release checklist below.
10. Paste the public address into `FAMILY_TEXT_MESSAGE.md` and send the message.

## Release checklist

- Course home shows all 14 lessons.
- Lesson 1 opens and its **Listen to this section** button speaks.
- Lesson 2, section 4 plays the optional studio narration.
- Key words are visible in every section.
- Finishing a lesson opens its reading cooldown before the assessment.
- The Reading Room shows ten searchable guides and four lesson-day reading labs.
- A book guide displays its title, author, synopsis, principles, limitations, narration control, and publisher link.
- An assessment shows one large question at a time.
- Refreshing the page keeps progress.
- Airplane mode still opens previously visited pages after the first online visit.
- There is no API key in the repository.

## Updating later

Upload the changed files and commit them. The app uses versioned assets and a service worker; this release is version `v23`. For a later release, increase the version in `index.html` and `service-worker.js` so phones do not keep an older cached copy.
