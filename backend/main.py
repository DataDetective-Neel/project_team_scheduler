from fastapi import FastAPI
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


@app.post("/schedule")
def create_schedule(request: ScheduleRequest):
    global student_schedule_db, faculty_schedule_db

    batch = request.batch

    # Initialize batch if not present
    if batch not in student_schedule_db:
        student_schedule_db[batch] = {}
    if batch not in faculty_schedule_db:
        faculty_schedule_db[batch] = {}

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
        student_schedule_db[batch],
        faculty_schedule_db[batch]
    )

    # Save back
    student_schedule_db[batch] = updated_student
    faculty_schedule_db[batch] = updated_faculty

    return {
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