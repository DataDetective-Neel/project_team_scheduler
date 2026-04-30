from datetime import datetime

class Student:
    def __init__(self, enrollment_id):
        self.id = enrollment_id.strip().upper()

class Team:
    def __init__(self, team_id, students, faculty_id, duration):
        self.team_id = team_id
        self.students = [Student(s) for s in students]
        self.faculty_id = faculty_id
        self.duration = duration  # minutes

class Faculty:
    def __init__(self, faculty_id, start_time, end_time, buffer, batch):
        self.faculty_id = faculty_id
        self.start_time = start_time
        self.end_time = end_time
        self.buffer = buffer
        self.batch = batch  