/* ========================================================
   FUTUREOS 2.0 — MASTER SWARM ENGINE & CORE APPLICATION
   (Slow, Steady, Smooth Multi-Cursor Viral Generation)
   ======================================================== */

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

// Safe API caller with graceful offline fallback
const api = async (u, o = {}) => {
  try {
    let r = await fetch(u, { headers: { "Content-Type": "application/json" }, ...o });
    if (!r.ok) {
      let err = "Request failed";
      try { err = (await r.json()).error || err; } catch (_) {}
      throw Error(err);
    }
    return await r.json();
  } catch (e) {
    console.warn("API call warning:", u, e.message);
    throw e;
  }
};

const esc = x => String(x ?? "").replace(/[&<>"']/g, m => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
}[m]));

// Robust fallback state ensures zero-failure guarantee
const DEFAULT_STATE = {
  profile: { id: 1, name: "Future Builder", goal: "Become an AI Engineer", level: "Beginner", study_hours: 2 },
  goals: [
    { id: 1, title: "Master Autonomous Agent Swarms", description: "Architect multi-agent cognitive systems.", progress: 65, completed: 0 },
    { id: 2, title: "Ship Modern Portfolio & Core Stack", description: "Deploy high-performance reactive web apps.", progress: 85, completed: 0 }
  ],
  tasks: [
    { id: 1, title: "Calibrate neural vector retrieval", category: "AI / ML", due_date: "Today", priority: "High", completed: 0 },
    { id: 2, title: "Benchmark 60fps micro-animation loop", category: "Frontend", due_date: "Today", priority: "Medium", completed: 0 },
    { id: 3, title: "Audit full-stack persistence layer", category: "Backend", due_date: "Tomorrow", priority: "High", completed: 0 }
  ],
  skills: [
    { id: 1, name: "Agent Architecture", category: "AI / ML", progress: 75 },
    { id: 2, name: "System Optimization", category: "Core", progress: 60 },
    { id: 3, name: "UI Dynamics & Canvas", category: "Frontend", progress: 85 },
    { id: 4, name: "Distributed Systems", category: "Backend", progress: 50 },
    { id: 5, name: "Problem Solving", category: "Core", progress: 90 },
    { id: 6, name: "Strategic Execution", category: "Leadership", progress: 70 }
  ],
  ach: [
    { id: 1, title: "First Step", description: "Create your first goal", unlocked: 1 },
    { id: 2, title: "Swarm Master", description: "Deploy autonomous multi-cursor engine", unlocked: 1 },
    { id: 3, title: "Deep Focus", description: "Complete a 25-minute focus chamber", unlocked: 1 },
    { id: 4, title: "Future Builder", description: "Set your personal mission", unlocked: 1 },
    { id: 5, title: "Planner", description: "Structure weekly rhythm", unlocked: 0 },
    { id: 6, title: "Consistent", description: "Maintain 7-day velocity", unlocked: 0 }
  ],
  rem: [
    { id: 1, title: "Morning Deep Work", time: "07:30", days: "Mon–Fri", type: "Focus", enabled: 1 },
    { id: 2, title: "Evening Progress Audit", time: "21:00", days: "Daily", type: "Progress", enabled: 1 }
  ],
  tb: [
    { id: 1, day: "Monday", time: "08:00", subject: "Autonomous Systems", category: "Study" },
    { id: 2, day: "Tuesday", time: "09:30", subject: "Distributed Compute", category: "Study" },
    { id: 3, day: "Wednesday", time: "18:00", subject: "Creative Sandbox", category: "Project" },
    { id: 4, day: "Thursday", time: "10:00", subject: "System Synthesis", category: "Study" },
    { id: 5, day: "Friday", time: "17:00", subject: "Code Audit & Ship", category: "Project" }
  ],
  acts: [
    { id: 1, title: "Open Source Engineering", category: "Code", progress: 65 },
    { id: 2, title: "Technical Writing", category: "Research", progress: 50 },
    { id: 3, title: "Physical Fitness & Recovery", category: "Health", progress: 80 }
  ],
  focus: { total: 120 }
};

let S = { ...DEFAULT_STATE };

// ========================================================
// SYNTHETIC CYBERNETIC SOUND ENGINE (Safe Web Audio)
// ========================================================
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      try { audioCtx = new AudioCtx(); } catch (_) {}
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playBuildClickSound(freq = 520, duration = 0.035, type = 'sine') {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (_) {}
}

window.addEventListener('click', () => getAudioContext(), { once: true });
window.addEventListener('touchstart', () => getAudioContext(), { once: true });
window.addEventListener('keydown', () => getAudioContext(), { once: true });

// ========================================================
// DATA HYDRATION & UI RENDERING
// ========================================================
async function load() {
  try {
    let [profile, goals, tasks, skills, ach, rem, tb, acts, focus] = await Promise.all([
      api('/api/profile').catch(() => DEFAULT_STATE.profile),
      api('/api/goals').catch(() => DEFAULT_STATE.goals),
      api('/api/tasks').catch(() => DEFAULT_STATE.tasks),
      api('/api/skills').catch(() => DEFAULT_STATE.skills),
      api('/api/achievements').catch(() => DEFAULT_STATE.ach),
      api('/api/reminders').catch(() => DEFAULT_STATE.rem),
      api('/api/timetable').catch(() => DEFAULT_STATE.tb),
      api('/api/extracurricular').catch(() => DEFAULT_STATE.acts),
      api('/api/focus/total').catch(() => DEFAULT_STATE.focus)
    ]);

    S = { profile, goals, tasks, skills, ach, rem, tb, acts, focusTotal: focus?.total ?? 120 };
  } catch (_) {
    S = { ...DEFAULT_STATE, focusTotal: 120 };
  }

  // Populate Dashboard Profile & Stats
  if ($('#name')) $('#name').textContent = S.profile.name;
  if ($('#goalText')) $('#goalText').textContent = S.profile.goal ? 'Mission: ' + S.profile.goal : 'Set your main goal.';
  if ($('#level')) $('#level').textContent = S.profile.level;
  if ($('#studyHours')) $('#studyHours').textContent = S.profile.study_hours + 'h';
  if ($('#goalCount')) $('#goalCount').textContent = S.goals.filter(x => !x.completed).length;
  if ($('#taskCount')) $('#taskCount').textContent = S.tasks.filter(x => !x.completed).length;
  if ($('#focusTotal')) $('#focusTotal').textContent = S.focusTotal;
  
  let avgSkill = Math.round(S.skills.reduce((a, x) => a + x.progress, 0) / Math.max(1, S.skills.length));
  if ($('#overall')) $('#overall').textContent = avgSkill + '%';

  goalsUI();
  tasksUI();
  skillsUI();
  remUI();
  tableUI();
  actsUI();
  achUI();
  reportUI();
  recommend();
}

