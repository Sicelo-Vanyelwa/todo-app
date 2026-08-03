// components/Button.js
'use client'; // Required for click events and state in Next.js App Router

export default function Button({ label, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {label}
    </button>
  );
}