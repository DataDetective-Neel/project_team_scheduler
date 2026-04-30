import { convertToCSV } from "../api/csvExport";
import { convertToPDF } from "../api/pdfExport";

function ScheduleTable({ data }) {
  if (!data) return null;

  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    convertToCSV(data, `schedule_${timestamp}.csv`);
  };

  const handlePdfExport = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    convertToPDF(data, `schedule_${timestamp}.pdf`);
  };

  return (
    <div className="card">
      <div className="section-title">Step 3 — Preview</div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Team</th>
            <th>Faculty</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>

        <tbody>
          {data.schedule.map((item, i) => (
            <tr key={i}>
              <td>{item.team}</td>
              <td>{item.faculty}</td>
              <td>{new Date(item.start).toLocaleTimeString()}</td>
              <td>{new Date(item.end).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="center">
        <button onClick={handleExport} className="export-button">
          Export CSV
        </button>
        <button onClick={handlePdfExport} className="export-button" style={{ marginLeft: "10px" }}>
          Export PDF
        </button>
      </div>

      {data.unscheduled && data.unscheduled.length > 0 && (
        <div className="card" style={{ marginTop: "16px" }}>
          <div className="section-title">Unscheduled Teams</div>
          <ul>
            {data.unscheduled.map((teamId) => (
              <li key={teamId}>{teamId}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ScheduleTable;