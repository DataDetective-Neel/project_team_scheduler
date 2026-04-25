# Smart Evaluation Scheduler - System Rules

## Core Objective

Build a scheduling system that assigns evaluation slots to teams without student conflicts.

## Constraints

### 1. Student Constraints

* No overlapping evaluations
* Minimum 30-minute gap between two evaluations (any faculty, same day)

### 2. Faculty Constraints

* Faculty cannot have overlapping evaluations
* Faculty-defined buffer (e.g., 5 minutes) between consecutive evaluations

## Scheduling Rules

* Time slots are generated dynamically
* Slot duration = evaluation duration
* Next slot = previous slot + faculty buffer
* Use greedy scheduling:

  * Sort teams by number of students (descending)
  * Assign earliest valid slot

## Conflict Checking

Two slots overlap if:
start1 < end2 AND start2 < end1

Student buffer:
next_start >= previous_end + 30 minutes

## Data Model

* Student: enrollment_id (STRICT FORMAT, uppercase)
* Team: team_id, students, faculty_id, duration
* Faculty: faculty_id, time window

## Important Notes

* Always normalize student IDs (uppercase, trim spaces)
* Never hardcode data
* Always validate constraints before assigning a slot
* If no slot found → mark as unscheduled

## Code Guidelines

* Keep functions modular:

  * generate_slots()
  * is_valid_assignment()
  * schedule_teams()
* Use Python datetime
* Avoid global variables
