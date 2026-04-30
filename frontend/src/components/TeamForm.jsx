import { useState } from "react";
import * as XLSX from "xlsx";

function TeamForm({ teams, setTeams }) {
  const [uploadError, setUploadError] = useState("");

  const addTeam = () => {
    setTeams([...teams, { team_id: "", students: "", duration: 30, enrollment_number: "" }]);
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

  const handleFileUpload = async (e) => {
    setUploadError("");
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileType = file.name.split(".").pop().toLowerCase();

      if (fileType === "csv") {
        const text = await file.text();
        const lines = text.trim().split("\n");
        if (lines.length < 2) {
          setUploadError("CSV file must have headers and at least one row");
          return;
        }
        const parsedTeams = parseCSVLines(lines);
        if (parsedTeams.length === 0) {
          setUploadError("No valid team data found in CSV");
          return;
        }
        setTeams([...teams, ...parsedTeams]);
        e.target.value = "";
      } else if (fileType === "xlsx" || fileType === "xls") {
        const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        if (data.length === 0) {
          setUploadError("No data found in Excel file");
          return;
        }
        const parsedTeams = data.map((row) => ({
          team_id: row["Team ID"] || row["team_id"] || "",
          students: row["Students"] || row["students"] || "",
          duration: Number(row["Duration"] || row["duration"] || 30),
          enrollment_number: row["Enrollment Number"] || row["enrollment_number"] || "",
        }));
        setTeams([...teams, ...parsedTeams]);
        e.target.value = "";
      } else {
        setUploadError("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      }
    } catch (error) {
      setUploadError(`Error parsing file: ${error.message}`);
    }
  };

  const parseCSVLines = (lines) => {
    const headerLine = lines[0];
    const headers = parseCSVRow(headerLine);
    const teamIdIndex = findColumnIndex(headers, ["team_id", "team id", "teamid"]);
    const studentsIndex = findColumnIndex(headers, ["students", "student"]);
    const durationIndex = findColumnIndex(headers, ["duration"]);
    const enrollmentIndex = findColumnIndex(headers, ["enrollment_number", "enrollment number", "enrollmentnumber"]);
    if (teamIdIndex === -1 || studentsIndex === -1) {
      throw new Error("CSV must have 'Team ID' and 'Students' columns");
    }
    const parsedTeams = [];
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVRow(lines[i]);
      if (row.some((cell) => cell.trim())) {
        parsedTeams.push({
          team_id: row[teamIdIndex]?.trim() || "",
          students: row[studentsIndex]?.trim() || "",
          duration: Number(row[durationIndex]?.trim() || 30),
          enrollment_number: row[enrollmentIndex]?.trim() || "",
        });
      }
    }
    return parsedTeams;
  };

  const parseCSVRow = (line) => {
    const result = [];
    let current = "";
    let insideQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const findColumnIndex = (headers, possibleNames) => {
    return headers.findIndex((header) => possibleNames.includes(header.toLowerCase().trim()));
  };

  return (
    <div className="card">
      <div className="section-title">Step 2 — Add Teams</div>
      {uploadError && <div className="error-message">{uploadError}</div>}
      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-label">
          Import from CSV or Excel:
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
          className="file-input"
        />
        <p className="upload-hint">
          Expected columns: Team ID, Students, Duration (optional), Enrollment Number (optional)
        </p>
      </div>
      {teams.length === 0 && (
        <div className="empty">
          No teams added yet. Click <b>+ Add Team</b> to begin or upload a file.
        </div>
      )}
      {teams.map((team, i) => (
        <div className="input-group" key={i}>
          <div className="field">
            <label>Team ID</label>
            <input value={team.team_id} onChange={(e) => updateTeam(i, "team_id", e.target.value)} />
          </div>
          <div className="field">
            <label>Enrollment Number</label>
            <input value={team.enrollment_number || ""} onChange={(e) => updateTeam(i, "enrollment_number", e.target.value)} />
          </div>
          <div className="field">
            <label>Students (comma separated)</label>
            <input value={team.students} onChange={(e) => updateTeam(i, "students", e.target.value)} />
          </div>
          <div className="field">
            <label>Duration (minutes)</label>
            <input type="number" value={team.duration} onChange={(e) => updateTeam(i, "duration", Number(e.target.value))} />
          </div>
          <div style={{ display: "flex", alignItems: "end" }}>
            <button style={{ backgroundColor: "#e07a7a" }} onClick={() => removeTeam(i)}>
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