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
      <div className="section-title">Step 2 — Add Teams</div>

      {teams.length === 0 && (
        <div className="empty">
          No teams added yet.<br />
          Click <b>+ Add Team</b> to begin.
        </div>
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