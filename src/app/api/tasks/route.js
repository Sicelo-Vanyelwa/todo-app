import db from "../../../../scripts/init_db.js";

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const view = searchParams.get("view") || "all";
    const sort = searchParams.get("sort") || "due_date";
    const searchText = searchParams.get("search") || "";
    const search = `%${searchText}%`;
    
    const orderBy = {
        due_date: "due_date ASC",
        topic: "topic ASC",
        status: `
            CASE status
                WHEN 'Todo' THEN 1
                WHEN 'In-Progress' THEN 2
                WHEN 'Complete' THEN 3
            END
        `
    };

    const sqlOrder = orderBy[sort] || "due_date ASC";

    let tasks;

    const today = new Date().toISOString().split("T")[0];

if (view === "today") {
tasks = db.prepare(`
    SELECT *
    FROM tasks
    WHERE archived = 0
    AND status != 'Complete'
    AND due_date = ?
    AND (
        title LIKE ?
        OR topic LIKE ?
        OR description LIKE ?
    )
    ORDER BY ${sqlOrder}
`).all(today,search, search, search);

} else if (view === "upcoming") {
tasks = db.prepare(`
    SELECT *
    FROM tasks
    WHERE archived = 0
    AND status != 'Complete'
    AND due_date > ?
    AND (
        title LIKE ?
        OR topic LIKE ?
        OR description LIKE ?
    )
    ORDER BY ${sqlOrder}
`).all(today,search, search, search);

} else if (view === "completed") {
tasks = db.prepare(`
    SELECT *
    FROM tasks
    WHERE archived = 0
    AND status = 'Complete'
    AND (
        title LIKE ?
        OR topic LIKE ?
        OR description LIKE ?
    )
    ORDER BY ${sqlOrder}
`).all(search, search, search);
}
   else if (view === "archived") {
tasks = db.prepare(`
    SELECT *
    FROM tasks
    WHERE archived = 1
    AND (
        title LIKE ?
        OR topic LIKE ?
        OR description LIKE ?
    )
    ORDER BY ${sqlOrder}
`).all(search, search, search);
    } else {
tasks = db.prepare(`
    SELECT *
    FROM tasks
    WHERE archived = 0
    AND (
        title LIKE ?
        OR topic LIKE ?
        OR description LIKE ?
    )
    ORDER BY ${sqlOrder}
`).all(search, search, search);
    }

    return Response.json(tasks);
}

export async function POST(request) {
    const task = await request.json();

    if (
        !task.title ||
        !task.description ||
        !task.due_date ||
        !task.topic ||
        !task.status
    ) {
        return Response.json(
            { error: "All fields are required." },
            { status: 400 }
        );
    }

    db.prepare(`
        INSERT INTO tasks
        (title, description, due_date, topic, status)
        VALUES (?, ?, ?, ?, ?)
    `).run(
        task.title,
        task.description,
        task.due_date,
        task.topic,
        task.status
    );

    return Response.json({ success: true });
}

export async function PATCH(request) {
  const { id } = await request.json();

  db.prepare(`
    UPDATE tasks
    SET archived = TRUE
    WHERE id = ?
  `).run(id);

  return Response.json({ success: true });
}

export async function PUT(request) {
    const task = await request.json();


        if (
        !task.title ||
        !task.description ||
        !task.due_date ||
        !task.topic ||
        !task.status
    ) {
        return Response.json(
            { error: "All fields are required." },
            { status: 400 }
        );
    }
    db.prepare(`
        UPDATE tasks
        SET
            title = ?,
            description = ?,
            due_date = ?,
            topic = ?,
            status = ?
        WHERE id = ?
    `).run(
        task.title,
        task.description,
        task.due_date,
        task.topic,
        task.status,
        task.id
    );

    return Response.json({ success: true });
}