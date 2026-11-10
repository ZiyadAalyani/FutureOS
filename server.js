require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database/db");

const app = express();
let PORT = parseInt(process.env.PORT, 10) || 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

const clamp = (n) => Math.max(0, Math.min(100, Number(n) || 0));

// Base Health & System Routes
app.get("/api/health", (_, r) => r.json({ ok: true, app: "FutureOS", version: "2.0", intelligence: "deep-reasoning" }));
app.get("/api/profile", (_, r) => r.json(db.profile));
app.put("/api/profile", (q, r) => {
  let b = q.body || {};
  r.json(db.setProfile({
    name: b.name || "Future Builder",
    goal: b.goal || "",
    level: b.level || "Beginner",
    study_hours: Number(b.study_hours) || 1
  }));
});

// Goals API
app.get("/api/goals", (_, r) => r.json(db.getGoals()));
app.post("/api/goals", (q, r) => {
  let b = q.body || {};
  if (!b.title) return r.status(400).json({ error: "Goal title is required." });
  r.json(db.addGoal({ title: b.title, description: b.description || "", target_date: b.target_date || "" }));
});
app.patch("/api/goals/:id", (q, r) => {
  let x = db.updateGoal(q.params.id, { progress: clamp(q.body.progress), completed: q.body.completed ? 1 : 0 });
  if (!x) return r.status(404).json({ error: "Goal not found." });
  r.json(x);
});

// Tasks API
app.get("/api/tasks", (_, r) => r.json(db.getTasks()));
app.post("/api/tasks", (q, r) => {
  let b = q.body || {};
  if (!b.title) return r.status(400).json({ error: "Task title is required." });
  r.json(db.addTask({ title: b.title, category: b.category || "General", due_date: b.due_date || "", priority: b.priority || "Medium" }));
});
app.patch("/api/tasks/:id", (q, r) => {
  let x = db.updateTask(q.params.id, { completed: q.body.completed ? 1 : 0 });
  if (!x) return r.status(404).json({ error: "Task not found." });
  r.json(x);
});

// Skills API
app.get("/api/skills", (_, r) => r.json(db.getSkills()));
app.patch("/api/skills/:id", (q, r) => {
  let x = db.updateSkill(q.params.id, { progress: clamp(q.body.progress) });
  if (!x) return r.status(404).json({ error: "Skill not found." });
  r.json(x);
});

// Achievements API
app.get("/api/achievements", (_, r) => r.json(db.getAchievements()));

// Reminders API
app.get("/api/reminders", (_, r) => r.json(db.getReminders()));
app.post("/api/reminders", (q, r) => {
  let b = q.body || {};
  if (!b.title || !b.time) return r.status(400).json({ error: "Reminder title and time are required." });
  r.json(db.addReminder({ title: b.title, time: b.time, days: b.days || "Daily", type: b.type || "Study" }));
});
app.patch("/api/reminders/:id", (q, r) => r.json(db.updateReminder(q.params.id, { enabled: q.body.enabled ? 1 : 0 })));

// Timetable API
app.get("/api/timetable", (_, r) => r.json(db.getTimetable()));
app.post("/api/timetable", (q, r) => {
  let b = q.body || {};
  if (!b.day || !b.time || !b.subject) return r.status(400).json({ error: "Day, time and subject are required." });
  r.json(db.addTimetable({ day: b.day, time: b.time, subject: b.subject, category: b.category || "Study" }));
});

// Extracurricular API
app.get("/api/extracurricular", (_, r) => r.json(db.getActivities()));
app.post("/api/extracurricular", (q, r) => {
  let b = q.body || {};
  if (!b.title) return r.status(400).json({ error: "Activity name is required." });
  r.json(db.addActivity({ title: b.title, category: b.category || "Other", progress: clamp(b.progress) }));
});

// Focus API
app.get("/api/focus/total", (_, r) => r.json({ total: db.focusTotal() }));
app.post("/api/focus", (q, r) => r.json({ ok: true, totalMinutes: db.addFocus(Math.max(0, Number(q.body.minutes) || 0)) }));

