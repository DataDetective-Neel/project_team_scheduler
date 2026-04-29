function FacultyForm({ faculty, setFaculty }) {
  return (
    <div className="card">
      <h3>Faculty Details</h3>

      <input
        placeholder="Faculty ID"
        value={faculty.faculty_id}
        onChange={(e) =>
          setFaculty({ ...faculty, faculty_id: e.target.value })
        }
      />

      <input
        type="datetime-local"
        onChange={(e) =>
          setFaculty({ ...faculty, start_time: e.target.value })
        }
      />

      <input
        type="datetime-local"
        onChange={(e) =>
          setFaculty({ ...faculty, end_time: e.target.value })
        }
      />

      <input
        type="number"
        placeholder="Buffer (min)"
        value={faculty.buffer}
        onChange={(e) =>
          setFaculty({ ...faculty, buffer: Number(e.target.value) })
        }
      />

      <input
        placeholder="Batch (e.g. 2nd_year)"
        value={faculty.batch}
        onChange={(e) =>
          setFaculty({ ...faculty, batch: e.target.value })
        }
      />
    </div>
  );
}

export default FacultyForm;