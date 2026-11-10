# FutureOS Ultimate 2.0

Premium personal-development platform with a cursor-reactive living background, dashboard, goals, tasks, study skills, reminders, smart timetable, project analysis, extracurriculars, future guide, recommendations, progress report, achievements, focus mode and Nova assistant.

## Run
1. Extract this ZIP.
2. Open Command Prompt in the FutureOS folder.
3. If needed: `rmdir /s /q node_modules`
4. Run `npm install`
5. Run `npm start`
6. Open `http://localhost:3000`

No Visual Studio/native SQLite compiler is required. Data is stored in `database/futureos-data.json`.

## Nova
Nova works immediately in local mode. To connect a real AI provider, copy `.env.example` to `.env` and add server-side AI settings. Never put an API key in `public/`.
