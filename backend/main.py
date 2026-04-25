from datetime import datetime
from scheduler.models import Team, Faculty
from scheduler.engine import schedule_teams


#Just testing the brain

faculty = Faculty(
    "F1",
    datetime(2026, 4, 23, 10, 30),
    datetime(2026, 4, 23, 17, 30),
    5
)

teams = [
    Team("T1", ["BT24GCS001", "BT24GCS002"], "F1", 30),
    Team("T2", ["BT24GCS002", "BT24GCS003"], "F1", 30),
]

schedule, unscheduled = schedule_teams(teams, faculty)

print(schedule)
print("Unscheduled:", unscheduled)