import db from "../scripts/init_db.js";

export async function POST(request) {
  const task = await request.json();

  db.prepare(`
    INSERT INTO tasks (title, description, due_date, topic)
    VALUES (?, ?, ?, ?)
  `).run(
    task.title,
    task.description,
    task.due_date,
    task.topic
  );

  return Response.json({ success: true });
}