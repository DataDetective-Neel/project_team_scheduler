import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FacultyForm from "../components/FacultyForm";
import TeamForm from "../components/TeamForm";
import ScheduleTable from "../components/ScheduleTable";
import { generateSchedule } from "../api/scheduler";

function Dashboard() {
  const navigate = useNavigate();
  const faculty_id = localStorage.getItem("faculty_id");

  const [faculty, setFaculty] = useState({
    faculty_id: "",
    start_time: "",
    end_time: "",
    buffer: 5,
    batch: "",
  });

  const [teams, setTeams] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    setError("");

    // Validate faculty fields
    if (!faculty.faculty_id.trim()) {
      setError("Faculty ID is required");
      return false;
    }

    if (!faculty.start_time.trim()) {
      setError("Start time is required");
      return false;
    }

    if (!faculty.end_time.trim()) {
      setError("End time is required");
      return false;
    }

    if (!faculty.batch.trim()) {
      setError("Batch is required");
      return false;
    }

    // Validate teams
    if (teams.length === 0) {
      setError("At least one team is required");
      return false;
    }

    // Validate each team
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      if (!team.team_id.trim()) {
        setError(`Team ${i + 1}: Team ID is required`);
        return false;
      }
      if (!team.students.trim()) {
        setError(`Team ${i + 1}: Students list is required`);
        return false;
      }
      if (!team.duration || team.duration <= 0) {
        setError(`Team ${i + 1}: Duration must be greater than 0`);
        return false;
      }
    }

    return true;
  };

  const handlePreview = async () => {
    if (!validateForm()) return;

    setLoading(true);
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

    try {
      const res = await generateSchedule(data);
      setResult(res);
    } catch (err) {
      setError("Failed to generate schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const formattedTeams = teams.map((t) => ({
      team_id: t.team_id,
      students: t.students.split(",").map((s) => s.trim()),
      duration: Number(t.duration),
    }));

    const data = {
      ...faculty,
      save: true,
      teams: formattedTeams,
    };

    try {
      const res = await generateSchedule(data);
      setResult(res);
      setError(""); // Clear any previous errors
      alert("Schedule saved successfully!");
    } catch (err) {
      setError("Failed to save schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("faculty_id");
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="header-title">Smart Evaluation Scheduler</h1>
        </div>
        <div className="header-right">
          <span className="user-info">Faculty: {faculty_id}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <FacultyForm faculty={faculty} setFaculty={setFaculty} />
        <TeamForm teams={teams} setTeams={setTeams} />

        <div className="center">
          <button onClick={handlePreview} disabled={loading}>
            {loading ? "Loading..." : "Preview Schedule"}
          </button>
        </div>

        {result && (
          <div className="center">
            <button onClick={handleConfirmSave} disabled={loading} className="confirm-button">
              {loading ? "Saving..." : "Confirm & Save"}
            </button>
          </div>
        )}

        <ScheduleTable data={result} />
      </div>
    </div>
  );
}

export default Dashboard;