(function () {
  "use strict";

  const STORAGE_KEY = "investingFoundations.progress.v2";
  const OLD_KEY = "investingFoundations.progress.v1";
  const main = document.getElementById("main");
  const announcer = document.getElementById("announcer");
  const lessons = window.IF_LESSONS || [];
  const course = window.IF_COURSE;
  const baseGlossary = window.IF_GLOSSARY || [];
  const readingRoom = window.IF_READING_ROOM || {books:[],interludes:{}};

  const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);
  const emptyLesson = () => ({completedSections: [], lastSection: 0, lessonComplete: false, checks: {}, quiz: {attempts:0,best:0,lastScore:null,answers:{},missed:[],cursor:0,draft:{},feedbackShown:false,completeView:false}});
  const defaultState = () => ({version:2,onboardingDone:false,baseline:{},textSize:"regular",voice:{name:"",rate:.92},reading:{opened:[]},lessons:{},updatedAt:new Date().toISOString()});

  function loadState() {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (current?.version === 2) return {...defaultState(), ...current, voice:{...defaultState().voice,...(current.voice||{})}, reading:{...defaultState().reading,...(current.reading||{})}, lessons: current.lessons || {}};
      const old = JSON.parse(localStorage.getItem(OLD_KEY) || "null");
      if (old?.version === 1) {
        const migrated = defaultState();
        migrated.onboardingDone = !!old.onboardingDone;
        migrated.baseline = old.baseline || {};
        migrated.textSize = old.textSize || "regular";
        migrated.lessons["day-2"] = {...emptyLesson(), completedSections:old.completedSections || [], lastSection:old.lastSection || 0, lessonComplete:!!old.lessonComplete, checks:old.practices || {}, quiz:{...emptyLesson().quiz,...(old.quiz || {})}};
        return migrated;
      }
    } catch (error) { console.warn("Saved progress could not be read.", error); }
    return defaultState();
  }
  let state = loadState();
  function progressFor(day) {
    const id = `day-${day}`;
    if (!state.lessons[id]) state.lessons[id] = emptyLesson();
    return state.lessons[id];
  }
  function save(message) {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (message) announce(message);
  }
  function announce(message) { announcer.textContent = ""; setTimeout(() => { announcer.textContent = message; }, 20); }
  function lessonByDay(day) { return lessons.find(item => item.day === Number(day)) || lessons[0]; }
  function glossaryDefinition(term) { return baseGlossary.find(item => item.term.toLowerCase() === String(term).toLowerCase())?.definition || "A course term used in this section."; }
  function allGlossary() {
    const map = new Map(baseGlossary.map(item => [item.term.toLowerCase(), item]));
    lessons.forEach(l => l.sections.forEach(s => (s.definitions || []).forEach(item => {
      const entry = typeof item === "string" ? {term:item, definition:glossaryDefinition(item)} : item;
      map.set(entry.term.toLowerCase(), entry);
    })));
    return [...map.values()].sort((a,b) => a.term.localeCompare(b.term));
  }
  function setScreen(html) { stopSpeech(); main.innerHTML = `<div class="screen-content">${html}</div>`; }
  function lessonPercent(lesson) {
    const p = progressFor(lesson.day);
    return Math.round(((p.completedSections.length + (p.quiz.attempts ? 1 : 0)) / (lesson.sections.length + 1)) * 100);
  }
  function overallPercent() { return Math.round(lessons.reduce((sum,l) => sum + lessonPercent(l),0) / lessons.length); }
  function completedLessons() { return lessons.filter(l => progressFor(l.day).quiz.attempts > 0).length; }

  function renderWelcome() {
    setScreen(`<section class="course-welcome" aria-labelledby="welcome-title"><div class="page course-welcome-grid"><div class="course-welcome-copy">
      <p class="course-label">INVESTING FOUNDATIONS · 14-LESSON COURSE</p><h1 id="welcome-title">Learn the language before risking the money.</h1>
      <p class="lead">A complete introductory course for adults: goals, companies, stocks, bonds, funds, risk, fees, brokerage basics, research, and fraud protection.</p>
      <div class="hero-actions"><a class="button bright" href="${state.onboardingDone ? "#dashboard" : "#check"}">${state.onboardingDone ? "Continue the course" : "Take the 2-minute readiness check"} →</a><a class="button ghost" href="#dashboard">View all 14 lessons</a></div>
      <ul class="course-assurances"><li>No money or account required</li><li>Voice is optional and never autoplayed</li><li>Education—not individualized advice</li></ul>
    </div><aside class="syllabus-card"><div class="syllabus-card-top"><span>IF 100</span><span>Tester edition</span></div><p class="course-label">YOUR COURSE</p><h2>${completedLessons()} of 14 lessons assessed</h2><p>Short sections, visible key terms, worked examples, checks, and readable final assessments.</p><div class="syllabus-progress"><span style="width:${overallPercent()}%"></span></div><p><strong>${overallPercent()}% complete</strong> · progress stays on this device</p></aside></div>
      <div class="page course-method"><div><span>1</span><strong>Learn</strong><small>Plain-language instruction</small></div><div><span>2</span><strong>Listen or read</strong><small>Use the format that helps</small></div><div><span>3</span><strong>Apply</strong><small>Examples and assessments</small></div></div></section>`);
  }

  function renderBaseline(error = "") {
    setScreen(`<section class="page narrow"><p class="breadcrumbs"><a href="#welcome">Home</a> / Readiness check</p><div class="page-header"><p class="eyebrow">ABOUT 2 MINUTES · NOT GRADED</p><h1>Notice where you are starting.</h1><p class="lead">Best guesses are welcome. Answers stay on this device.</p></div>${error ? `<p class="feedback incorrect" role="alert">${escapeHTML(error)}</p>` : ""}<form id="baseline-form" class="baseline-form card">${course.baseline.map((item,i) => `<fieldset><legend>${i+1}. ${escapeHTML(item.prompt)}</legend><p class="microcopy">${escapeHTML(item.help)}</p><div class="option-list">${item.options.map((option,j) => `<label class="option"><input type="radio" name="${item.id}" value="${j}" ${state.baseline[item.id]===j?"checked":""}><span>${escapeHTML(option)}</span></label>`).join("")}</div></fieldset>`).join("")}<div class="actions"><button class="button" type="submit">Save and view course</button><a href="#dashboard">Skip for now</a></div></form></section>`);
    document.getElementById("baseline-form").addEventListener("submit", e => { e.preventDefault(); const data=new FormData(e.currentTarget); if(course.baseline.some(i=>data.get(i.id)===null)){renderBaseline("Please choose one answer for each question, or skip for now.");return;} course.baseline.forEach(i=>state.baseline[i.id]=Number(data.get(i.id)));state.onboardingDone=true;save("Readiness check saved.");location.hash="#dashboard"; });
  }

  function renderDashboard() {
    setScreen(`<section class="page"><div class="page-header"><p class="course-label">INVESTING FOUNDATIONS · COURSE HOME</p><h1>Fourteen lessons. One connected foundation.</h1><p class="lead">Work in order or open the lesson you need. Each assessment can be retaken without penalty.</p></div>
      <div class="dashboard-progress card"><div><strong>${completedLessons()} / 14</strong><span>lessons assessed</span></div><div class="syllabus-progress"><span style="width:${overallPercent()}%"></span></div><strong>${overallPercent()}% overall</strong></div>
      <a class="reading-promo" href="#reading"><div><p class="course-label">NEW · COURSE COMPANION</p><h2>The Long View Reading Room</h2><p>Ten substantial book guides, balanced buying advice, and a calm reading cooldown after every lesson.</p></div><span>Enter the reading room →</span></a>
      <div class="lesson-grid">${lessons.map(l => {const p=progressFor(l.day); const resume=Math.min(p.lastSection,l.sections.length-1); const href=p.quiz.attempts?`#lesson/${l.day}/0`:p.lessonComplete?`#cooldown/${l.day}`:`#lesson/${l.day}/${resume}`; return `<article class="course-day ${p.quiz.attempts?"complete":""}"><div class="day-number">${String(l.day).padStart(2,"0")}</div><div><p class="course-label">${escapeHTML(l.courseCode)} · ${l.totalMinutes} MIN</p><h2>${escapeHTML(l.title)}</h2><p>${l.sections.length} sections · reading cooldown · ${l.quiz.length}-question assessment</p><div class="syllabus-progress"><span style="width:${lessonPercent(l)}%"></span></div><a class="button ${p.completedSections.length?"secondary":""}" href="${href}">${p.quiz.attempts?"Review lesson":p.lessonComplete?"Open reading cooldown":p.completedSections.length?"Continue lesson":"Begin lesson"} →</a></div></article>`;}).join("")}</div></section>`);
  }

  function keyTermsMarkup(section) {
    const terms = section.definitions || [];
    return `<section class="definition-panel" aria-labelledby="key-terms-title"><p class="course-label">KEY WORDS FOR THIS SECTION</p><h2 id="key-terms-title">Know these terms</h2><dl>${terms.map(item => {const entry=typeof item==="string"?{term:item,definition:glossaryDefinition(item)}:item;return `<div><dt>${escapeHTML(entry.term)}</dt><dd>${escapeHTML(entry.definition)}</dd></div>`;}).join("")}</dl></section>`;
  }
  function checkMarkup(check, saved) {
    if (!check) return "";
    return `<section class="practice-panel"><p class="course-label">QUICK KNOWLEDGE CHECK</p><h2>${escapeHTML(check.prompt)}</h2><form id="section-check"><div class="option-list">${check.options.map((o,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" ${saved?.choice===i?"checked":""}><span>${escapeHTML(o.text)}</span></label>`).join("")}</div><button class="button secondary" type="submit">Check answer</button>${saved?`<p class="feedback ${saved.correct?"correct":"incorrect"}" role="status">${escapeHTML(check.options[saved.choice].feedback)}</p>`:""}</form></section>`;
  }
  function renderLesson(day, index) {
    const l=lessonByDay(day); const p=progressFor(l.day); const i=Math.max(0,Math.min(Number(index)||0,l.sections.length-1)); const s=l.sections[i]; p.lastSection=i; save();
    setScreen(`<section class="lesson-stage"><div class="page"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Lesson ${l.day} / Section ${i+1}</p>
      <div class="lesson-topline"><div><p class="course-label">${escapeHTML(l.courseCode)} · ${i+1} OF ${l.sections.length}</p><h1>${escapeHTML(s.title)}</h1><p class="lead"><strong>Learning outcome:</strong> ${escapeHTML(s.outcome)}</p></div><div class="quiz-counter"><strong>${s.minutes}</strong><span>minutes</span></div></div>
      <div class="quiz-progress"><span style="width:${((i+1)/l.sections.length)*100}%"></span></div>
      <section class="voice-studio" aria-labelledby="voice-studio-title"><div class="voice-studio-head"><div><p class="course-label">OPTIONAL AUDIO</p><h2 id="voice-studio-title">Listen in a voice you prefer</h2></div><button class="button secondary listen-button" id="listen-section" data-idle-label="▶ Listen to this section" type="button">▶ Listen to this section</button></div><div class="voice-controls"><label>Voice<select id="voice-select"><option value="">Best available voice</option></select></label><label>Speed<select id="voice-rate"><option value="0.82">Slower</option><option value="0.92">Natural</option><option value="1">Standard</option><option value="1.1">Faster</option></select></label></div><p class="microcopy" id="voice-note">Uses voices already on this phone or computer. No account, upload, API key, or billing.</p></section>
      ${l.day===2&&i===3?`<section class="audio-card"><div><p class="course-label">STUDIO NARRATION · OPTIONAL</p><h2>What one share represents</h2><p>A short polished introduction. The full section is always readable below.</p></div><audio controls preload="metadata" src="audio/shares-intro.wav">Your browser does not support audio.</audio></section>`:""}
      <article class="lesson-reading"><p class="course-label">CORE READING</p>${s.body.map(paragraph=>`<p>${escapeHTML(paragraph)}</p>`).join("")}</article>
      <aside class="key-idea"><p class="course-label">KEY IDEA</p><p>${escapeHTML(s.keyIdea)}</p></aside>
      <section class="worked-example"><p class="course-label">WORKED EXAMPLE</p><h2>${escapeHTML(s.workedExample?.title)}</h2><p>${escapeHTML(s.workedExample?.body)}</p></section>
      ${keyTermsMarkup(s)}${checkMarkup(s.check,p.checks[s.id])}
      <section class="section-summary"><p class="course-label">SECTION SUMMARY</p><p>${escapeHTML(s.summary)}</p></section>
      <nav class="lesson-pagination" aria-label="Lesson sections">${i>0?`<a class="button ghost" href="#lesson/${l.day}/${i-1}">← Previous</a>`:`<a href="#dashboard">Course home</a>`}<button class="button bright" id="section-continue" type="button">${i===l.sections.length-1?"Finish lesson · enter cooldown":"Save and continue →"}</button></nav>
    </div></section>`);
    document.getElementById("listen-section").addEventListener("click",()=>toggleSpeech(s));
    populateVoiceControls();
    const form=document.getElementById("section-check"); if(form) form.addEventListener("submit",e=>{e.preventDefault();const choice=Number(new FormData(e.currentTarget).get("answer"));if(!Number.isInteger(choice)){announce("Choose an answer first.");return;}p.checks[s.id]={choice,correct:!!s.check.options[choice]?.correct};save("Knowledge check saved.");renderLesson(l.day,i);});
    document.getElementById("section-continue").addEventListener("click",()=>{if(!p.completedSections.includes(i))p.completedSections.push(i);p.completedSections.sort((a,b)=>a-b);if(i===l.sections.length-1){p.lessonComplete=true;save("Lesson complete. Reading cooldown ready.");location.hash=`#cooldown/${l.day}`;}else{p.lastSection=i+1;save(`Section ${i+1} complete.`);location.hash=`#lesson/${l.day}/${i+1}`;}});
  }

  function speechText(section) { return [section.title,`Learning outcome: ${section.outcome}`,...section.body,`Key idea: ${section.keyIdea}`,`Worked example: ${section.workedExample?.title}. ${section.workedExample?.body}`,`Summary: ${section.summary}`].join(" "); }
  let speaking=false;
  function stopSpeech(){ if("speechSynthesis" in window){window.speechSynthesis.cancel();speaking=false;} }
  function voiceScore(voice){const name=`${voice.name} ${voice.voiceURI}`;let score=voice.default?25:0;if(/natural|neural|premium|enhanced|siri/i.test(name))score+=100;if(/aria|jenny|ava|samantha|serena|zira|google us english/i.test(name))score+=60;if(/^en[-_]/i.test(voice.lang))score+=20;if(/compact|espeak/i.test(name))score-=50;return score;}
  function availableEnglishVoices(){if(!("speechSynthesis" in window))return[];return window.speechSynthesis.getVoices().filter(v=>/^en([_-]|$)/i.test(v.lang)).sort((a,b)=>voiceScore(b)-voiceScore(a)||a.name.localeCompare(b.name));}
  function populateVoiceControls(){const select=document.getElementById("voice-select"),rate=document.getElementById("voice-rate"),note=document.getElementById("voice-note");if(!select||!rate)return;rate.value=String(state.voice.rate||.92);if(!("speechSynthesis" in window)){select.disabled=true;rate.disabled=true;note.textContent="Built-in narration is not available in this browser. All lesson text remains readable.";return;}const fill=()=>{const voices=availableEnglishVoices();select.innerHTML=`<option value="">Best available voice${voices[0]?` — ${escapeHTML(voices[0].name)}`:""}</option>`+voices.map(v=>`<option value="${escapeHTML(v.voiceURI)}">${escapeHTML(v.name)} · ${escapeHTML(v.lang)}</option>`).join("");select.value=voices.some(v=>v.voiceURI===state.voice.name)?state.voice.name:"";};fill();window.speechSynthesis.onvoiceschanged=fill;select.addEventListener("change",()=>{state.voice.name=select.value;save("Preferred voice saved on this device.");});rate.addEventListener("change",()=>{state.voice.rate=Number(rate.value)||.92;save("Narration speed saved on this device.");});}
  function toggleSpeech(section){const button=document.getElementById("listen-section"),idle=button?.dataset.idleLabel||"▶ Listen to this section";if(!("speechSynthesis" in window)){announce("Built-in voice is not available in this browser.");return;}if(speaking){stopSpeech();button.textContent=idle;return;}const utterance=new SpeechSynthesisUtterance(speechText(section));const voices=availableEnglishVoices();utterance.voice=voices.find(v=>v.voiceURI===state.voice.name)||voices[0]||null;utterance.rate=Number(state.voice.rate)||.92;utterance.pitch=1;utterance.onend=()=>{speaking=false;const current=document.getElementById("listen-section");if(current)current.textContent=current.dataset.idleLabel||"▶ Listen to this section";};utterance.onerror=utterance.onend;speaking=true;button.textContent="■ Stop listening";window.speechSynthesis.speak(utterance);}

  function renderQuiz(day,error="") {
    const l=lessonByDay(day), p=progressFor(l.day), q=p.quiz, quiz=l.quiz;
    if(q.completeView&&q.lastScore!==null){setScreen(`<section class="mastery-results"><div class="page narrow"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Lesson ${l.day} assessment</p><div class="page-header"><p class="course-label">ASSESSMENT COMPLETE</p><h1>${escapeHTML(l.title)}</h1></div><section class="score-card"><p class="eyebrow">MOST RECENT RESULT</p><p class="score-number">${q.lastScore}/${quiz.length}</p><p>${q.lastScore===quiz.length?"Excellent. Every answer was correct on this attempt.":"Review the explanations below, then retake whenever you are ready."}</p><p><strong>Best:</strong> ${q.best}/${quiz.length} across ${q.attempts} attempt${q.attempts===1?"":"s"}</p><div class="actions"><button class="button" id="retake" type="button">Retake assessment</button><a href="#dashboard">Course home</a></div></section><div class="result-breakdown">${quiz.map((item,i)=>{const o=item.options[q.answers[item.id]];return `<article class="${o?.correct?"correct":"missed"}"><span>${o?.correct?"✓":"↻"}</span><div><small>QUESTION ${i+1}</small><h2>${escapeHTML(item.prompt)}</h2><p>${escapeHTML(o?.feedback||"No answer saved.")}</p></div></article>`;}).join("")}</div></div></section>`);document.getElementById("retake").addEventListener("click",()=>{Object.assign(q,{cursor:0,draft:{},feedbackShown:false,completeView:false});save();renderQuiz(l.day);});return;}
    const cursor=Math.max(0,Math.min(Number(q.cursor)||0,quiz.length-1)), item=quiz[cursor], choice=q.draft[item.id], option=Number.isInteger(choice)?item.options[choice]:null;
    setScreen(`<section class="quiz-arena"><div class="page narrow"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Lesson ${l.day} assessment</p><div class="quiz-arena-head"><div><p class="eyebrow light">READABLE ASSESSMENT · UNLIMITED RETAKES</p><h1>${escapeHTML(l.title)}</h1></div><div class="quiz-counter"><strong>${cursor+1}</strong><span>of ${quiz.length}</span></div></div><div class="quiz-progress"><span style="width:${((cursor+(q.feedbackShown?1:0))/quiz.length)*100}%"></span></div>${error?`<p class="feedback incorrect" role="alert">${escapeHTML(error)}</p>`:""}<form id="quiz-form" class="quiz-one"><fieldset class="quiz-question"><legend><span class="game-label">QUESTION ${cursor+1}</span>${escapeHTML(item.prompt)}</legend><div class="option-list">${item.options.map((o,i)=>`<label class="option game-option"><input type="radio" name="answer" value="${i}" ${choice===i?"checked":""} ${q.feedbackShown?"disabled":""}><span class="choice-key">${String.fromCharCode(65+i)}</span><span>${escapeHTML(o.text)}</span></label>`).join("")}</div>${q.feedbackShown&&option?`<div class="quiz-feedback"><p class="feedback ${option.correct?"correct":"incorrect"}">${escapeHTML(option.feedback)}</p></div>`:""}</fieldset><div class="quiz-actions"><span></span><button class="button bright" type="submit">${q.feedbackShown?(cursor===quiz.length-1?"See results":"Next question →"):"Check my answer"}</button></div></form></div></section>`);
    document.getElementById("quiz-form").addEventListener("submit",e=>{e.preventDefault();if(!q.feedbackShown){const value=new FormData(e.currentTarget).get("answer");if(value===null){renderQuiz(l.day,"Choose one answer. Best guesses are welcome.");return;}q.draft[item.id]=Number(value);q.feedbackShown=true;save();renderQuiz(l.day);return;}if(cursor<quiz.length-1){q.cursor=cursor+1;q.feedbackShown=false;save();renderQuiz(l.day);return;}let score=0;const missed=[];quiz.forEach(x=>{const picked=q.draft[x.id];if(x.options[picked]?.correct)score++;else missed.push(x.concept);});Object.assign(q,{attempts:q.attempts+1,lastScore:score,best:Math.max(q.best,score),answers:{...q.draft},missed:[...new Set(missed)],cursor:0,draft:{},feedbackShown:false,completeView:true});p.lessonComplete=true;save(`Assessment scored ${score} out of ${quiz.length}.`);renderQuiz(l.day);});
  }

  function bookBySlug(slug) { return readingRoom.books.find(book => book.slug === slug); }
  function bookForDay(day) { return readingRoom.books.find(book => book.lessonDay === Number(day)); }
  function bookSpeechSection(book) {
    return {title:`${book.title}, by ${book.author}`, outcome:book.bigIdea, body:[...book.overview,...book.principles.map(item=>`${item.title}. ${item.text}`),`What the book does well. ${book.strengths}`,`Important limitations. ${book.limitations}`,`Who should read it. ${book.who}`,`Reflection question. ${book.reflection}`], keyIdea:book.bigIdea, workedExample:{title:"Reading reflection",body:book.reflection}, summary:`This guide is an original overview. The full book offers the author's complete evidence, examples, and argument.`};
  }

  function renderCooldown(day) {
    const l=lessonByDay(day), book=bookForDay(l.day), lab=readingRoom.interludes[l.day];
    if (book) {
      setScreen(`<section class="cooldown-page"><div class="page narrow"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Lesson ${l.day} / Reading cooldown</p><div class="cooldown-orbit" aria-hidden="true"><span></span><span></span><span></span></div><p class="course-label">LESSON COMPLETE · READING COOLDOWN</p><h1>Let the lesson settle.</h1><p class="lead">Before the assessment, meet a book that extends today’s ideas. Reading the full guide is optional; there is no timer and no grade.</p>
        <article class="cooldown-book" style="--book-accent:${book.accent}"><div class="book-spine"><small>FEATURED AFTER LESSON ${l.day}</small><strong>${escapeHTML(book.title)}</strong><span>${escapeHTML(book.author)}</span></div><div><p class="course-label">${book.minutes}-MINUTE GUIDE · ${escapeHTML(book.category).toUpperCase()}</p><h2>${escapeHTML(book.title)}</h2><p class="book-author">${escapeHTML(book.author)} · ${book.year}</p><p class="cooldown-big-idea">${escapeHTML(book.bigIdea)}</p><div class="cooldown-principles">${book.principles.slice(0,3).map(item=>`<span>${escapeHTML(item.title)}</span>`).join("")}</div></div></article>
        <div class="cooldown-actions"><a class="button bright" href="#book/${book.slug}">Read the full guide</a><a class="button secondary" href="#quiz/${l.day}">Continue to assessment →</a><a href="#reading">Browse the whole Reading Room</a></div></div></section>`);
    } else if (lab) {
      setScreen(`<section class="cooldown-page reading-lab-page"><div class="page narrow"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Lesson ${l.day} / Reading cooldown</p><div class="cooldown-orbit" aria-hidden="true"><span></span><span></span><span></span></div><p class="course-label">${escapeHTML(lab.kicker)}</p><h1>${escapeHTML(lab.title)}</h1><p class="lead">${escapeHTML(lab.body)}</p><ol class="reading-lab-steps">${lab.steps.map((step,index)=>`<li><span>${index+1}</span><p>${escapeHTML(step)}</p></li>`).join("")}</ol><aside class="reading-reflection"><p class="course-label">PAUSE AND CONSIDER</p><p>${escapeHTML(lab.prompt)}</p></aside><div class="cooldown-actions"><a class="button bright" href="#reading">Open the Reading Room</a><a class="button secondary" href="#quiz/${l.day}">Continue to assessment →</a></div></div></section>`);
    } else location.hash=`#quiz/${l.day}`;
  }

  function renderReading() {
    const opened=new Set(state.reading.opened||[]);
    setScreen(`<section class="reading-room-page"><div class="reading-room-hero"><div class="page"><p class="course-label">INVESTING FOUNDATIONS · PERMANENT LIBRARY</p><h1>${escapeHTML(readingRoom.title)}</h1><p class="lead">${escapeHTML(readingRoom.subtitle)}</p><div class="reading-room-stats"><span><strong>${readingRoom.books.length}</strong> original guides</span><span><strong>≈ ${readingRoom.books.reduce((sum,b)=>sum+b.minutes,0)}</strong> minutes of reading</span><span><strong>${opened.size}</strong> explored on this device</span></div></div></div><div class="page">
      <section class="reading-room-note"><div><p class="course-label">A GUIDE, NOT A SUBSTITUTE</p><h2>Understand the argument before buying the book.</h2></div><p>Each guide explains the central thesis, useful principles, strengths, limitations, and ideal reader. Full books contain the author’s complete evidence and examples. No book PDFs are hosted here.</p></section>
      <label class="reading-search" for="reading-search"><span>Find a book, author, or idea</span><input id="reading-search" type="search" placeholder="Try risk, behavior, Ray Dalio, or companies"></label><p class="microcopy" id="reading-count">${readingRoom.books.length} guides</p>
      <div class="book-grid">${readingRoom.books.map((book,index)=>`<article class="book-card" data-book-card data-search="${escapeHTML(`${book.title} ${book.author} ${book.category} ${book.bigIdea}`.toLowerCase())}" style="--book-accent:${book.accent}"><div class="book-card-number">${String(index+1).padStart(2,"0")}</div><div class="book-card-cover"><small>${escapeHTML(book.category)}</small><strong>${escapeHTML(book.title)}</strong><span>${escapeHTML(book.author)}</span></div><div class="book-card-copy"><p class="course-label">${book.minutes}-MIN GUIDE · ${book.year}${opened.has(book.slug)?" · EXPLORED":""}</p><h2>${escapeHTML(book.title)}</h2><p class="book-author">${escapeHTML(book.author)}</p><p>${escapeHTML(book.bigIdea)}</p><div class="book-card-tags">${book.principles.slice(0,3).map(item=>`<span>${escapeHTML(item.title)}</span>`).join("")}</div><a class="button secondary" href="#book/${book.slug}">Open reading guide →</a></div></article>`).join("")}</div>
      <section class="reading-room-footer"><h2>How to use this room</h2><div><p><strong>Choose by question.</strong> Start with the problem you need to understand, not the most famous title.</p><p><strong>Read critically.</strong> Every guide includes limitations because influence is not the same as certainty.</p><p><strong>Borrow before buying.</strong> Check your library or an authorized sample when you are unsure.</p></div></section></div></section>`);
    document.getElementById("reading-search").addEventListener("input",event=>{const q=event.target.value.trim().toLowerCase();let visible=0;document.querySelectorAll("[data-book-card]").forEach(card=>{card.hidden=q&&!card.dataset.search.includes(q);if(!card.hidden)visible++;});document.getElementById("reading-count").textContent=`${visible} guide${visible===1?"":"s"}`;});
  }

  function renderBook(slug) {
    const book=bookBySlug(slug); if(!book){location.hash="#reading";return;}
    if(!state.reading.opened.includes(book.slug)){state.reading.opened.push(book.slug);save("Reading guide saved to your explored shelf.");}
    setScreen(`<article class="book-guide-page" style="--book-accent:${book.accent}"><div class="book-guide-hero"><div class="page book-guide-hero-grid"><div><p class="breadcrumbs"><a href="#reading">Reading Room</a> / ${escapeHTML(book.title)}</p><p class="course-label">${book.minutes}-MINUTE ORIGINAL GUIDE · FEATURED AFTER LESSON ${book.lessonDay}</p><h1>${escapeHTML(book.title)}</h1><p class="book-guide-subtitle">${escapeHTML(book.subtitle)}</p><p class="book-guide-byline">By ${escapeHTML(book.author)} · ${book.year}</p><div class="hero-actions"><a class="button bright" href="#cooldown/${book.lessonDay}">Lesson ${book.lessonDay} cooldown</a><a class="button ghost" href="#reading">All books</a></div></div><div class="guide-cover" aria-hidden="true"><small>THE LONG VIEW</small><strong>${escapeHTML(book.title)}</strong><span>${escapeHTML(book.author)}</span></div></div></div><div class="page narrow book-guide-body">
      <section class="voice-studio"><div class="voice-studio-head"><div><p class="course-label">OPTIONAL AUDIO</p><h2>Listen to this reading guide</h2></div><button class="button secondary listen-button" id="listen-section" data-idle-label="▶ Listen to this guide" type="button">▶ Listen to this guide</button></div><div class="voice-controls"><label>Voice<select id="voice-select"><option value="">Best available voice</option></select></label><label>Speed<select id="voice-rate"><option value="0.82">Slower</option><option value="0.92">Natural</option><option value="1">Standard</option><option value="1.1">Faster</option></select></label></div><p class="microcopy" id="voice-note">Uses voices already on this phone or computer. No account, API key, or billing.</p></section>
      <aside class="guide-big-idea"><p class="course-label">THE CENTRAL ARGUMENT</p><p>${escapeHTML(book.bigIdea)}</p></aside><section class="guide-overview"><p class="course-label">HIGH-LEVEL SYNOPSIS</p><h2>What the book is saying</h2>${book.overview.map(p=>`<p>${escapeHTML(p)}</p>`).join("")}</section>
      <section class="guide-principles"><p class="course-label">MAJOR PRINCIPLES</p><h2>Ideas to carry forward</h2>${book.principles.map((item,index)=>`<article><span>${index+1}</span><div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.text)}</p></div></article>`).join("")}</section>
      <div class="guide-evaluation"><section><p class="course-label">WHAT IT DOES WELL</p><p>${escapeHTML(book.strengths)}</p></section><section><p class="course-label">READ WITH THIS CAUTION</p><p>${escapeHTML(book.limitations)}</p></section></div>
      <section class="guide-reader-fit"><div><p class="course-label">WHO SHOULD READ IT?</p><h2>Is this book for you?</h2><p>${escapeHTML(book.who)}</p></div><aside><p class="course-label">REFLECTION QUESTION</p><p>${escapeHTML(book.reflection)}</p></aside></section>
      <section class="guide-buy"><div><p class="course-label">READY FOR THE FULL ARGUMENT?</p><h2>Buy, borrow, or preview an authorized edition.</h2><p>This guide is original commentary, not a replacement for the book. The publisher page includes current format and retailer options.</p></div><a class="button bright" href="${book.sourceUrl}" target="_blank" rel="noopener noreferrer">Visit official book page ↗</a></section>
      <nav class="guide-nav"><a href="#reading">← Return to the Reading Room</a><a href="#quiz/${book.lessonDay}">Continue to Lesson ${book.lessonDay} assessment →</a></nav></div></article>`);
    document.getElementById("listen-section").addEventListener("click",()=>toggleSpeech(bookSpeechSection(book)));populateVoiceControls();
  }

  function renderGlossary(query="") {const all=allGlossary(),filtered=all.filter(x=>(x.term+" "+x.definition).toLowerCase().includes(query.toLowerCase()));setScreen(`<section class="page"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Glossary</p><div class="page-header"><p class="eyebrow">PLAIN-LANGUAGE REFERENCE</p><h1>Course glossary</h1><p class="lead">Key words from every lesson, collected in one place.</p></div><label for="term-search"><strong>Find a term</strong></label><input class="term-search" id="term-search" type="search" value="${escapeHTML(query)}" placeholder="Try diversification or bond"><p class="microcopy">${filtered.length} terms</p><div class="glossary-list">${filtered.map(x=>`<article><h2>${escapeHTML(x.term)}</h2><p>${escapeHTML(x.definition)}</p></article>`).join("")}</div></section>`);document.getElementById("term-search").addEventListener("input",e=>renderGlossary(e.target.value));}
  function renderSources(){const sources=[
    ["Introduction to Investing — Investor.gov","https://www.investor.gov/introduction-investing","Goals, saving, investing, compound growth, risk, allocation, and diversification."],
    ["Stocks — Investor.gov","https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks","Ownership, shareholder rights, reasons companies issue stock, and stock risk."],
    ["Bonds — Investor.gov","https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds","Bond terms and major risks."],
    ["Mutual Funds — Investor.gov","https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds-etfs/mutual-funds","Pooled investing, pricing, diversification, and fees."],
    ["Asset Allocation and Diversification — Investor.gov","https://www.investor.gov/introduction-investing/getting-started/asset-allocation","Time horizon, risk tolerance, asset allocation, diversification, and fund overlap."],
    ["Types of Orders — Investor.gov","https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders","Market and limit order basics."],
    ["How Fees and Expenses Affect Your Portfolio — Investor.gov","https://www.investor.gov/introduction-investing/getting-started/understanding-fees","How investment costs reduce returns."],
    ["Protect Your Money — Investor.gov","https://www.investor.gov/protect-your-investments/fraud/protect-your-money","Fraud red flags, independent checks, and reporting."],
    ["Emergency Fund Guide — CFPB","https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/","Accessible savings for financial shocks."],
    ["BrokerCheck — FINRA","https://brokercheck.finra.org/","Official broker and brokerage-firm research tool."]
  ];setScreen(`<section class="page"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Sources</p><div class="page-header"><p class="eyebrow">PRIMARY EDUCATIONAL SOURCES</p><h1>Sources and disclosures</h1><p class="lead">Original course writing checked against official investor-education sources.</p></div><div class="notice"><strong>Education, not advice.</strong> The course does not recommend a security, fund, account, broker, or portfolio. Investing involves risk, including possible loss of money.</div><div class="source-grid">${sources.map(s=>`<article class="card source-card"><h2><a href="${s[1]}" target="_blank" rel="noopener">${s[0]} ↗</a></h2><p>${s[2]}</p><span class="verified">Official source · checked July 10, 2026</span></article>`).join("")}</div></section>`);}
  function renderPrivacy(){setScreen(`<section class="page narrow"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Privacy</p><div class="page-header"><p class="eyebrow">DEVICE-ONLY PROGRESS</p><h1>Your learning stays in this browser.</h1></div><div class="card"><h2>Saved here</h2><p>Readiness answers, section completion, checks, assessment attempts, explored reading guides, voice preference, and text size are stored in this browser's local storage.</p><h2>Not collected</h2><p>No account, name, email, analytics, advertising tracker, cloud database, or third-party progress service is used.</p><h2>Voice privacy</h2><p>Standard section and reading-guide narration uses the device's built-in speech feature. The optional studio clip is a static course file. No learner text is sent to a paid voice service.</p></div></section>`);}

  function route(){const parts=(location.hash||"#welcome").slice(1).split("/");closeMenu();switch(parts[0]){case"welcome":renderWelcome();break;case"check":renderBaseline();break;case"dashboard":renderDashboard();break;case"lesson":renderLesson(parts[1]||1,parts[2]||0);break;case"cooldown":renderCooldown(parts[1]||1);break;case"quiz":renderQuiz(parts[1]||1);break;case"reading":renderReading();break;case"book":renderBook(parts[1]);break;case"glossary":renderGlossary();break;case"sources":renderSources();break;case"privacy":renderPrivacy();break;default:location.hash="#welcome";return;}const routeDay=parts[0]==="book"?(bookBySlug(parts[1])?.lessonDay||1):(["lesson","cooldown","quiz"].includes(parts[0])?(parts[1]||1):1);document.querySelector(".mobile-tabbar a:nth-child(2)")?.setAttribute("href",`#lesson/${routeDay}/0`);main.focus({preventScroll:true});window.scrollTo(0,0);}

  const menuButton=document.getElementById("menu-button"),moreMenu=document.getElementById("more-menu");
  function closeMenu(){moreMenu.hidden=true;menuButton.setAttribute("aria-expanded","false");}
  menuButton.addEventListener("click",e=>{e.stopPropagation();const open=moreMenu.hidden;moreMenu.hidden=!open;menuButton.setAttribute("aria-expanded",String(open));});document.addEventListener("click",e=>{if(!moreMenu.contains(e.target)&&e.target!==menuButton)closeMenu();});
  const textButton=document.getElementById("text-size");function applyText(){document.body.dataset.textSize=state.textSize;const labels={regular:"Regular",large:"Large",larger:"Larger"};textButton.querySelector("span").textContent=labels[state.textSize]||"Regular";}textButton.addEventListener("click",()=>{state.textSize=state.textSize==="regular"?"large":state.textSize==="large"?"larger":"regular";applyText();save(`Text size: ${state.textSize}.`);});
  const dialog=document.getElementById("reset-dialog");document.getElementById("reset-open").addEventListener("click",()=>{closeMenu();dialog.showModal();});document.getElementById("reset-confirm").addEventListener("click",()=>{localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(OLD_KEY);state=defaultState();applyText();location.hash="#welcome";route();});document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMenu();stopSpeech();}});
  const offline=document.getElementById("offline-status");const online=()=>offline.hidden=navigator.onLine;window.addEventListener("online",online);window.addEventListener("offline",online);window.addEventListener("hashchange",route);applyText();online();route();
  if("serviceWorker" in navigator&&location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(error=>console.warn("Offline setup unavailable.",error)));
})();
