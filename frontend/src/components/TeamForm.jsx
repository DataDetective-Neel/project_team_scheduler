function TeamForm({ teams, setTeams }) {

  const addTeam = () => {
    setTeams([
      ...teams,
      { team_id: "", students: "", duration: 30 }
    ]);
  };

  const removeTeam = (index) => {
    const updated = teams.filter((_, i) => i !== index);
    setTeams(updated);
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

          <div className="field">
            <label>Team ID</label>
            <input
              value={team.team_id}
              onChange={(e) =>
                updateTeam(i, "team_id", e.target.value)
              }
            />
          </div>

          <div className="field">
            <label>Students</label>
            <input
              placeholder="comma separated"
              value={team.students}
              onChange={(e) =>
                updateTeam(i, "students", e.target.value)
              }
            />
          </div>

          <div className="field">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={team.duration}
              onChange={(e) =>
                updateTeam(i, "duration", Number(e.target.value))
              }
            />
          </div>

          <div style={{ display: "flex", alignItems: "end" }}>
            <button
              style={{ backgroundColor: "#e07a7a" }}
              onClick={() => removeTeam(i)}
            >
              Remove
            </button>
          </div>

        </div>
      ))}

      <button onClick={addTeam}>+ Add Team</button>
    </div>
  );
}

export default TeamForm;