// Planning Simulator API
app.post("/api/simulator", (q, r) => {
  let b = q.body || {}, h = Math.max(.5, Number(b.hours) || 1);
  let base = b.level === "Advanced" ? 30 : b.level === "Intermediate" ? 20 : 10;
  let p = Math.min(95, base + h * 8);
  r.json({
    goal: b.goal || "Your Goal",
    roadmap: [
      ['Phase 1', 'Foundation Architecture', p + 15],
      ['Phase 2', 'Core Execution & Tooling', p + 5],
      ['Phase 3', 'Real-World Production Systems', p - 5],
      ['Phase 4', 'Ecosystem Mastery & Impact', p - 15]
    ].map(x => ({
      year: x[0],
      title: x[1],
      progress: Math.round(Math.max(0, Math.min(100, x[2])))
    })),
    note: "AI Planning Simulation — dynamic trajectory based on your velocity."
  });
});

// Project Analyzer API
app.post("/api/analyze-project", (q, r) => {
  let b = q.body || {};
  let t = String(b.description || '').trim();
  let stack = String(b.stack || '').trim();
  let features = String(b.features || '').trim();
  if (!t) return r.status(400).json({ error: "Describe your project first." });
  
  let words = t.split(/\s+/).filter(Boolean).length;
  let score = Math.round(Math.min(100, 35 + Math.min(25, words / 4) + (stack ? 20 : 0) + (features ? 15 : 0)));
  let s = [];
  if (!stack) s.push('Document the architecture and full tech stack explicitly.');
  if (!features) s.push('Define core differentiators and user experience workflows.');
  if (!/database|api|backend|server/i.test(t)) s.push('Clarify data persistence, cache layers, and real-time synchronization.');
  if (!/responsive|mobile|accessib/i.test(t)) s.push('Audit responsive layout break-points and fluid interaction physics.');
  if (!s.length) s.push('Implement end-to-end telemetry, automated test suites, and zero-downtime deployment.');
  
  r.json({
    score,
    summary: `Project specification evaluated: ${words} words analyzed${stack ? ` across ${stack.split(',').length} tech layers` : ''}.`,
    strengths: [
      'High-clarity value proposition and purpose',
      'Strong fit for high-cadence iterative execution',
      stack ? `Cohesive modern technology stack: ${stack}` : 'Solid conceptual foundation ready for architecture definition'
    ],
    suggestions: s,
    nextStep: score >= 80 
      ? 'Construct an interactive prototype and benchmark end-to-end performance.'
      : 'Flesh out core subsystem interfaces and execute the highest-priority architectural milestone.'
  });
});

