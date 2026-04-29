function ScheduleTable({ data }) {
  if (!data) return null;

  return (
    <div className="card">
      <h3>Schedule ({data.mode})</h3>

      <table>
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
    </div>
  );
}

export default ScheduleTable;