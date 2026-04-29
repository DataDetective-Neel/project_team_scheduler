import { useState } from "react";
import FacultyForm from "../components/FacultyForm";
import TeamForm from "../components/TeamForm";
import ScheduleTable from "../components/ScheduleTable";
import { generateSchedule } from "../api/scheduler";

function Dashboard() {
  const [faculty, setFaculty] = useState({
    faculty_id: "",
    start_time: "",
    end_time: "",
    buffer: 5,
    batch: "",
  });

  const [teams, setTeams] = useState([]);
  const [result, setResult] = useState(null);

  const handlePreview = async () => {
    const formattedTeams = teams.map((t) => ({
      team_id: t.team_id,
      students: t.students.split(",").map((s) => s.trim()),
      duration: Number(t.duration),
    }));

    const data = {
      ...faculty,
      save: false,
      teams: formattedTeams,
    };

    const res = await generateSchedule(data);
    setResult(res);
  };

  return (
    <div className="container">
      <h1>Smart Evaluation Scheduler</h1>

      <FacultyForm faculty={faculty} setFaculty={setFaculty} />
      <TeamForm teams={teams} setTeams={setTeams} />

      <div className="center">
        <button onClick={handlePreview}>Preview Schedule</button>
      </div>

      <ScheduleTable data={result} />
    </div>
  );
}

export default Dashboard;