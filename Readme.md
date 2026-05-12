# Project Team Scheduler

Project Team Scheduler is a full-stack scheduling app for assigning evaluation slots to student teams while respecting faculty availability, faculty buffers, and student conflict rules.

The frontend is a React/Vite app for logging in, entering faculty and team data, previewing a schedule, and confirming it for saving. The backend is a FastAPI service that generates schedules from the submitted constraints.

## Features

- Faculty login and protected dashboard
- Faculty availability form with time window, batch, and buffer inputs
- Team entry with multiple students per team and per-team duration
- Schedule preview before saving
- Confirm-and-save flow for persisting a generated schedule in memory
- Export-oriented frontend dependencies for PDF and spreadsheet workflows

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: FastAPI, Pydantic
- Utilities: jsPDF, jsPDF-AutoTable, XLSX

## Project Structure

- `backend/` - FastAPI app and scheduling engine
- `frontend/` - Vite React app
- `backend/scheduler/` - Scheduling models, engine, and helper logic

## Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer

## Setup

### 1. Start the backend

From the project root:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn pydantic
uvicorn main: app --reload
```

The API will run at `http://127.0.0.1:8000`.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will run on the Vite dev server, usually at `http://localhost:5173`.

## How It Works

1. Log in through the frontend.
2. Enter faculty availability, batch, and buffer details.
3. Add one or more teams and their student enrollment IDs.
4. Preview the generated schedule.
5. Confirm and save the schedule if the preview looks correct.

## Scheduling Rules

The backend scheduler uses these rules:

- Student count, largest first sort teams.
- Slots are generated from the faculty time window using the team duration and faculty buffer.
- A team cannot be scheduled if it overlaps with another evaluation for the same faculty.
- A student cannot have overlapping evaluations.
- A student must keep at least a 30-minute gap between evaluations.
- Unassigned teams are returned in an `unscheduled` list.

## API

### `POST /schedule`

Request body:

```json
{
	"faculty_id": "FAC001",
	"start_time": "2026-05-07T09:00:00",
	"end_time": "2026-05-07T17:00:00",
	"buffer": 5,
	"batch": "2026",
	"save": false,
	"teams": [
		{
			"team_id": "T1",
			"students": ["ENR001", "ENR002"],
			"duration": 20
		}
	]
}
```

Response fields:

- `mode`: `preview` or `saved`
- `schedule`: scheduled team entries with start and end times
- `unscheduled`: team IDs that could not be assigned

## Notes

- The backend currently stores schedules in memory only. Restarting the server clears saved data.
- Student enrollment IDs are normalised to uppercase by the scheduler.
- If you add backend dependency files later, update the setup section to use them directly.
- The Enrollment Number is the primary key for finding any clash.
