'use client';
import Button from "./components.js";
export default function SideNav({     onAllTasks,
    onToday,
    onUpcoming,
    onCompleted,
    onArchived }) {
  return (
    <aside className="sidebar">
      <h1 className="logo">Todo App</h1>

      <nav>
        <button onClick={() => onAllTasks()}>All Tasks</button>
        <button onClick={() => onToday()}>Today</button>
        <button onClick={() => onUpcoming()}>Upcoming</button>
        <button onClick={() => onCompleted()}>Completed</button>
        <button onClick={() => onArchived()}>Archived</button>
      </nav>
    </aside>
  );
}