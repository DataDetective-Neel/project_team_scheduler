from datetime import timedelta
#Slot generation and validation logic
def generate_slots(start_time, end_time, duration, buffer):
    slots = []
    current = start_time

    while current + timedelta(minutes=duration) <= end_time:
        slot_end = current + timedelta(minutes=duration)
        slots.append((current, slot_end))
        current = slot_end + timedelta(minutes=buffer)

    return slots

#Constraint checks
def is_overlap(s1, e1, s2, e2):
    return s1 < e2 and s2 < e1


def is_valid_assignment(team, slot, student_schedule, faculty_schedule):
    start, end = slot

    # Faculty check
    for f_start, f_end in faculty_schedule.get(team.faculty_id, []):
        if is_overlap(start, end, f_start, f_end):
            return False

    # Student check
    for student in team.students:
        sid = student.id

        for s_start, s_end in student_schedule.get(sid, []):
            # overlap
            if is_overlap(start, end, s_start, s_end):
                return False

            # 30 min buffer
            if start < s_end + timedelta(minutes=30):
                return False

    return True

#main scheduler

def schedule_teams(teams, faculty, existing_student_schedule, existing_faculty_schedule):
    # Copy existing schedules (VERY IMPORTANT)
    student_schedule = {k: v[:] for k, v in existing_student_schedule.items()}
    faculty_schedule = {k: v[:] for k, v in existing_faculty_schedule.items()}

    final_schedule = []
    unscheduled = []

    teams.sort(key=lambda t: len(t.students), reverse=True)

    slots = generate_slots(
        faculty.start_time,
        faculty.end_time,
        teams[0].duration,
        faculty.buffer
    )

    for team in teams:
        assigned = False

        for slot in slots:
            if is_valid_assignment(team, slot, student_schedule, faculty_schedule):
                start, end = slot

                final_schedule.append((team.team_id, faculty.faculty_id, start, end))

                # Update schedules
                faculty_schedule.setdefault(team.faculty_id, []).append((start, end))

                for student in team.students:
                    sid = student.id
                    student_schedule.setdefault(sid, []).append((start, end))
                    student_schedule[sid].sort()

                assigned = True
                break

        if not assigned:
            unscheduled.append(team.team_id)

    return final_schedule, unscheduled, student_schedule, faculty_schedule