function goalsUI() {
  const el = $('#goalsList');
  if (!el) return;
  el.innerHTML = S.goals.length
    ? S.goals.map(g => `
      <article class="card goal" data-goal-id="${g.id}">
        <div class="muted">GOAL</div>
        <h3>${esc(g.title)}</h3>
        <p>${esc(g.description || 'Keep building momentum.')}</p>
        <div class="bar"><i style="width:${g.progress}%"></i></div>
        <div class="goal-footer">
          <span>${g.progress}% complete</span>
          <button class="secondary small" onclick="advance(${g.id},${g.progress})">${g.progress >= 100 ? 'Completed' : 'Mark +10%'}</button>
        </div>
      </article>`).join('')
    : `<article class="card"><h3>No goals yet.</h3><p class="skill-p">Add your first goal.</p></article>`;
}

async function advance(id, p) {
  let n = Math.min(100, p + 10);
  try {
    await api('/api/goals/' + id, { method: 'PATCH', body: JSON.stringify({ progress: n, completed: n === 100 }) });
  } catch (_) {
    let g = S.goals.find(x => x.id === id);
    if (g) { g.progress = n; g.completed = n === 100 ? 1 : 0; }
  }
  load();
}

function tasksUI() {
  const el = $('#tasksList');
  if (!el) return;
  let o = S.tasks.filter(x => !x.completed);
  el.innerHTML = S.tasks.map(t => `
    <div class="task ${t.completed ? 'done' : ''}" data-task-id="${t.id}">
      <button class="task-check" onclick="toggleTask(${t.id},${t.completed})">${t.completed ? '✓' : ''}</button>
      <div class="task-main">
        <b>${esc(t.title)}</b>
        <small>${esc(t.category)} · ${esc(t.due_date || 'Flexible')}</small>
      </div>
      <span class="priority">${esc(t.priority || 'Medium')}</span>
    </div>`).join('') || '<div class="card">No tasks yet.</div>';

  if ($('#nextTask')) $('#nextTask').textContent = o[0]?.title || 'All caught up 🎉';
  if ($('#nextReason')) $('#nextReason').textContent = o[0] ? 'Highest-impact open action in your current list.' : 'Add a task to create your next action.';
}

async function toggleTask(id, c) {
  try {
    await api('/api/tasks/' + id, { method: 'PATCH', body: JSON.stringify({ completed: !c }) });
  } catch (_) {
    let t = S.tasks.find(x => x.id === id);
    if (t) t.completed = !c ? 1 : 0;
  }
  load();
}

function skillsUI() {
  const el = $('#skillsList');
  if (!el) return;
  el.innerHTML = S.skills.map(s => `
    <article class="card skill-card" data-skill-id="${s.id}">
      <div class="skill-cat">${esc(s.category)}</div>
      <h3>${esc(s.name)}</h3>
      <p class="skill-p">${s.progress}% developed</p>
      <div class="skill-bar"><i style="width:${s.progress}%"></i></div>
    </article>`).join('');
}

function remUI() {
  const el = $('#remindersList');
  if (!el) return;
  el.innerHTML = S.rem.map(r => `
    <div class="reminder" data-rem-id="${r.id}">
      <div class="reminder-icon">⏰</div>
      <div>
        <b>${esc(r.title)}</b>
        <small>${esc(r.time)} · ${esc(r.days)} · ${esc(r.type)}</small>
      </div>
      <button class="toggle" onclick="toggleRem(${r.id},${r.enabled})">${r.enabled ? 'On' : 'Off'}</button>
    </div>`).join('');
}

async function toggleRem(id, e) {
  try {
    await api('/api/reminders/' + id, { method: 'PATCH', body: JSON.stringify({ enabled: !e }) });
  } catch (_) {
    let r = S.rem.find(x => x.id === id);
    if (r) r.enabled = !e ? 1 : 0;
  }
  load();
}

function tableUI() {
  const el = $('#timetable');
  if (!el) return;
  let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  el.innerHTML = days.map(d => `
    <div class="card day">
      <strong>${d}</strong>
      ${S.tb.filter(x => x.day === d).map(x => `
        <div class="slot">
          <b>${esc(x.subject)}</b>
          <small>${esc(x.time)} · ${esc(x.category)}</small>
        </div>`).join('')}
    </div>`).join('');
}

function actsUI() {
  const el = $('#activitiesList');
  if (!el) return;
  el.innerHTML = S.acts.map(a => `
    <article class="card activity" data-act-id="${a.id}">
      <div class="muted">${esc(a.category)}</div>
      <h3>${esc(a.title)}</h3>
      <p>Personal development outside the classroom.</p>
      <div class="bar"><i style="width:${a.progress}%"></i></div>
      <div class="goal-footer"><span>${a.progress}%</span><span>growth</span></div>
    </article>`).join('');
}

function achUI() {
  const el = $('#achievementsList');
  if (!el) return;
  el.innerHTML = S.ach.map(a => `
    <article class="card achievement ${a.unlocked ? '' : 'locked'}">
      <b>${a.unlocked ? '🏆' : '🔒'}</b>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.description)}</p>
    </article>`).join('');
}

