export const generateSchedule = async (data) => {
  const res = await fetch("http://127.0.0.1:8000/schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};