(function () {
  "use strict";

  const STORAGE_KEY = "investingFoundations.progress.v2";
  const OLD_KEY = "investingFoundations.progress.v1";
  const main = document.getElementById("main");
  const announcer = document.getElementById("announcer");
  const lessons = window.IF_LESSONS || [];
  const course = window.IF_COURSE;
  const baseGlossary = window.IF_GLOSSARY || [];

  const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);
  const emptyLesson = () => ({completedSections: [], lastSection: 0, lessonComplete: false, checks: {}, quiz: {attempts:0,best:0,lastScore:null,answers:{},missed:[],cursor:0,draft:{},feedbackShown:false,completeView:false}});
  const defaultState = () => ({version:2,onboardingDone:false,baseline:{},textSize:"regular",voice:{name:"",rate:.92},lessons:{},updatedAt:new Date().toISOString()});

  function loadState() {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (current?.version === 2) return {...defaultState(), ...current, voice:{...defaultState().voice,...(current.voice||{})}, lessons: current.lessons || {}};
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
      <div class="lesson-grid">${lessons.map(l => {const p=progressFor(l.day); const resume=Math.min(p.lastSection,l.sections.length-1); return `<article class="course-day ${p.quiz.attempts?"complete":""}"><div class="day-number">${String(l.day).padStart(2,"0")}</div><div><p class="course-label">${escapeHTML(l.courseCode)} · ${l.totalMinutes} MIN</p><h2>${escapeHTML(l.title)}</h2><p>${l.sections.length} sections · ${l.quiz.length}-question assessment</p><div class="syllabus-progress"><span style="width:${lessonPercent(l)}%"></span></div><a class="button ${p.completedSections.length?"secondary":""}" href="#lesson/${l.day}/${resume}">${p.quiz.attempts?"Review lesson":p.completedSections.length?"Continue lesson":"Begin lesson"} →</a></div></article>`;}).join("")}</div></section>`);
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
      <section class="voice-studio" aria-labelledby="voice-studio-title"><div class="voice-studio-head"><div><p class="course-label">OPTIONAL AUDIO</p><h2 id="voice-studio-title">Listen in a voice you prefer</h2></div><button class="button secondary listen-button" id="listen-section" type="button">▶ Listen to this section</button></div><div class="voice-controls"><label>Voice<select id="voice-select"><option value="">Best available voice</option></select></label><label>Speed<select id="voice-rate"><option value="0.82">Slower</option><option value="0.92">Natural</option><option value="1">Standard</option><option value="1.1">Faster</option></select></label></div><p class="microcopy" id="voice-note">Uses voices already on this phone or computer. No account, upload, API key, or billing.</p></section>
      ${l.day===2&&i===3?`<section class="audio-card"><div><p class="course-label">STUDIO NARRATION · OPTIONAL</p><h2>What one share represents</h2><p>A short polished introduction. The full section is always readable below.</p></div><audio controls preload="metadata" src="audio/shares-intro.wav">Your browser does not support audio.</audio></section>`:""}
      <article class="lesson-reading"><p class="course-label">CORE READING</p>${s.body.map(paragraph=>`<p>${escapeHTML(paragraph)}</p>`).join("")}</article>
      <aside class="key-idea"><p class="course-label">KEY IDEA</p><p>${escapeHTML(s.keyIdea)}</p></aside>
      <section class="worked-example"><p class="course-label">WORKED EXAMPLE</p><h2>${escapeHTML(s.workedExample?.title)}</h2><p>${escapeHTML(s.workedExample?.body)}</p></section>
      ${keyTermsMarkup(s)}${checkMarkup(s.check,p.checks[s.id])}
      <section class="section-summary"><p class="course-label">SECTION SUMMARY</p><p>${escapeHTML(s.summary)}</p></section>
      <nav class="lesson-pagination" aria-label="Lesson sections">${i>0?`<a class="button ghost" href="#lesson/${l.day}/${i-1}">← Previous</a>`:`<a href="#dashboard">Course home</a>`}<button class="button bright" id="section-continue" type="button">${i===l.sections.length-1?"Finish lesson and assess":"Save and continue →"}</button></nav>
    </div></section>`);
    document.getElementById("listen-section").addEventListener("click",()=>toggleSpeech(s));
    populateVoiceControls();
    const form=document.getElementById("section-check"); if(form) form.addEventListener("submit",e=>{e.preventDefault();const choice=Number(new FormData(e.currentTarget).get("answer"));if(!Number.isInteger(choice)){announce("Choose an answer first.");return;}p.checks[s.id]={choice,correct:!!s.check.options[choice]?.correct};save("Knowledge check saved.");renderLesson(l.day,i);});
    document.getElementById("section-continue").addEventListener("click",()=>{if(!p.completedSections.includes(i))p.completedSections.push(i);p.completedSections.sort((a,b)=>a-b);if(i===l.sections.length-1){p.lessonComplete=true;save("Lesson complete. Assessment ready.");location.hash=`#quiz/${l.day}`;}else{p.lastSection=i+1;save(`Section ${i+1} complete.`);location.hash=`#lesson/${l.day}/${i+1}`;}});
  }

  function speechText(section) { return [section.title,`Learning outcome: ${section.outcome}`,...section.body,`Key idea: ${section.keyIdea}`,`Worked example: ${section.workedExample?.title}. ${section.workedExample?.body}`,`Summary: ${section.summary}`].join(" "); }
  let speaking=false;
  function stopSpeech(){ if("speechSynthesis" in window){window.speechSynthesis.cancel();speaking=false;} }
  function voiceScore(voice){const name=`${voice.name} ${voice.voiceURI}`;let score=voice.default?25:0;if(/natural|neural|premium|enhanced|siri/i.test(name))score+=100;if(/aria|jenny|ava|samantha|serena|zira|google us english/i.test(name))score+=60;if(/^en[-_]/i.test(voice.lang))score+=20;if(/compact|espeak/i.test(name))score-=50;return score;}
  function availableEnglishVoices(){if(!("speechSynthesis" in window))return[];return window.speechSynthesis.getVoices().filter(v=>/^en([_-]|$)/i.test(v.lang)).sort((a,b)=>voiceScore(b)-voiceScore(a)||a.name.localeCompare(b.name));}
  function populateVoiceControls(){const select=document.getElementById("voice-select"),rate=document.getElementById("voice-rate"),note=document.getElementById("voice-note");if(!select||!rate)return;rate.value=String(state.voice.rate||.92);if(!("speechSynthesis" in window)){select.disabled=true;rate.disabled=true;note.textContent="Built-in narration is not available in this browser. All lesson text remains readable.";return;}const fill=()=>{const voices=availableEnglishVoices();select.innerHTML=`<option value="">Best available voice${voices[0]?` — ${escapeHTML(voices[0].name)}`:""}</option>`+voices.map(v=>`<option value="${escapeHTML(v.voiceURI)}">${escapeHTML(v.name)} · ${escapeHTML(v.lang)}</option>`).join("");select.value=voices.some(v=>v.voiceURI===state.voice.name)?state.voice.name:"";};fill();window.speechSynthesis.onvoiceschanged=fill;select.addEventListener("change",()=>{state.voice.name=select.value;save("Preferred voice saved on this device.");});rate.addEventListener("change",()=>{state.voice.rate=Number(rate.value)||.92;save("Narration speed saved on this device.");});}
  function toggleSpeech(section){const button=document.getElementById("listen-section");if(!("speechSynthesis" in window)){announce("Built-in voice is not available in this browser.");return;}if(speaking){stopSpeech();button.textContent="▶ Listen to this section";return;}const utterance=new SpeechSynthesisUtterance(speechText(section));const voices=availableEnglishVoices();utterance.voice=voices.find(v=>v.voiceURI===state.voice.name)||voices[0]||null;utterance.rate=Number(state.voice.rate)||.92;utterance.pitch=1;utterance.onend=()=>{speaking=false;if(document.getElementById("listen-section"))document.getElementById("listen-section").textContent="▶ Listen to this section";};utterance.onerror=utterance.onend;speaking=true;button.textContent="■ Stop listening";window.speechSynthesis.speak(utterance);}

  function renderQuiz(day,error="") {
    const l=lessonByDay(day), p=progressFor(l.day), q=p.quiz, quiz=l.quiz;
    if(q.completeView&&q.lastScore!==null){setScreen(`<section class="mastery-results"><div class="page narrow"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Lesson ${l.day} assessment</p><div class="page-header"><p class="course-label">ASSESSMENT COMPLETE</p><h1>${escapeHTML(l.title)}</h1></div><section class="score-card"><p class="eyebrow">MOST RECENT RESULT</p><p class="score-number">${q.lastScore}/${quiz.length}</p><p>${q.lastScore===quiz.length?"Excellent. Every answer was correct on this attempt.":"Review the explanations below, then retake whenever you are ready."}</p><p><strong>Best:</strong> ${q.best}/${quiz.length} across ${q.attempts} attempt${q.attempts===1?"":"s"}</p><div class="actions"><button class="button" id="retake" type="button">Retake assessment</button><a href="#dashboard">Course home</a></div></section><div class="result-breakdown">${quiz.map((item,i)=>{const o=item.options[q.answers[item.id]];return `<article class="${o?.correct?"correct":"missed"}"><span>${o?.correct?"✓":"↻"}</span><div><small>QUESTION ${i+1}</small><h2>${escapeHTML(item.prompt)}</h2><p>${escapeHTML(o?.feedback||"No answer saved.")}</p></div></article>`;}).join("")}</div></div></section>`);document.getElementById("retake").addEventListener("click",()=>{Object.assign(q,{cursor:0,draft:{},feedbackShown:false,completeView:false});save();renderQuiz(l.day);});return;}
    const cursor=Math.max(0,Math.min(Number(q.cursor)||0,quiz.length-1)), item=quiz[cursor], choice=q.draft[item.id], option=Number.isInteger(choice)?item.options[choice]:null;
    setScreen(`<section class="quiz-arena"><div class="page narrow"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Lesson ${l.day} assessment</p><div class="quiz-arena-head"><div><p class="eyebrow light">READABLE ASSESSMENT · UNLIMITED RETAKES</p><h1>${escapeHTML(l.title)}</h1></div><div class="quiz-counter"><strong>${cursor+1}</strong><span>of ${quiz.length}</span></div></div><div class="quiz-progress"><span style="width:${((cursor+(q.feedbackShown?1:0))/quiz.length)*100}%"></span></div>${error?`<p class="feedback incorrect" role="alert">${escapeHTML(error)}</p>`:""}<form id="quiz-form" class="quiz-one"><fieldset class="quiz-question"><legend><span class="game-label">QUESTION ${cursor+1}</span>${escapeHTML(item.prompt)}</legend><div class="option-list">${item.options.map((o,i)=>`<label class="option game-option"><input type="radio" name="answer" value="${i}" ${choice===i?"checked":""} ${q.feedbackShown?"disabled":""}><span class="choice-key">${String.fromCharCode(65+i)}</span><span>${escapeHTML(o.text)}</span></label>`).join("")}</div>${q.feedbackShown&&option?`<div class="quiz-feedback"><p class="feedback ${option.correct?"correct":"incorrect"}">${escapeHTML(option.feedback)}</p></div>`:""}</fieldset><div class="quiz-actions"><span></span><button class="button bright" type="submit">${q.feedbackShown?(cursor===quiz.length-1?"See results":"Next question →"):"Check my answer"}</button></div></form></div></section>`);
    document.getElementById("quiz-form").addEventListener("submit",e=>{e.preventDefault();if(!q.feedbackShown){const value=new FormData(e.currentTarget).get("answer");if(value===null){renderQuiz(l.day,"Choose one answer. Best guesses are welcome.");return;}q.draft[item.id]=Number(value);q.feedbackShown=true;save();renderQuiz(l.day);return;}if(cursor<quiz.length-1){q.cursor=cursor+1;q.feedbackShown=false;save();renderQuiz(l.day);return;}let score=0;const missed=[];quiz.forEach(x=>{const picked=q.draft[x.id];if(x.options[picked]?.correct)score++;else missed.push(x.concept);});Object.assign(q,{attempts:q.attempts+1,lastScore:score,best:Math.max(q.best,score),answers:{...q.draft},missed:[...new Set(missed)],cursor:0,draft:{},feedbackShown:false,completeView:true});p.lessonComplete=true;save(`Assessment scored ${score} out of ${quiz.length}.`);renderQuiz(l.day);});
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
  function renderPrivacy(){setScreen(`<section class="page narrow"><p class="breadcrumbs"><a href="#dashboard">Course home</a> / Privacy</p><div class="page-header"><p class="eyebrow">DEVICE-ONLY PROGRESS</p><h1>Your learning stays in this browser.</h1></div><div class="card"><h2>Saved here</h2><p>Readiness answers, section completion, checks, assessment attempts, and text size are stored in this browser's local storage.</p><h2>Not collected</h2><p>No account, name, email, analytics, advertising tracker, cloud database, or third-party progress service is used.</p><h2>Voice privacy</h2><p>Standard section narration uses the device's built-in speech feature. The optional studio clip is a static course file. No learner text is sent to a paid voice service.</p></div></section>`);}

  function route(){const parts=(location.hash||"#welcome").slice(1).split("/");closeMenu();switch(parts[0]){case"welcome":renderWelcome();break;case"check":renderBaseline();break;case"dashboard":renderDashboard();break;case"lesson":renderLesson(parts[1]||1,parts[2]||0);break;case"quiz":renderQuiz(parts[1]||1);break;case"glossary":renderGlossary();break;case"sources":renderSources();break;case"privacy":renderPrivacy();break;default:location.hash="#welcome";return;}document.querySelector(".mobile-tabbar a:nth-child(2)")?.setAttribute("href",`#lesson/${parts[1]||1}/0`);main.focus({preventScroll:true});window.scrollTo(0,0);}

  const menuButton=document.getElementById("menu-button"),moreMenu=document.getElementById("more-menu");
  function closeMenu(){moreMenu.hidden=true;menuButton.setAttribute("aria-expanded","false");}
  menuButton.addEventListener("click",e=>{e.stopPropagation();const open=moreMenu.hidden;moreMenu.hidden=!open;menuButton.setAttribute("aria-expanded",String(open));});document.addEventListener("click",e=>{if(!moreMenu.contains(e.target)&&e.target!==menuButton)closeMenu();});
  const textButton=document.getElementById("text-size");function applyText(){document.body.dataset.textSize=state.textSize;const labels={regular:"Regular",large:"Large",larger:"Larger"};textButton.querySelector("span").textContent=labels[state.textSize]||"Regular";}textButton.addEventListener("click",()=>{state.textSize=state.textSize==="regular"?"large":state.textSize==="large"?"larger":"regular";applyText();save(`Text size: ${state.textSize}.`);});
  const dialog=document.getElementById("reset-dialog");document.getElementById("reset-open").addEventListener("click",()=>{closeMenu();dialog.showModal();});document.getElementById("reset-confirm").addEventListener("click",()=>{localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(OLD_KEY);state=defaultState();applyText();location.hash="#welcome";route();});document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMenu();stopSpeech();}});
  const offline=document.getElementById("offline-status");const online=()=>offline.hidden=navigator.onLine;window.addEventListener("online",online);window.addEventListener("offline",online);window.addEventListener("hashchange",route);applyText();online();route();
  if("serviceWorker" in navigator&&location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(error=>console.warn("Offline setup unavailable.",error)));
})();
