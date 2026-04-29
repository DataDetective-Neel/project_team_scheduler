function FacultyForm({ faculty, setFaculty }) {
  return (
    <div className="card">
      <div className="section-title">Step 1 — Faculty Details</div>

      <div className="input-group">

        <div className="field">
          <label>Faculty ID</label>
          <input
            value={faculty.faculty_id || ""}
            onChange={(e) =>
              setFaculty({ ...faculty, faculty_id: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={faculty.start_time || ""}
            onChange={(e) =>
              setFaculty({ ...faculty, start_time: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label>End Time</label>
          <input
            type="datetime-local"
            value={faculty.end_time || ""}
            onChange={(e) =>
              setFaculty({ ...faculty, end_time: e.target.value })
            }
          />
        </div>

        <div className="field">
          <label>Buffer (minutes)</label>
          <input
            type="number"
            value={faculty.buffer || 0}
            onChange={(e) =>
              setFaculty({
                ...faculty,
                buffer: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="field">
          <label>Batch</label>
          <input
            placeholder="e.g. 2nd_year"
            value={faculty.batch || ""}
            onChange={(e) =>
              setFaculty({ ...faculty, batch: e.target.value })
            }
          />
        </div>

      </div>
    </div>
  );
}

export default FacultyForm;