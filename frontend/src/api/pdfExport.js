import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const convertToPDF = (data, filename = "schedule.pdf") => {
  if (!data || !data.schedule) {
    return;
  }

  const doc = new jsPDF({ orientation: "landscape" });
  const rows = data.schedule.map((item) => [
    item.team || "",
    item.enrollment_number || "",
    item.faculty || "",
    item.start ? new Date(item.start).toLocaleString() : "",
    item.end ? new Date(item.end).toLocaleString() : "",
  ]);

  doc.setFontSize(14);
  doc.text("Smart Evaluation Scheduler", 14, 15);
  doc.setFontSize(10);
  doc.text("Schedule Preview", 14, 22);

  autoTable(doc, {
    startY: 28,
    head: [["Team", "Enrollment Number", "Faculty", "Start Time", "End Time"]],
    body: rows,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [168, 195, 188],
      textColor: [0, 0, 0],
    },
  });

  doc.save(filename);
};