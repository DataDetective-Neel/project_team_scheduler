export const convertToCSV = (data, filename = "schedule.csv") => {
  if (!data || !data.schedule) {
    return;
  }

  const schedule = data.schedule;
  
  // Create CSV headers
  const headers = ["Team", "Enrollment Number", "Faculty", "Start Time", "End Time"];
  
  // Prepare rows
  const rows = [];
  
  schedule.forEach((item) => {
    rows.push([
      item.team || "",
      item.enrollment_number || "",
      item.faculty || "",
      item.start ? new Date(item.start).toLocaleString() : "",
      item.end ? new Date(item.end).toLocaleString() : "",
    ]);
  });

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => {
          // Handle cells with commas or quotes
          if (typeof cell === "string" && (cell.includes(",") || cell.includes('"'))) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        })
        .join(",")
    ),
  ].join("\n");

  // Trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
