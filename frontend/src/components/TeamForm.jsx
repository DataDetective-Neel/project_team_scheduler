import { useState } from "react";
import * as XLSX from "xlsx";

function TeamForm({ teams, setTeams }) {
  const [uploadError, setUploadError] = useState("");

  const createStudentRow = () => ({ enrollment_id: "", name: "", topic: "" });

  const normalizeStudentRows = (rows = []) => {
    const normalized = rows
      .map((row) => ({
        enrollment_id: row?.enrollment_id || "",
        name: row?.name || "",
        topic: row?.topic || "",
      }))
      .filter((row) => row.enrollment_id || row.name || row.topic);

    return normalized.length > 0 ? normalized : [createStudentRow()];
  };

  const addTeam = () => {
    setTeams([
      ...teams,
      {
        team_id: "",
        student_rows: [createStudentRow()],
        duration: 30,
      },
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

  const updateStudentRow = (teamIndex, rowIndex, field, value) => {
    const updated = [...teams];
    const rows = [...(updated[teamIndex].student_rows || [])];
    rows[rowIndex] = { ...rows[rowIndex], [field]: value };
    updated[teamIndex].student_rows = rows;
    setTeams(updated);
  };

  const addStudentRow = (teamIndex) => {
    const updated = [...teams];
    updated[teamIndex].student_rows = [...(updated[teamIndex].student_rows || []), createStudentRow()];
    setTeams(updated);
  };

  const removeStudentRow = (teamIndex, rowIndex) => {
    const updated = [...teams];
    const rows = [...(updated[teamIndex].student_rows || [])].filter((_, i) => i !== rowIndex);
    updated[teamIndex].student_rows = rows.length > 0 ? rows : [createStudentRow()];
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
          student_rows: normalizeStudentRows(
            String(row["Students"] || row["students"] || "")
              .split(",")
              .map((studentId) => ({ enrollment_id: studentId.trim(), name: "", topic: "" }))
          ),
          duration: Number(row["Duration"] || row["duration"] || 30),
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
    if (teamIdIndex === -1 || studentsIndex === -1) {
      throw new Error("CSV must have 'Team ID' and 'Students' columns");
    }
    const parsedTeams = [];
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVRow(lines[i]);
      if (row.some((cell) => cell.trim())) {
        parsedTeams.push({
          team_id: row[teamIdIndex]?.trim() || "",
          student_rows: normalizeStudentRows(
            row[studentsIndex]
              ?.trim()
              .split(",")
              .map((studentId) => ({ enrollment_id: studentId.trim(), name: "", topic: "" })) || []
          ),
          duration: Number(row[durationIndex]?.trim() || 30),
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
          Expected columns: Team ID, Students, Duration (optional)
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
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Students</label>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "8px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Enrollment ID</th>
                    <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Name</th>
                    <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Topic</th>
                    <th style={{ width: "110px", padding: "8px", borderBottom: "1px solid #ddd" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {(team.student_rows || [createStudentRow()]).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td style={{ padding: "8px" }}>
                        <input
                          value={row.enrollment_id}
                          onChange={(e) => updateStudentRow(i, rowIndex, "enrollment_id", e.target.value)}
                          placeholder="EN123456"
                        />
                      </td>
                      <td style={{ padding: "8px" }}>
                        <input
                          value={row.name}
                          onChange={(e) => updateStudentRow(i, rowIndex, "name", e.target.value)}
                          placeholder="Student name"
                        />
                      </td>
                      <td style={{ padding: "8px" }}>
                        <input
                          value={row.topic}
                          onChange={(e) => updateStudentRow(i, rowIndex, "topic", e.target.value)}
                          placeholder="Optional topic"
                        />
                      </td>
                      <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          style={{ marginRight: "8px" }}
                          onClick={() => removeStudentRow(i, rowIndex)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" onClick={() => addStudentRow(i)} style={{ marginTop: "8px" }}>
              + Add Student
            </button>
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