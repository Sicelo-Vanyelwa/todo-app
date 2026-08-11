# Todo App

A local-first Todo application built with Next.js and SQLite.

The application allows a user to:

- Create tasks
- Edit tasks
- Search tasks
- Sort tasks
- Mark tasks as complete
- Archive tasks
- View today's tasks
- View upcoming tasks
- View completed tasks
- View archived tasks
- Identify overdue tasks

The application is designed for a single local user and does not require user accounts or authentication.

---

## Third-Party Code

The following third-party libraries and packages are used in this project:

| Package | Purpose |
|---|---|
| Next.js | Provides the web application framework, routing, API routes, and development server. |
| React | Provides the component-based user interface. |
| React DOM | Allows React components to be rendered in the browser. |
| better-sqlite3 | Provides access to the local SQLite database from Node.js. |
| Jest | Provides automated testing for the application's functionality and UI. |
| @testing-library/react | Provides utilities for testing React components and their behaviour. |
| @testing-library/jest-dom | Provides additional Jest matchers for testing DOM elements. |
| @testing-library/user-event | Simulates realistic user interactions such as clicking buttons and entering form data. |
| Tailwind CSS | Provides utility classes for styling the application. |
| ESLint | Checks the code for common JavaScript and React problems. |

All packages are installed automatically using `npm install` from the dependencies specified in `package.json`.

`better-sqlite3` is used instead of a remote database because the application is local-first and stores its data locally in SQLite.

---

## Database Design

The application uses a local SQLite database stored in `local.db`.

### Tasks Table

The application currently uses one main table:

### `tasks`

| Column | Description |
|---|---|
| `id` | Unique identifier for the task. |
| `title` | Title of the task. |
| `description` | Description of the task. |
| `due_date` | Date on which the task is due. |
| `topic` | Topic/category of the task. |
| `status` | Task status: `Todo`, `In-Progress`, or `Complete`. |
| `archived` | Indicates whether the task has been archived. |
| `created_at` | Date/time when the task was created. |

### Relationships

There are currently no relationships between multiple tables.

The application uses a single `tasks` table, so there are no foreign keys.

### Archived Tasks

The `archived` field separates active and archived tasks:

- `archived = 0` → active task
- `archived = 1` → archived task

Archiving a task does not delete it from the database. Instead, its `archived` value is changed to `1`.

Archived tasks can be viewed separately through the Archived view.

### Task Status

The application uses three fixed task statuses:

- `Todo`
- `In-Progress`
- `Complete`

Users cannot create custom statuses.

---

## Running It

### Requirements

The following software is required:

- Git
- Node.js 24.x
- npm

The application has been developed and tested using **Node.js 24.x**.

The project uses the latest compatible `better-sqlite3` version and is intended to run with Node.js 24.x.

---
## Installation

git clone "link of the repository"

cd todo-app

npm install

## Run

npm run dev

Open http://localhost:3000

## Tests

npm test
