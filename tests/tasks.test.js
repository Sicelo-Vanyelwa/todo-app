import db, { resetDatabase } from "../scripts/init_test_db.js";

beforeEach(() => {
    resetDatabase();
});

test("Create Task", () => {

    db.prepare(`
        INSERT INTO tasks
        (title, description, due_date, topic)
        VALUES (?, ?, ?, ?)
    `).run(
        "Assignment",
        "Finish SD Project",
        "2026-08-05",
        "University"
    );

    const task = db.prepare(
        "SELECT * FROM tasks WHERE title=?"
    ).get("Assignment");

    expect(task).toBeDefined();
    expect(task.title).toBe("Assignment");
    expect(task.status).toBe("Todo");
    expect(task.archived).toBe(0);

});

test("Edit Task", () => {

    const result = db.prepare(`
        INSERT INTO tasks
        (title, description, due_date, topic)
        VALUES (?, ?, ?, ?)
    `).run(
        "Old Title",
        "Description",
        "2026-08-05",
        "Work"
    );

    db.prepare(`
        UPDATE tasks
        SET
            title=?,
            description=?,
            due_date=?,
            topic=?,
            status=?
        WHERE id=?
    `).run(
        "New Title",
        "Updated Description",
        "2026-08-10",
        "Personal",
        "Complete",
        result.lastInsertRowid
    );

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id=?"
    ).get(result.lastInsertRowid);

    expect(task.title).toBe("New Title");
    expect(task.description).toBe("Updated Description");
    expect(task.status).toBe("Complete");

});

test("Archive Task", () => {

    const result = db.prepare(`
        INSERT INTO tasks
        (title, description, due_date, topic)
        VALUES (?, ?, ?, ?)
    `).run(
        "Assignment",
        "Description",
        "2026-08-05",
        "University"
    );

    db.prepare(`
        UPDATE tasks
        SET archived=TRUE
        WHERE id=?
    `).run(result.lastInsertRowid);

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id=?"
    ).get(result.lastInsertRowid);

    expect(task.archived).toBe(1);

});

