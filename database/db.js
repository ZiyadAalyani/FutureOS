const fs = require("fs");
const path = require("path");

const initial = {
  profile: { id: 1, name: "Future Builder", goal: "Become an AI Engineer", level: "Beginner", study_hours: 2 },
  goals: [],
  tasks: [
    { id: 1, title: "Practice JavaScript for 30 minutes", category: "Coding", due_date: "Today", priority: "High", completed: 0 },
    { id: 2, title: "Read one technical article", category: "Learning", due_date: "Today", priority: "Medium", completed: 0 },
    { id: 3, title: "Work on a mini project", category: "Project", due_date: "Tomorrow", priority: "High", completed: 0 }
  ],
  skills: [
    { id: 1, name: "Programming", category: "Technical", progress: 35 },
    { id: 2, name: "Artificial Intelligence", category: "Technical", progress: 15 },
    { id: 3, name: "Communication", category: "Personal", progress: 55 },
    { id: 4, name: "Problem Solving", category: "Core", progress: 40 },
    { id: 5, name: "Business", category: "Career", progress: 20 },
    { id: 6, name: "Leadership", category: "Personal", progress: 25 }
  ],
  achievements: [
    { id: 1, title: "First Step", description: "Create your first goal", unlocked: 0 },
    { id: 2, title: "Focused", description: "Complete a focus session", unlocked: 0 },
    { id: 3, title: "Skill Builder", description: "Reach 50% in a skill", unlocked: 0 },
    { id: 4, title: "Future Builder", description: "Set a career goal", unlocked: 1 },
    { id: 5, title: "Planner", description: "Create your first timetable", unlocked: 0 },
    { id: 6, title: "Consistent", description: "Complete 5 tasks", unlocked: 0 }
  ],
  focus_sessions: [],
  reminders: [
    { id: 1, title: "Morning study session", time: "07:00", days: "Mon–Fri", type: "Study", enabled: 1 },
    { id: 2, title: "Review today's progress", time: "21:00", days: "Daily", type: "Progress", enabled: 1 }
  ],
  timetable: [
    { id: 1, day: "Monday", time: "18:00", subject: "Programming", category: "Study" },
    { id: 2, day: "Tuesday", time: "18:00", subject: "Mathematics", category: "Study" },
    { id: 3, day: "Wednesday", time: "17:30", subject: "AI / ML", category: "Study" },
    { id: 4, day: "Thursday", time: "18:00", subject: "Communication", category: "Study" },
    { id: 5, day: "Friday", time: "18:00", subject: "Project Work", category: "Project" }
  ],
  activities: [
    { id: 1, title: "Public speaking", category: "Communication", progress: 30 },
    { id: 2, title: "Football / fitness", category: "Sports", progress: 45 },
    { id: 3, title: "Design & creativity", category: "Creative", progress: 25 }
  ]
};

const dataDir = process.env.VERCEL ? "/tmp" : __dirname;
const file = path.join(dataDir, "futureos-data.json");
const sourceFile = path.join(__dirname, "futureos-data.json");

let d = { ...initial };

try {
  if (fs.existsSync(file)) {
    d = JSON.parse(fs.readFileSync(file, "utf8"));
  } else if (fs.existsSync(sourceFile)) {
    d = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
    try { fs.writeFileSync(file, JSON.stringify(d, null, 2)); } catch (_) {}
  } else {
    try { fs.writeFileSync(file, JSON.stringify(initial, null, 2)); } catch (_) {}
  }
} catch (_) {
  d = { ...initial };
}

const save = () => {
  try {
    fs.writeFileSync(file, JSON.stringify(d, null, 2));
  } catch (_) {
    // In-memory fallback if disk is read-only
  }
};

const nid = a => (a && a.length ? Math.max(...a.map(x => +x.id || 0)) + 1 : 1);

function arr(k) {
  return {
    get: () => d[k] || [],
    add: x => {
      if (!d[k]) d[k] = [];
      let n = { id: nid(d[k]), ...x };
      d[k].push(n);
      save();
      return n;
    },
    update: (i, p) => {
      if (!d[k]) return null;
      let x = d[k].find(item => item.id == i);
      if (!x) return null;
      Object.assign(x, p);
      save();
      return x;
    }
  };
}

module.exports = {
  get profile() { return d.profile || initial.profile; },
  setProfile: p => {
    d.profile = { ...(d.profile || initial.profile), ...p };
    save();
    return d.profile;
  },
  getGoals: () => d.goals || [],
  addGoal: arr('goals').add,
  updateGoal: arr('goals').update,
  getTasks: () => d.tasks || [],
  addTask: arr('tasks').add,
  updateTask: arr('tasks').update,
  getSkills: () => d.skills || [],
  updateSkill: arr('skills').update,
  getAchievements: () => d.achievements || [],
  getReminders: () => d.reminders || [],
  addReminder: arr('reminders').add,
  updateReminder: arr('reminders').update,
  getTimetable: () => d.timetable || [],
  addTimetable: arr('timetable').add,
  getActivities: () => d.activities || [],
  addActivity: arr('activities').add,
  addFocus: m => {
    if (!d.focus_sessions) d.focus_sessions = [];
    d.focus_sessions.push({ id: nid(d.focus_sessions), minutes: m, created_at: new Date().toISOString() });
    save();
    return d.focus_sessions.reduce((a, x) => a + +x.minutes, 0);
  },
  focusTotal: () => (d.focus_sessions || []).reduce((a, x) => a + +x.minutes, 0)
};
