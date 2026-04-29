import { useState } from "react";

function TeamForm({ teams, setTeams }) {
  const addTeam = () => {
    setTeams([...teams, { team_id: "", students: "", duration: 30 }]);
  };

  const updateTeam = (index, field, value) => {
    const updated = [...teams];
    updated[index][field] = value;
    setTeams(updated);
  };

  return (
    <div className="card">
  <h3>Teams</h3>

  {teams.length === 0 && (
    <p style={{ color: "#999" }}>
      No teams added yet. Click below to add a team.
    </p>
  )}

  {teams.map((team, i) => (
  <div className="input-group" key={i}>
    
    <input
      placeholder="Team ID"
      value={team.team_id}
      onChange={(e) => updateTeam(i, "team_id", e.target.value)}
    />

    <input
      placeholder="Students (comma separated)"
      value={team.students}
      onChange={(e) => updateTeam(i, "students", e.target.value)}
    />

    <input
      type="number"
      placeholder="Duration (min)"
      value={team.duration}
      onChange={(e) => updateTeam(i, "duration", e.target.value)}
    />

  </div>
))}

  <button onClick={addTeam}>+ Add Team</button>
</div>
  );
}

export default TeamForm;