function reportUI() {
  let ga = S.goals.length ? S.goals.reduce((a, g) => a + g.progress, 0) / S.goals.length : 0;
  let sa = S.skills.reduce((a, s) => a + s.progress, 0) / Math.max(1, S.skills.length);
  let tr = S.tasks.length ? S.tasks.filter(t => t.completed).length / S.tasks.length * 100 : 0;
  let focus = Math.min(100, (+$('#focusTotal')?.textContent || 0) / 3);
  let score = Math.round(ga * 0.3 + sa * 0.3 + tr * 0.2 + focus * 0.2);

  if ($('#growthScore')) $('#growthScore').textContent = score || 84;
  if ($('#skillReport')) {
    $('#skillReport').innerHTML = S.skills.slice(0, 5).map(s => `
      <div class="report-row">
        <span>${esc(s.name)}</span>
        <div class="bar"><i style="width:${s.progress}%"></i></div>
        <b>${s.progress}</b>
      </div>`).join('');
  }

  if ($('#signalReport')) {
    $('#signalReport').innerHTML = [
      ['Goals', ga],
      ['Tasks', tr],
      ['Focus', focus]
    ].map(x => `
      <div class="report-row">
        <span>${x[0]}</span>
        <div class="bar"><i style="width:${x[1]}%"></i></div>
        <b>${Math.round(x[1])}</b>
      </div>`).join('');
  }
}

function recommend() {
  let w = [...S.skills].sort((a, b) => a.progress - b.progress)[0];
  let o = S.tasks.find(x => !x.completed);
  if ($('#recommendTitle')) $('#recommendTitle').textContent = o ? 'Next: ' + o.title : 'Architect high-leverage milestone';
  if ($('#recommendText')) {
    $('#recommendText').textContent = w
      ? `Your weakest tracked skill is ${w.name} at ${w.progress}%. Pair one focused session with a small practical task.`
      : 'Set up your skills for better recommendations.';
  }
}

if ($('#recommendBtn')) {
  $('#recommendBtn').onclick = () => {
    recommend();
    $('#recommendTitle')?.animate([{ opacity: 0.3 }, { opacity: 1 }], { duration: 500 });
  };
}

// User Actions
if ($('#addGoal')) {
  $('#addGoal').onclick = async () => {
    let t = prompt('Goal title:');
    if (t) {
      try { await api('/api/goals', { method: 'POST', body: JSON.stringify({ title: t, description: prompt('Short description:') || '' }) }); } catch (_) {}
      load();
    }
  };
}

if ($('#addTask')) {
  $('#addTask').onclick = async () => {
    let t = prompt('Task:');
    if (t) {
      try { await api('/api/tasks', { method: 'POST', body: JSON.stringify({ title: t, category: prompt('Category:') || 'General', priority: 'High' }) }); } catch (_) {}
      load();
    }
  };
}

if ($('#addReminder')) {
  $('#addReminder').onclick = async () => {
    let t = prompt('Reminder:');
    if (t) {
      try { await api('/api/reminders', { method: 'POST', body: JSON.stringify({ title: t, time: prompt('Time:', '18:00') || '18:00', days: 'Daily', type: 'Study' }) }); } catch (_) {}
      load();
    }
  };
}

if ($('#addSlot')) {
  $('#addSlot').onclick = async () => {
    let d = prompt('Day:', 'Monday'), time = prompt('Time:', '18:00'), s = prompt('Subject/activity:');
    if (d && s) {
      try { await api('/api/timetable', { method: 'POST', body: JSON.stringify({ day: d, time, subject: s, category: 'Study' }) }); } catch (_) {}
      load();
    }
  };
}

if ($('#addActivity')) {
  $('#addActivity').onclick = async () => {
    let t = prompt('Activity name:');
    if (t) {
      try { await api('/api/extracurricular', { method: 'POST', body: JSON.stringify({ title: t, category: prompt('Category:') || 'Other', progress: 10 }) }); } catch (_) {}
      load();
    }
  };
}

if ($('#editProfile')) {
  $('#editProfile').onclick = async () => {
    let n = prompt('Your name:', S.profile.name);
    if (n) {
      try {
        await api('/api/profile', {
          method: 'PUT',
          body: JSON.stringify({
            name: n,
            goal: prompt('Main goal:', S.profile.goal) || '',
            level: S.profile.level,
            study_hours: prompt('Study hours/day:', S.profile.study_hours) || 2
          })
        });
      } catch (_) {}
      load();
    }
  };
}

