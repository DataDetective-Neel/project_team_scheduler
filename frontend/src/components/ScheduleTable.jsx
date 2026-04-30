import { convertToCSV } from "../api/csvExport";

function ScheduleTable({ data }) {
  if (!data) return null;

  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    convertToCSV(data, `schedule_${timestamp}.csv`);
  };

  return (
    <div className="card">
      <div className="section-title">Step 3 — Preview</div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Team</th>
            <th>Enrollment Number</th>
            <th>Faculty</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>

        <tbody>
          {data.schedule.map((item, i) => (
            <tr key={i}>
              <td>{item.team}</td>
              <td>{item.enrollment_number || "-"}</td>
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
      </div>
    </div>
  );
}

export default ScheduleTable;