// Autonomous Highly-Intelligent Nova AI Engine with Deep Reasoning & Tool Calling
app.post("/api/chat", async (q, r) => {
  let msg = String(q.body.message || '').trim();
  if (!msg) return r.status(400).json({ error: 'Message is required.' });

  let p = db.profile;
  let goals = db.getGoals();
  let tasks = db.getTasks().filter(x => !x.completed);
  let skills = db.getSkills();

  // If remote OpenAI / Gemini-compatible endpoint is configured, use it
  if (process.env.AI_API_URL && process.env.AI_API_KEY && process.env.AI_MODEL) {
    try {
      let z = await fetch(process.env.AI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL,
          messages: [
            {
              role: 'system',
              content: `You are Nova, an ultra-intelligent AI partner and engineering mentor inside FutureOS.
Provide thoughtful, high-level analysis, practical guidance, and deep reasoning.
Current User Profile:
- Name: ${p.name}
- Mission/Goal: ${p.goal || 'Not specified'}
- Mastery Level: ${p.level}
- Target Velocity: ${p.study_hours} hrs/day
- Active Goals: ${goals.map(g => g.title).join(', ') || 'None'}
- Open Tasks: ${tasks.map(t => t.title).join(', ') || 'None'}`
            },
            { role: 'user', content: msg }
          ]
        })
      });
      let d = await z.json();
      return r.json({
        reply: d.choices?.[0]?.message?.content || 'Intelligence stream delivered.',
        mode: 'ai'
      });
    } catch (e) {
      console.error("Remote AI error, using local reasoning engine:", e.message);
    }
  }

  // Built-in Deep Reasoning & Tool Engine
  let lower = msg.toLowerCase();
  let executedTools = [];
  let thoughtTrace = [];

  thoughtTrace.push(`User input received: "${msg}"`);
  thoughtTrace.push(`Inspecting user profile: name="${p.name}", goal="${p.goal || 'unspecified'}", velocity=${p.study_hours}h/day.`);
  thoughtTrace.push(`Evaluating active tasks (${tasks.length}) and tracked skills (${skills.length}).`);

  // Autonomous Tool: Add Task
  let taskMatch = msg.match(/(?:add|create|new)\s+task(?:\s*:\s*|\s+to\s+|\s+["']?)([^"'\n]+)/i);
  if (taskMatch && !lower.includes('how to')) {
    let taskTitle = taskMatch[1].replace(/["']/g, '').trim();
    if (taskTitle) {
      thoughtTrace.push(`Detected task creation intent: "${taskTitle}". Invoking db.addTask.`);
      let created = db.addTask({ title: taskTitle, category: "Action", priority: "High" });
      executedTools.push({ tool: "addTask", title: created.title, id: created.id });
    }
  }

  // Autonomous Tool: Add Goal
  let goalMatch = msg.match(/(?:add|set|create)\s+goal(?:\s*:\s*|\s+to\s+|\s+["']?)([^"'\n]+)/i);
  if (goalMatch && !taskMatch) {
    let goalTitle = goalMatch[1].replace(/["']/g, '').trim();
    if (goalTitle) {
      thoughtTrace.push(`Detected goal creation intent: "${goalTitle}". Invoking db.addGoal.`);
      let created = db.addGoal({ title: goalTitle, description: "Synthesized by Nova intelligence." });
      executedTools.push({ tool: "addGoal", title: created.title, id: created.id });
    }
  }

  // Autonomous Tool: Log Focus
  let focusMatch = msg.match(/(?:log|add|record)\s+(\d+)\s*(?:min|minutes|mins)\s*(?:of\s*)?focus/i);
  if (focusMatch) {
    let mins = parseInt(focusMatch[1], 10);
    thoughtTrace.push(`Detected focus logging intent: ${mins} minutes. Invoking db.addFocus.`);
    let newTotal = db.addFocus(mins);
    executedTools.push({ tool: "addFocus", minutes: mins, totalMinutes: newTotal });
  }

  // Intelligent Synthesis
  let reply = "";
  let weakestSkill = [...skills].sort((a, b) => a.progress - b.progress)[0];

  if (executedTools.length > 0) {
    thoughtTrace.push(`Execution completed for ${executedTools.length} tool(s). Formatting confirmation & next steps.`);
    reply += `### ✦ Action Executed Successfully\n\n`;
    for (let t of executedTools) {
      if (t.tool === 'addTask') reply += `* **Task Created:** \`${t.title}\` (Priority: High)\n`;
      if (t.tool === 'addGoal') reply += `* **Goal Tracked:** \`${t.title}\`\n`;
      if (t.tool === 'addFocus') reply += `* **Focus Logged:** \`${t.minutes} minutes\` (Total Focus: ${t.totalMinutes} min)\n`;
    }
    reply += `\nYour dashboard and workspace have been refreshed in real time.\n\n`;
  }

  if (lower.includes('project') || lower.includes('build') || lower.includes('code') || lower.includes('app') || lower.includes('software')) {
    thoughtTrace.push("Synthesizing architectural guidance for software project.");
    reply += `### ✦ Strategic Engineering Blueprint\n\n` +
      `To engineer a production-grade system that stands out:\n\n` +
      `1. **System Architecture & Core Invariants**\n` +
      `   - Decouple your state machines from UI presentation.\n` +
      `   - Design predictable client-server protocols with typed schemas and automated validation.\n\n` +
      `2. **Reactive Execution & Performance**\n` +
      `   - Keep DOM mutations batched via requestAnimationFrame.\n` +
      `   - Leverage hardware-accelerated transforms for 60fps micro-animations.\n\n` +
      `3. **Immediate Next Milestone**\n` +
      `   - Check your **05 / My Work** analyzer below to benchmark your specification against industry standards.`;
  } else if (lower.includes('plan') || lower.includes('week') || lower.includes('schedule') || lower.includes('today')) {
    thoughtTrace.push("Synthesizing high-leverage time management & weekly schedule.");
    let topTask = tasks[0] ? tasks[0].title : "Define your primary objective for this sprint";
    reply += `### ✦ High-Leverage Sprint Plan\n\n` +
      `Based on your current velocity target (**${p.study_hours} hours/day**):\n\n` +
      `* **Primary Focus Anchor:** ${topTask}\n` +
      `* **Deep Work Rhythm:** Schedule two 50-minute Pomodoro blocks with 10-minute active recovery.\n` +
      `* **Skill Fortification:** Allocate 30 minutes to **${weakestSkill ? weakestSkill.name : 'System Architecture'}** (current mastery: ${weakestSkill ? weakestSkill.progress : 40}%).\n` +
      `* **Evening Reflection:** Review open tasks and clear blockers before shutdown.`;
  } else if (lower.includes('skill') || lower.includes('learn') || lower.includes('master')) {
    thoughtTrace.push("Synthesizing accelerated learning protocol.");
    reply += `### ✦ Accelerated Mastery Protocol\n\n` +
      `Effective learning follows a tight feedback loop:\n\n` +
      `1. **Concept Deconstruction (20%):** Learn just enough mental models to start building.\n` +
      `2. **Active Stress-Testing (60%):** Write real code, break implementations, and inspect stack traces.\n` +
      `3. **Public Artifact Creation (20%):** Document your findings into a reusable module or article.\n\n` +
      `*Recommendation:* Target **${weakestSkill ? weakestSkill.name : 'Core Fundamentals'}** first to unlock compounding progress across adjacent skills.`;
  } else if (lower.includes('future') || lower.includes('career') || lower.includes('roadmap') || lower.includes('job')) {
    thoughtTrace.push("Synthesizing long-term career roadmap.");
    reply += `### ✦ Backward-Chained Career Architecture\n\n` +
      `To reach the frontier of your field (**${p.goal || 'Senior Builder & Architect'}**):\n\n` +
      `* **T-Shaped Profile:** Maintain broad fluency in full-stack engineering while mastering one niche deeply (e.g. autonomous agent swarms, distributed systems, or high-performance graphics).\n` +
      `* **Proof of Work Over Credentials:** A live, beautifully designed interactive experience beats 10 generic resume bullets.\n` +
      `* **Run Simulations:** Head to **07 / Future Guide** to simulate milestone progression based on your study cadence.`;
  } else if (lower.includes('who are you') || lower.includes('what can you do') || lower.includes('help')) {
    thoughtTrace.push("Explaining Nova agent capabilities.");
    reply += `### ✦ I am Nova — Your Autonomous Engineering Co-Pilot\n\n` +
      `I am built directly into FutureOS to elevate your velocity. I can:\n\n` +
      `* **Take Autonomous Action:** Create tasks (\`add task: Finish API\`), set goals (\`add goal: Master TypeScript\`), and log focus time (\`log 25 mins focus\`).\n` +
      `* **Analyze Architecture:** Critique projects, evaluate tech stacks, and identify architectural gaps.\n` +
      `* **Strategize & Plan:** Formulate optimal weekly study rhythms and milestone roadmaps.\n` +
      `* **Reason in Real-Time:** Inspect your living state and prioritize your single highest-leverage next move.`;
  } else {
    thoughtTrace.push("Synthesizing contextual advice for general inquiry.");
    let nextAction = tasks[0] ? `"${tasks[0].title}"` : "establishing your first high-priority task";
    reply += `### ✦ Analysis & Strategic Insight\n\n` +
      `I have evaluated your workspace state:\n\n` +
      `* **Current Mission:** *${p.goal || 'Personal Operating System Optimization'}*\n` +
      `* **Highest-Leverage Next Step:** Focus energy on ${nextAction}.\n` +
      `* **Cognitive Velocity:** Target ${p.study_hours} daily hours of uninterrupted focus.\n\n` +
      `Tell me what you're designing or need broken down, or command me directly (e.g., *"add task: Implement neural search"*).`;
  }

  // Format thinking trace into response
  let thinkingBlock = `<think>\n${thoughtTrace.join('\n')}\n</think>\n\n`;
  r.json({
    reply: thinkingBlock + reply,
    mode: 'intelligent-engine',
    toolsExecuted: executedTools
  });
});

app.get('*', (_, r) => r.sendFile(path.join(__dirname, 'public', 'index.html')));

function startServer(portToTry) {
  let server = app.listen(portToTry, () => {
    console.log(`✦ FutureOS running at http://localhost:${portToTry}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${portToTry} in use, trying ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error("Server error:", err);
    }
  });
}

// Start server if run directly (local development)
if (require.main === module && !process.env.VERCEL) {
  startServer(PORT);
}

// Export for Vercel Serverless
module.exports = app;