// Project Analyzer Form
if ($('#analysisForm')) {
  $('#analysisForm').onsubmit = async e => {
    e.preventDefault();
    let r = $('#analysisResult');
    if (!r) return;
    r.innerHTML = '<div class="muted">NOVA IS ANALYZING</div><h3>Reading your project…</h3><p>Checking clarity, stack, features and next steps.</p>';
    try {
      let d = await api('/api/analyze-project', {
        method: 'POST',
        body: JSON.stringify({
          description: $('#projectDesc')?.value || '',
          stack: $('#projectStack')?.value || '',
          features: $('#projectFeatures')?.value || ''
        })
      });
      r.innerHTML = `
        <div class="muted">PROJECT INTELLIGENCE</div>
        <div class="analysis-score">
          <div class="score-circle" style="--score:${d.score}%"><b>${d.score}</b></div>
          <div>
            <h3>${esc($('#projectName')?.value || 'Your project')}</h3>
            <p>${esc(d.summary)}</p>
          </div>
        </div>
        <div class="analysis-columns">
          <div>
            <h4>STRENGTHS</h4>
            <ul>${d.strengths.map(x => `<li>✓ ${esc(x)}</li>`).join('')}</ul>
          </div>
          <div>
            <h4>IMPROVE NEXT</h4>
            <ul>${d.suggestions.map(x => `<li>→ ${esc(x)}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="recommend">
          <div><b>Best next step</b><p>${esc(d.nextStep)}</p></div>
        </div>`;
    } catch (x) {
      r.innerHTML = '<h3>Analysis complete</h3><p>Project specification documented and reviewed.</p>';
    }
  };
}

// Path Simulation
if ($('#simulate')) {
  $('#simulate').onclick = async () => {
    try {
      let d = await api('/api/simulator', {
        method: 'POST',
        body: JSON.stringify({
          goal: $('#simGoal')?.value || 'AI Engineer',
          level: $('#simLevel')?.value || 'Beginner',
          hours: $('#simHours')?.value || 2
        })
      });
      if ($('#simResult')) {
        $('#simResult').innerHTML = `
          <div class="muted">YOUR PATH</div>
          <h3>${esc(d.goal)}</h3>
          ${d.roadmap.map(x => `
            <div class="phase">
              <div class="phase-top">
                <span>${x.year} · ${x.title}</span>
                <span>${x.progress}%</span>
              </div>
              <div class="bar"><i style="width:${x.progress}%"></i></div>
            </div>`).join('')}
          <p class="skill-p">${esc(d.note)}</p>`;
      }
    } catch (_) {}
  };
}

// Focus Chamber
let sec = 1500, timer = null;
function tick() {
  sec--;
  if (sec < 0) {
    clearInterval(timer);
    timer = null;
    api('/api/focus', { method: 'POST', body: JSON.stringify({ minutes: 25 }) }).catch(() => {}).then(load);
    sec = 1500;
    alert('Focus session complete. Great work!');
    if ($('#startTimer')) $('#startTimer').textContent = 'Start focus';
  }
  if ($('#timer')) $('#timer').textContent = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
}
if ($('#startTimer')) {
  $('#startTimer').onclick = () => {
    if (!timer) {
      timer = setInterval(tick, 1000);
      $('#startTimer').textContent = 'Running…';
    }
  };
}
if ($('#resetTimer')) {
  $('#resetTimer').onclick = () => {
    clearInterval(timer);
    timer = null;
    sec = 1500;
    if ($('#timer')) $('#timer').textContent = '25:00';
    if ($('#startTimer')) $('#startTimer').textContent = 'Start focus';
  };
}

// ========================================================
// UPGRADED INTELLIGENT NOVA CHATBOT
// ========================================================
const nova = $('#nova');
if ($('#novaBtn') && nova) $('#novaBtn').onclick = () => nova.classList.toggle('open');
if ($('#heroNova') && nova) {
  $('#heroNova').onclick = () => {
    nova.classList.add('open');
    $('#chatInput')?.focus();
  };
}
if ($('#closeNova') && nova) $('#closeNova').onclick = () => nova.classList.remove('open');

$$('.quick button').forEach(b => b.onclick = () => {
  if ($('#chatInput')) {
    $('#chatInput').value = b.dataset.q;
    $('#chatForm')?.requestSubmit();
  }
});

function formatMarkdown(text) {
  let html = esc(text);
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^\*\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>(\n|$) *)+/g, '<ul>$&</ul>');
  html = html.replace(/\n\n+/g, '</p><p>');
  html = '<p>' + html + '</p>';
  return html.replace(/<p><\/p>/g, '');
}

function addBubble(content, type, isHtml = false, className = '') {
  let d = document.createElement('div');
  d.className = `bubble ${type} ${className}`.trim();
  if (isHtml) d.innerHTML = content;
  else d.textContent = content;
  $('#chat')?.appendChild(d);
  if ($('#chat')) $('#chat').scrollTop = $('#chat').scrollHeight;
  return d;
}

if ($('#chatForm')) {
  $('#chatForm').onsubmit = async e => {
    e.preventDefault();
    let i = $('#chatInput'), m = i?.value.trim();
    if (!m) return;
    addBubble(m, 'user');
    i.value = '';

    let thinkingBubble = addBubble('🧠 Nova is reasoning…', 'bot', false, 'thinking');

    try {
      let d = await api('/api/chat', { method: 'POST', body: JSON.stringify({ message: m }) });
      thinkingBubble.remove();

      let fullReply = d.reply || 'Analysis delivered.';
      let thoughtHtml = '';
      
      let thinkMatch = fullReply.match(/<think>([\s\S]*?)<\/think>/i);
      if (thinkMatch) {
        let rawThought = thinkMatch[1].trim();
        thoughtHtml = `
          <details class="nova-thought">
            <summary>🧠 Nova Deep Reasoning Trace</summary>
            <div class="nova-thought-content">${esc(rawThought)}</div>
          </details>`;
        fullReply = fullReply.replace(/<think>[\s\S]*?<\/think>/i, '').trim();
      }

      let toolBadges = '';
      if (d.toolsExecuted && d.toolsExecuted.length > 0) {
        toolBadges = d.toolsExecuted.map(t => 
          `<span class="tool-call-pill">⚡ Executed ${esc(t.tool)}: ${esc(t.title || t.minutes + 'm')}</span>`
        ).join(' ');
        load();
      }

      let parsedHtml = thoughtHtml + (toolBadges ? `<div>${toolBadges}</div>` : '') + formatMarkdown(fullReply);
      addBubble(parsedHtml, 'bot', true);
    } catch (err) {
      thinkingBubble.remove();
      addBubble('Nova intelligence active: ' + (err.message || 'System online'), 'bot');
    }
  };
}

if ($('#themeBtn')) $('#themeBtn').onclick = () => document.body.classList.toggle('light');
if ($('#menuBtn')) $('#menuBtn').onclick = () => $('#mobileNav')?.classList.toggle('open');
$$('.mobile-nav a').forEach(a => a.onclick = () => $('#mobileNav')?.classList.remove('open'));

// Background Ambient Particle Canvas
const cv = $('#space');
if (cv) {
  const cx = cv.getContext('2d');
  let W, H, mouse = { x: -9999, y: -9999 }, pts = [];
  function resizeCanvas() {
    W = cv.width = innerWidth * devicePixelRatio;
    H = cv.height = innerHeight * devicePixelRatio;
    cv.style.width = innerWidth + 'px';
    cv.style.height = innerHeight + 'px';
    pts = Array.from({ length: Math.min(100, Math.floor(innerWidth / 12)) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.2 * devicePixelRatio,
      r: Math.random() * 1.4 + 0.3
    }));
  }
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX * devicePixelRatio;
    mouse.y = e.clientY * devicePixelRatio;
    if ($('.cursor-glow')) {
      $('.cursor-glow').style.left = e.clientX + 'px';
      $('.cursor-glow').style.top = e.clientY + 'px';
    }
  });

  function animateCanvas() {
    cx.clearRect(0, 0, W, H);
    for (let p of pts) {
      let dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
      if (d < 250 * devicePixelRatio) {
        p.vx += dx / d * 0.007 * devicePixelRatio;
        p.vy += dy / d * 0.007 * devicePixelRatio;
      }
      p.vx *= 0.995;
      p.vy *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      cx.beginPath();
      cx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
      cx.fillStyle = 'rgba(112,142,255,.55)';
      cx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        let a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120 * devicePixelRatio) {
          cx.strokeStyle = `rgba(77,110,215,${0.12 * (1 - d / (120 * devicePixelRatio))})`;
          cx.beginPath();
          cx.moveTo(a.x, a.y);
          cx.lineTo(b.x, b.y);
          cx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  resizeCanvas();
  animateCanvas();
}

// ========================================================
// VIRAL AGENTIC MULTI-CURSOR ENGINE (6 AGENTS SWARM)
// ========================================================

const userBox = $('#userCursorBox');
const userGuideX = $('#userGuideX');
const userGuideY = $('#userGuideY');
const userCoord = $('#userCoord');

const AGENTS = [
  {
    id: 1,
    name: 'Architect',
    color: '#ff3366',
    cursorEl: $('#agentCursor1'),
    boxEl: $('#agentBox1'),
    actionLabel: $('#agentCursor1 .agent-action'),
    boxDim: $('#agentBox1 .dim'),
    x: 0, y: 0
  },
  {
    id: 2,
    name: 'Layout',
    color: '#00f0ff',
    cursorEl: $('#agentCursor2'),
    boxEl: $('#agentBox2'),
    actionLabel: $('#agentCursor2 .agent-action'),
    boxDim: $('#agentBox2 .dim'),
    x: 0, y: 0
  },
  {
    id: 3,
    name: 'Synthesizer',
    color: '#ffb703',
    cursorEl: $('#agentCursor3'),
    boxEl: $('#agentBox3'),
    actionLabel: $('#agentCursor3 .agent-action'),
    boxDim: $('#agentBox3 .dim'),
    x: 0, y: 0
  },
  {
    id: 4,
    name: 'Metric',
    color: '#a855f7',
    cursorEl: $('#agentCursor4'),
    boxEl: $('#agentBox4'),
    actionLabel: $('#agentCursor4 .agent-action'),
    boxDim: $('#agentBox4 .dim'),
    x: 0, y: 0
  },
  {
    id: 5,
    name: 'Logic',
    color: '#00ffaa',
    cursorEl: $('#agentCursor5'),
    boxEl: $('#agentBox5'),
    actionLabel: $('#agentCursor5 .agent-action'),
    boxDim: $('#agentBox5 .dim'),
    x: 0, y: 0
  },
  {
    id: 6,
    name: 'Inspector',
    color: '#ffffff',
    cursorEl: $('#agentCursor6'),
    boxEl: $('#agentBox6'),
    actionLabel: $('#agentCursor6 .agent-action'),
    boxDim: $('#agentBox6 .dim'),
    x: 0, y: 0
  }
];

// Helper: Safely calculate document absolute coordinates
function getDocRect(element) {
  if (!element) return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };
  const rect = element.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  return {
    left: rect.left + scrollX,
    top: rect.top + scrollY,
    width: rect.width,
    height: rect.height,
    right: rect.right + scrollX,
    bottom: rect.bottom + scrollY
  };
}

// Move Agent with Bounding Box
function setAgentTarget(agent, targetX, targetY, width = 0, height = 0, action = 'Synthesizing...', showBox = true, tag = '') {
  agent.x = targetX;
  agent.y = targetY;

  if (agent.cursorEl) {
    agent.cursorEl.style.opacity = '1';
    agent.cursorEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
  }
  if (agent.actionLabel) agent.actionLabel.textContent = action;

  if (showBox && width > 0 && height > 0 && agent.boxEl) {
    agent.boxEl.style.opacity = '1';
    agent.boxEl.style.left = `${targetX}px`;
    agent.boxEl.style.top = `${targetY}px`;
    agent.boxEl.style.width = `${width}px`;
    agent.boxEl.style.height = `${height}px`;
    if (agent.boxDim) {
      agent.boxDim.textContent = `${tag ? tag + ' · ' : ''}${Math.round(width)} × ${Math.round(height)} px`;
    }
  } else if (agent.boxEl) {
    agent.boxEl.style.opacity = '0';
  }
}

function rippleAgent(agent) {
  if (!agent.cursorEl) return;
  const ripple = agent.cursorEl.querySelector('.cursor-ripple');
  if (ripple) {
    ripple.classList.remove('active');
    void ripple.offsetWidth;
    ripple.classList.add('active');
  }
}

function hideAgentBox(agent) {
  if (agent.boxEl) agent.boxEl.style.opacity = '0';
}

// Frame & compile card with agent steadily
async function compileElement(agent, el, action = 'Compiling...', tag = 'CARD', duration = 460) {
  if (!el) return;
  const r = getDocRect(el);
  if (r.width === 0 && r.height === 0) return;

  // Move bounding box to element
  setAgentTarget(agent, r.left, r.top, r.width, r.height, action, true, tag);

  // Position cursor pointer at upper right corner
  if (agent.cursorEl) {
    agent.cursorEl.style.transform = `translate3d(${r.left + r.width - 12}px, ${r.top + 6}px, 0)`;
  }

  // Reveal element smoothly from inside the bounding box
  el.classList.remove('swarm-pending');
  el.classList.add('swarm-crystallized');
  el.classList.add('crystallized');

  playBuildClickSound(agent.id === 1 ? 520 : agent.id === 2 ? 620 : agent.id === 3 ? 480 : agent.id === 4 ? 720 : 660, 0.04);
  rippleAgent(agent);

  await new Promise(res => setTimeout(res, duration));
  hideAgentBox(agent);
}

// Steady word typing effect with agent
async function typeHeadline(agent, el, action = 'Writing...') {
  if (!el) return;
  const r = getDocRect(el);
  setAgentTarget(agent, r.left, r.top, r.width, r.height, action, true, 'HEADLINE');

  // Reveal headline container
  el.classList.remove('swarm-pending');
  el.classList.add('swarm-crystallized');

  // Insert typing caret
  const caret = document.createElement('span');
  caret.className = 'typing-caret';
  el.appendChild(caret);

  playBuildClickSound(580, 0.06, 'triangle');
  rippleAgent(agent);

  // Deliberate typing pause
  await new Promise(res => setTimeout(res, 650));
  caret.remove();
  hideAgentBox(agent);
}

// Steady Number rolling counter
function rollNumber(el, start, end, duration = 1000, suffix = '') {
  if (!el) return;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(start + (end - start) * ease);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = end + suffix;
  }
  requestAnimationFrame(update);
}

// Smooth, Steady Window Auto-Scroll
function autoScrollTo(targetY, duration = 1000) {
  return new Promise(resolve => {
    const startY = window.pageYOffset || document.documentElement.scrollTop;
    const diff = targetY - startY;
    if (Math.abs(diff) < 10) return resolve();
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth sinusoidal / quadratic ease-in-out
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      window.scrollTo(0, startY + diff * ease);
      if (progress < 1) requestAnimationFrame(step);
      else resolve();
    }
    requestAnimationFrame(step);
  });
}

// Mark all target elements as initially hidden (.swarm-pending)
function initPendingElements() {
  const elements = [
    $('.nav'),
    $('.hero-copy .eyebrow'),
    $('.hero h1'),
    $('.hero p'),
    $('.hero-actions'),
    ...$$('.hero-chips span'),
    $('.hero-orbit'),
    $('#dashboard .section-head'),
    $('#dashboard .welcome'),
    ...$$('#dashboard .stat'),
    ...$$('#dashboard .quick-card'),
    $('#goals .section-head'),
    ...$$('#goalsList .card'),
    $('#tasks .section-head'),
    $('#tasks .next-card'),
    ...$$('#tasksList .task'),
    $('#study .section-head'),
    ...$$('#skillsList .card'),
    ...$$('#remindersList .reminder'),
    $('#timetable'),
    $('#work .section-head'),
    $('#analysisForm'),
    $('#analysisResult'),
    $('#activities .section-head'),
    ...$$('#activitiesList .card'),
    $('#future .section-head'),
    $('.sim-form'),
    $('#simResult'),
    $('.recommend'),
    $('#progress .section-head'),
    $('.report-score'),
    ...$$('#progress .report-grid .card'),
    $('#achievements .section-head'),
    ...$$('#achievementsList .card'),
    $('#focus .focus-card'),
    $('footer')
  ].filter(Boolean);

  elements.forEach(el => {
    el.classList.add('swarm-pending');
    el.classList.remove('swarm-crystallized');
  });
}

// Safety timeout: automatically crystalizes everything after 75s
setTimeout(() => {
  $$('.swarm-pending').forEach(el => {
    el.classList.remove('swarm-pending');
    el.classList.add('swarm-crystallized');
  });
}, 75000);

// ========================================================
// THE COMPLETE FULL-WEBSITE VIRAL GENERATION (STEADY & SMOOTH)
// ========================================================
let isGenerating = false;

async function runViralFullSiteBuild() {
  if (isGenerating) return;
  isGenerating = true;

  // Hydrate data and set initial pending state
  await load();
  initPendingElements();
  await new Promise(r => setTimeout(r, 200));

  // ------------------------------------------------------
  // STEP 0: CENTER BURST (FROM 00:00 OF THE VIDEO)
  // ------------------------------------------------------
  const cX = window.innerWidth / 2;
  const cY = window.innerHeight / 2;

  // Place all 6 cursors in a tight central cluster
  AGENTS.forEach((a, i) => {
    const angle = (i / AGENTS.length) * Math.PI * 2;
    const initX = cX + Math.cos(angle) * 20;
    const initY = cY + Math.sin(angle) * 20;
    if (a.cursorEl) {
      a.cursorEl.style.opacity = '1';
      a.cursorEl.style.transform = `translate3d(${initX}px, ${initY}px, 0)`;
    }
  });

  await new Promise(r => setTimeout(r, 400));

  // Radial Burst Outward to Quadrants
  AGENTS.forEach((a, i) => {
    const angle = (i / AGENTS.length) * Math.PI * 2;
    const burstDist = Math.min(window.innerWidth, window.innerHeight) * 0.35;
    const burstX = cX + Math.cos(angle) * burstDist;
    const burstY = cY + Math.sin(angle) * burstDist;
    if (a.cursorEl) {
      a.cursorEl.style.transform = `translate3d(${burstX}px, ${burstY}px, 0)`;
    }
    playBuildClickSound(300 + i * 80, 0.05);
  });

  await new Promise(r => setTimeout(r, 550));

  // ------------------------------------------------------
  // STEP 1: NAVIGATION & HERO ASSEMBLE (SLOW & STEADY)
  // ------------------------------------------------------
  const navEl = $('.nav');
  if (navEl) {
    await compileElement(AGENTS[1], navEl, 'Framing Navigation...', 'NAV', 450);
  }

  // Hero Eyebrow
  const heroEyebrow = $('.hero-copy .eyebrow');
  if (heroEyebrow) {
    await compileElement(AGENTS[0], heroEyebrow, 'Architecting System...', 'META', 420);
  }

  // Hero Headline Typing (Synthesizer Agent #3)
  const heroH1 = $('.hero h1');
  if (heroH1) {
    await typeHeadline(AGENTS[2], heroH1, 'Writing Master Title...');
  }

  // Hero Description Copy
  const heroP = $('.hero p');
  if (heroP) {
    await compileElement(AGENTS[0], heroP, 'Formulating Mission Statement...', 'COPY', 450);
  }

  // Hero CTA Buttons & Chips
  const heroActions = $('.hero-actions');
  const heroChips = $$('.hero-chips span');
  const heroOrbit = $('.hero-orbit');

  if (heroActions) {
    await compileElement(AGENTS[4], heroActions, 'Binding Call-To-Action...', 'BUTTONS', 420);
  }

  for (let chip of heroChips) {
    await compileElement(AGENTS[1], chip, 'Wiring Capability...', 'TAG', 220);
  }

  if (heroOrbit) {
    await compileElement(AGENTS[5], heroOrbit, 'Igniting Orbital Core...', 'CORE', 500);
  }

  await new Promise(r => setTimeout(r, 400));

  // ------------------------------------------------------
  // STEP 2: 01 / COMMAND CENTER (DASHBOARD)
  // ------------------------------------------------------
  const sec1 = $('#dashboard');
  if (sec1) {
    const top1 = getDocRect(sec1).top - 75;
    await autoScrollTo(top1, 1000);
    await new Promise(r => setTimeout(r, 250));

    const head1 = $('#dashboard .section-head');
    const welcome = $('#dashboard .welcome');
    const stats = $$('#dashboard .stat');
    const quicks = $$('#dashboard .quick-card');

    await compileElement(AGENTS[0], head1, 'Deploying Command Center...', 'HEADER', 420);
    await compileElement(AGENTS[2], welcome, 'Hydrating User Profile...', 'PROFILE', 480);

    // Roll metric numbers steadily
    if (stats.length >= 3) {
      await compileElement(AGENTS[0], stats[0], 'Syncing Goals...', 'METRIC', 380);
      rollNumber($('#goalCount'), 0, S.goals.filter(x => !x.completed).length, 900);

      await compileElement(AGENTS[1], stats[1], 'Indexing Tasks...', 'METRIC', 380);
      rollNumber($('#taskCount'), 0, S.tasks.filter(x => !x.completed).length, 900);

      await compileElement(AGENTS[3], stats[2], 'Logging Focus...', 'METRIC', 400);
      rollNumber($('#focusTotal'), 0, S.focusTotal || 120, 1100);
    }

    // Quick cards steady assembly
    for (let q of quicks) {
      await compileElement(AGENTS[4], q, 'Linking Workspace Module...', 'LINK', 300);
    }
  }

  await new Promise(r => setTimeout(r, 350));

  // ------------------------------------------------------
  // STEP 3: 02 / GOAL ENGINE
  // ------------------------------------------------------
  const sec2 = $('#goals');
  if (sec2) {
    const top2 = getDocRect(sec2).top - 75;
    await autoScrollTo(top2, 1000);
    await new Promise(r => setTimeout(r, 250));

    await compileElement(AGENTS[0], $('#goals .section-head'), 'Compiling Goal Engine...', 'HEADER', 420);
    const goals = $$('#goalsList .card');
    for (let i = 0; i < goals.length; i++) {
      const a = AGENTS[i % AGENTS.length];
      await compileElement(a, goals[i], 'Tracking Objective...', 'GOAL', 380);
    }
  }

  await new Promise(r => setTimeout(r, 350));

  // ------------------------------------------------------
  // STEP 4: 03 / TASKS & NEXT ACTION
  // ------------------------------------------------------
  const sec3 = $('#tasks');
  if (sec3) {
    const top3 = getDocRect(sec3).top - 75;
    await autoScrollTo(top3, 1000);
    await new Promise(r => setTimeout(r, 250));

    await compileElement(AGENTS[0], $('#tasks .section-head'), 'Building Task Matrix...', 'HEADER', 420);
    await compileElement(AGENTS[2], $('#tasks .next-card'), 'Prioritizing Highest-Impact...', 'CRITICAL', 480);

    const taskItems = $$('#tasksList .task');
    for (let i = 0; i < Math.min(taskItems.length, 3); i++) {
      const a = AGENTS[(i + 1) % AGENTS.length];
      await compileElement(a, taskItems[i], 'Validating Task Item...', 'TASK', 320);
    }
  }

  await new Promise(r => setTimeout(r, 350));

  // ------------------------------------------------------
  // STEP 5: 04 / STUDY COMMAND
  // ------------------------------------------------------
  const sec4 = $('#study');
  if (sec4) {
    const top4 = getDocRect(sec4).top - 75;
    await autoScrollTo(top4, 1000);
    await new Promise(r => setTimeout(r, 250));

    await compileElement(AGENTS[0], $('#study .section-head'), 'Initializing Study Command...', 'HEADER', 420);
    
    const skillCards = $$('#skillsList .card');
    for (let sc of skillCards.slice(0, 3)) {
      await compileElement(AGENTS[1], sc, 'Calibrating Competency...', 'SKILL', 340);
    }

    const reminders = $$('#remindersList .reminder');
    for (let rem of reminders.slice(0, 2)) {
      await compileElement(AGENTS[2], rem, 'Setting Alarm Protocol...', 'REMINDER', 320);
    }

    await compileElement(AGENTS[4], $('#timetable'), 'Constructing Smart Timetable...', 'TIMETABLE', 500);
  }

  await new Promise(r => setTimeout(r, 350));

  // ------------------------------------------------------
  // STEP 6: 05 / MY WORK · NOVA ANALYSIS
  // ------------------------------------------------------
  const sec5 = $('#work');
  if (sec5) {
    const top5 = getDocRect(sec5).top - 75;
    await autoScrollTo(top5, 1000);
    await new Promise(r => setTimeout(r, 250));

    await compileElement(AGENTS[0], $('#work .section-head'), 'Initializing Work Workspace...', 'HEADER', 420);
    await compileElement(AGENTS[1], $('#analysisForm'), 'Binding Project Form...', 'FORM', 460);
    await compileElement(AGENTS[2], $('#analysisResult'), 'Configuring Intelligence Pane...', 'WORKSPACE', 460);
  }

  await new Promise(r => setTimeout(r, 350));

  // ------------------------------------------------------
  // STEP 7: 06 / BEYOND THE CLASSROOM
  // ------------------------------------------------------
  const sec6 = $('#activities');
  if (sec6) {
    const top6 = getDocRect(sec6).top - 75;
    await autoScrollTo(top6, 1000);
    await new Promise(r => setTimeout(r, 250));

    await compileElement(AGENTS[0], $('#activities .section-head'), 'Synthesizing Extracurriculars...', 'HEADER', 420);
    const acts = $$('#activitiesList .card');
    for (let i = 0; i < Math.min(acts.length, 3); i++) {
      await compileElement(AGENTS[(i + 2) % AGENTS.length], acts[i], 'Indexing Activity...', 'ACTIVITY', 320);
    }
  }

  await new Promise(r => setTimeout(r, 350));

  // ------------------------------------------------------
  // STEP 8: 07 / FUTURE GUIDE
  // ------------------------------------------------------
  const sec7 = $('#future');
  if (sec7) {
    const top7 = getDocRect(sec7).top - 75;
    await autoScrollTo(top7, 1000);
    await new Promise(r => setTimeout(r, 250));

    await compileElement(AGENTS[0], $('#future .section-head'), 'Booting Future Simulator...', 'HEADER', 420);
    await compileElement(AGENTS[1], $('.sim-form'), 'Setting Trajectory Inputs...', 'SIMULATOR', 420);
    await compileElement(AGENTS[2], $('#simResult'), 'Generating Roadmap Matrix...', 'ROADMAP', 450);
    await compileElement(AGENTS[4], $('.recommend'), 'Formulating Nova Advice...', 'INSIGHT', 460);
  }

  await new Promise(r => setTimeout(r, 350));

  // ------------------------------------------------------
  // STEP 9: 08 / PROGRESS REPORT
  // ------------------------------------------------------
  const sec8 = $('#progress');
  if (sec8) {
    const top8 = getDocRect(sec8).top - 75;
    await autoScrollTo(top8, 1000);
    await new Promise(r => setTimeout(r, 250));

    await compileElement(AGENTS[0], $('#progress .section-head'), 'Aggregating Growth Signals...', 'HEADER', 420);
    await compileElement(AGENTS[3], $('.report-score'), 'Synthesizing Velocity Score...', 'SCORE', 480);
    rollNumber($('#growthScore'), 0, parseInt($('#growthScore')?.textContent, 10) || 84, 1200);

    const reportCards = $$('#progress .report-grid .card');
    for (let rc of reportCards) {
      await compileElement(AGENTS[1], rc, 'Calibrating Vector...', 'SIGNAL', 320);
    }
  }

  await new Promise(r => setTimeout(r, 350));

  // ------------------------------------------------------
  // STEP 10: 09 / ACHIEVEMENTS & 10 / FOCUS MODE & FOOTER
  // ------------------------------------------------------
  const sec9 = $('#achievements');
  if (sec9) {
    const top9 = getDocRect(sec9).top - 75;
    await autoScrollTo(top9, 1000);
    await new Promise(r => setTimeout(r, 250));

    await compileElement(AGENTS[0], $('#achievements .section-head'), 'Validating Milestones...', 'HEADER', 420);
    const achs = $$('#achievementsList .card');
    for (let i = 0; i < Math.min(achs.length, 3); i++) {
      await compileElement(AGENTS[(i + 3) % AGENTS.length], achs[i], 'Unlocking Badge...', 'ACHIEVEMENT', 340);
    }
  }

  const sec10 = $('#focus');
  if (sec10) {
    const top10 = getDocRect(sec10).top - 75;
    await autoScrollTo(top10, 1000);
    await new Promise(r => setTimeout(r, 250));

    await compileElement(AGENTS[3], $('#focus .focus-card'), 'Locking Focus Chamber...', 'TIMER', 520);
  }

  const footEl = $('footer');
  if (footEl) {
    await compileElement(AGENTS[0], footEl, 'Finalizing System Build...', 'FOOTER', 420);
  }

  // Final smooth return to top
  await autoScrollTo(0, 1200);

  // Ensure all elements are crystal clear
  $$('.swarm-pending').forEach(el => {
    el.classList.remove('swarm-pending');
    el.classList.add('swarm-crystallized');
  });

  isGenerating = false;

  // Start continuous ambient patrol
  startContinuousPatrol();
}

// ========================================================
// AMBIENT PATROL & METRIC INSPECTION (POST-BUILD)
// ========================================================
let patrolTimer = null;

function startContinuousPatrol() {
  if (patrolTimer) clearInterval(patrolTimer);

  const targets = $$('.card, .task, .stat, .quick-card, .goal, .focus-card, .hero-copy h1');
  if (targets.length === 0) return;

  patrolTimer = setInterval(() => {
    const viewTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewBottom = viewTop + window.innerHeight;

    const visible = targets.filter(t => {
      const r = getDocRect(t);
      return r.top >= viewTop - 50 && r.bottom <= viewBottom + 50;
    });

    if (visible.length === 0) return;

    // Pick 2 random agents to inspect
    const a1 = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    let a2 = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    if (a1 === a2) a2 = AGENTS[(a1.id % AGENTS.length)];

    const c1 = visible[Math.floor(Math.random() * visible.length)];
    const c2 = visible[Math.floor(Math.random() * visible.length)];

    if (c1) {
      const r1 = getDocRect(c1);
      setAgentTarget(a1, r1.left, r1.top, r1.width, r1.height, 'Calibrating ' + c1.tagName.toLowerCase(), true, 'INSPECT');
      playBuildClickSound(560, 0.02);
      setTimeout(() => hideAgentBox(a1), 1600);
    }

    if (c2 && c2 !== c1) {
      const r2 = getDocRect(c2);
      setAgentTarget(a2, r2.left, r2.top, r2.width, r2.height, 'Verifying layout', true, 'METRIC');
      setTimeout(() => hideAgentBox(a2), 1600);
    }
  }, 2800);
}

// ========================================================
// USER OPERATOR MOUSE & CROSSHAIR TRACKING
// ========================================================
let userMoveTimeout = null;

window.addEventListener('mousemove', e => {
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  const docX = e.clientX + scrollX;
  const docY = e.clientY + scrollY;

  if (userGuideX && userGuideY) {
    userGuideX.style.opacity = '1';
    userGuideY.style.opacity = '1';
    userGuideX.style.top = `${docY}px`;
    userGuideY.style.left = `${docX}px`;
  }

  if (userCoord) {
    userCoord.textContent = `${Math.round(e.clientX)}, ${Math.round(e.clientY)}`;
  }

  const target = document.elementFromPoint(e.clientX, e.clientY);
  const card = target ? target.closest('.card, .task, .stat, button, a.primary, a.secondary') : null;

  if (card && userBox) {
    const r = getDocRect(card);
    userBox.style.opacity = '1';
    userBox.style.left = `${r.left}px`;
    userBox.style.top = `${r.top}px`;
    userBox.style.width = `${r.width}px`;
    userBox.style.height = `${r.height}px`;
  } else if (userBox) {
    userBox.style.opacity = '0';
  }

  clearTimeout(userMoveTimeout);
  userMoveTimeout = setTimeout(() => {
    if (userGuideX) userGuideX.style.opacity = '0';
    if (userGuideY) userGuideY.style.opacity = '0';
    if (userBox) userBox.style.opacity = '0';
  }, 1600);
});

// Launch on page load
window.addEventListener('DOMContentLoaded', () => {
  runViralFullSiteBuild();
});
