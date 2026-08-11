# AI Usage Transcripts

The following are selected transcripts from the development of the Todo application. They show how AI was used as a development aid for planning, code generation, and debugging.

--------------------------------------------------
1. PLANNING AND CONSTRAINTS
--------------------------------------------------

User:
I want to build a Todo application using Next.js and SQLite. It should be local-only, with no user accounts or login system. I also want tasks to be archived instead of permanently deleted.

AI:
A suitable approach is to use Next.js with React and SQLite. The application can use API routes to communicate with the SQLite database.

User:
I don't want logins, settings, or user accounts. The application is for a single local user.

AI:
Then the application can avoid authentication and store the user's tasks directly in the local SQLite database.

User:
The task statuses should only be Todo, In-Progress, and Complete. Users shouldn't be able to create their own statuses.

AI:
The status field can therefore use those three fixed values.

User:
I also want separate views for All Tasks, Today, Upcoming, Completed, and Archived.

AI:
The API can use a view parameter to return the appropriate set of tasks for each view.

--------------------------------------------------
2. REJECTING AN UNSUITABLE SUGGESTION
--------------------------------------------------

User:
Should I use a delete button for tasks?

AI:
A delete operation could permanently remove a task from the database.

User:
No. I don't want permanent deletion. Replace delete with Archive because I want archived tasks to remain available.

AI:
Then use an archived field instead. Active tasks can have archived = 0 and archived tasks can have archived = 1. The Archive button can update this field instead of deleting the task.

User:
Yes, that's what I want. Archived tasks should also have their own view.

This decision was implemented in the application using an archived field and an Archived side navigation option.

--------------------------------------------------
3. CODE GENERATION
--------------------------------------------------

User:
What's the PUT route for editing a task?

AI:
A PUT route can update an existing task using its ID.

Example:

export async function PUT(request) {
    const task = await request.json();

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

User:
I want the edit button to open the same form used for adding a task, but with the existing task information already filled in.

AI:
The selected task can be stored in editingTask state and its values can be used as the form's default values.

User:
Yes. I also want the status to be editable.

AI:
The status field can use the same three fixed options: Todo, In-Progress, and Complete.

This was incorporated into the task form and PUT request.

--------------------------------------------------
4. SEARCH AND VIEWS
--------------------------------------------------

User:
Should the search bar search archived tasks?

AI:
It could search all tasks regardless of whether they are archived.

User:
I don't want that. If I am viewing Archived, I only want the search to search archived tasks. If I am viewing normal tasks, it should only search normal tasks.

AI:
The search condition can be combined with the selected view. For example, the Archived view can use archived = 1, while the other views use archived = 0.

User:
I also want search to work using title, topic, and description.

AI:
The SQL query can use LIKE conditions for all three fields.

This resulted in the API filtering searches using title, topic, and description while respecting the selected view.

--------------------------------------------------
5. OVERDUE AND DATE VIEWS
--------------------------------------------------

User:
If a task is overdue, I want the date to be red.

AI:
The application can compare the task's due date with today's date and apply a different CSS class when the task is overdue.

User:
How do I get tasks due today and display them when pressing Today?

AI:
The API can compare due_date with today's date and return only active tasks where the dates match.

User:
For Upcoming, I want tasks after today.

AI:
The Upcoming query can use due_date > today's date while excluding archived tasks.

User:
For Completed, I want tasks whose status is Complete.

AI:
The Completed view can filter using status = 'Complete' and archived = 0.

These rules were implemented in the API views.

--------------------------------------------------
6. DATABASE TESTING
--------------------------------------------------

User:
I need at least three tests that exercise real behaviour, including archiving or the overdue rule. The tests shouldn't modify the real database.

AI:
A separate test database can be created for the tests. It can be reset before each test so that the tests are deterministic.

User:
Shouldn't this be inside init_test_db.js?

AI:
Yes. The test database initialization and reset functionality can be placed in init_test_db.js, while the test files use that database.

User:
I want the tests to run with one command.

AI:
The package.json test script can be configured to run the complete test suite using npm test.

This approach was used for the application's automated tests.

--------------------------------------------------
7. DEBUGGING
--------------------------------------------------

User:
I get:
Module not found: Can't resolve '../scripts/init_db.js'

AI:
The relative import path needs to account for the location of the API route. If the route is inside src/app/api/tasks/, the path to the root-level scripts directory requires going up four directories.

Example:

import db from "../../../../scripts/init_db.js";

User:
After creating the first task, I have to refresh the browser before the task appears.

AI:
The database insertion may be succeeding, but the React state still contains the previous task list. Calling loadTasks() after a successful POST will retrieve the updated list.

User:
I want the task to appear immediately without manually refreshing.

AI:
Use:

await loadTasks();

after the successful POST or PUT request.

This was added to the form submission process.

--------------------------------------------------
8. PACKAGE / ENVIRONMENT DEBUGGING
--------------------------------------------------

User:
npm install fails when installing better-sqlite3 and reports a node-gyp and Visual Studio error.

AI:
The error indicates that better-sqlite3 is being built from source and the required C++ build tools are not available.

User:
I don't want to downgrade Node.js to 22. I fixed the problem by installing the latest better-sqlite3, and it works with Node 24.

AI:
Then Node.js 24 can remain the documented Node version, and the project should use the working better-sqlite3 version in package.json.

This decision was reflected in the final project setup and README.

--------------------------------------------------
9. FINAL DEVELOPMENT DECISIONS
--------------------------------------------------

The final application reflects decisions made during development rather than simply following all AI suggestions.

Important constraints and decisions included:

- The application is local-only.
- There are no user accounts or login functionality.
- Tasks are archived rather than permanently deleted.
- Archived tasks have their own view.
- Task statuses are fixed to Todo, In-Progress, and Complete.
- Searching is performed within the currently selected task view.
- Search covers title, topic, and description.
- Tasks can be viewed as All Tasks, Today, Upcoming, Completed, and Archived.
- Overdue task dates are displayed differently.
- The application uses SQLite through better-sqlite3.
- Tests use a separate throwaway database.
- Node.js 24 is used with the working version of better-sqlite3.

AI was used to provide suggestions, examples, and debugging assistance. The final implementation and design decisions were selected and adapted during development.
