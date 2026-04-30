from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime

from scheduler.models import Team, Faculty
from scheduler.engine import schedule_teams

app = FastAPI()

# In-memory storage (temporary)
student_schedule_db = {}
faculty_schedule_db = {}


class TeamInput(BaseModel):
    team_id: str
    students: List[str]
    duration: int


class ScheduleRequest(BaseModel):
    faculty_id: str
    start_time: datetime
    end_time: datetime
    buffer: int
    batch: str
    teams: List[TeamInput]
    save: bool = False  

@app.post("/schedule")
def create_schedule(request: ScheduleRequest):
    global student_schedule_db, faculty_schedule_db

    if request.start_time >= request.end_time:
        raise HTTPException(status_code=400, detail="start_time must be earlier than end_time")

    if request.buffer < 0:
        raise HTTPException(status_code=400, detail="buffer must be zero or greater")

    if not request.teams:
        return {
            "mode": "saved" if request.save else "preview",
            "schedule": [],
            "unscheduled": []
        }

    batch = request.batch

    # Initialize batch if not present
    if batch not in student_schedule_db:
        student_schedule_db[batch] = {}
    if batch not in faculty_schedule_db:
        faculty_schedule_db[batch] = {}

    # 👇 COPY schedules (important for preview)
    temp_student = {k: v[:] for k, v in student_schedule_db[batch].items()}
    temp_faculty = {k: v[:] for k, v in faculty_schedule_db[batch].items()}

    faculty = Faculty(
        request.faculty_id,
        request.start_time,
        request.end_time,
        request.buffer,
        batch
    )

    teams = [
        Team(t.team_id, t.students, request.faculty_id, t.duration)
        for t in request.teams
    ]

    schedule, unscheduled, updated_student, updated_faculty = schedule_teams(
        teams,
        faculty,
        temp_student,
        temp_faculty
    )

    # 👇 Only save if confirmed
    if request.save:
        student_schedule_db[batch] = updated_student
        faculty_schedule_db[batch] = updated_faculty

    return {
        "mode": "saved" if request.save else "preview",
        "schedule": [
            {
                "team": t[0],
                "faculty": t[1],
                "start": t[2],
                "end": t[3]
            }
            for t in schedule
        ],
        "unscheduled": unscheduled
    }

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)