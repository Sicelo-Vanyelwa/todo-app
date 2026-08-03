"use client";

import { useState, useEffect } from "react";
import Button from "../frontend/components.js";
import SideNav from "../frontend/sideNav.js";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [view, setView] = useState("all");
  const [sortBy, setSortBy] = useState("due_date");
  const [searchText, setSearchText] = useState("");

  async function loadTasks() {
const response = await fetch(
    `/api/tasks?view=${view}&sort=${sortBy}&search=${encodeURIComponent(searchText)}`
);

    const data = await response.json();
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, [view, sortBy, searchText]);

  async function archiveTask(id) {
    const response = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      loadTasks();
    } else {
      alert("Failed to archive task.");
    }
  }

  function editTask(id) {
    const task = tasks.find(t => t.id === id);

    if (!task) {
      alert("Task not found.");
      return;
    }

    setEditingTask(task);
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const taskData = {
      title: formData.get("title"),
      description: formData.get("description"),
      due_date: formData.get("dueDate"),
      topic: formData.get("topic"),
      status: formData.get("status"),
    };

    let response;

    if (editingTask) {
      response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingTask.id,
          ...taskData,
        }),
      });
    } else {
      response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
    }

    if (response.ok) {
      event.target.reset();
      setShowForm(false);
      setEditingTask(null);
      loadTasks();
    } else {
      alert("Failed to save task.");
    }
  }

  function isOverdue(task) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.due_date);

  return dueDate < today && task.status !== "Complete";
}

  return (
    <div className="container">

      <SideNav
    onAllTasks={() => setView("all")}
    onToday={() => setView("today")}
    onUpcoming={() => setView("upcoming")}
    onCompleted={() => setView("completed")}
    onArchived={() => setView("archived")}
/>

      <main className="mainContent">

        <div className="topBar">

          <Button
            label="Add Task"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          />

          <select
            className="sortSelect"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="due_date">Due Date</option>
            <option value="topic">Topic</option>
            <option value="status">Status</option>
          </select>

          <input
            type="search"
            placeholder="Search by title, topic, or description..."
            className="searchBar"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

        </div>

        {showForm && (
          <div className="formOverlay">

            <form
              className="taskForm"
              onSubmit={handleSubmit}
            >

              <h2>
                {editingTask ? "Edit Task" : "Add Task"}
              </h2>

              <input
                type="text"
                name="title"
                placeholder="Title"
                defaultValue={editingTask?.title || ""}
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                defaultValue={editingTask?.description || ""}
              />

              <input
                type="date"
                name="dueDate"
                defaultValue={editingTask?.due_date || ""}
              />

              <input
                type="text"
                name="topic"
                placeholder="Topic"
                defaultValue={editingTask?.topic || ""}
              />

              <select
                name="status"
                defaultValue={editingTask?.status || "Todo"}
              >
                <option value="Todo">Todo</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Complete">Complete</option>
              </select>

              <div className="formButtons">

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                >
                  Cancel
                </button>

                <button type="submit">
                  Save
                </button>

              </div>

            </form>

          </div>
        )}

        <div className="tasksContainer">

          <div className="taskHeader">
            <span>Topic</span>
            <span>Description</span>
            <span>Title</span>
            <span>Due Date</span>
            <span>Status</span>
          </div>

          {tasks.map(task => (
            <div
              className="taskRow"
              key={task.id}
            >

              <span>{task.topic}</span>
              <span>{task.description}</span>
              <span>{task.title}</span>
              <span className={isOverdue(task) ? "overdueDate" : ""}>
                     {task.due_date}
               </span>
              <span>{task.status}</span>

              <div className="actionButtons">

                {!task.archived && (
                  <>
                    <button
                      className="active-btn"
                      onClick={() => editTask(task.id)}
                    >
                      Edit
                    </button>

                    <button
                      className="active-btn"
                      onClick={() => archiveTask(task.id)}
                    >
                      Archive
                    </button>
                  </>
                )}

              </div>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}
