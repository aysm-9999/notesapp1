"use client";

import { useEffect, useState } from "react";

type Note = {
  _id: string;
  title: string;
  content: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchNotes = async () => {
    const res = await fetch("/api/notes", { cache: "no-store" });
    const data = await res.json();
    setNotes(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/notes", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, title, content }),
    });

    setTitle("");
    setContent("");
    setEditingId(null);
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchNotes();
  };

  const editNote = (note: Note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <main className="min-h-screen bg-black-100 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center text-black-600">
          Notes App
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-grey-800 p-4 rounded shadow mb-6 space-y-3"
        >
          <input
            className="w-full p-2 border rounded text-black-600"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full p-2 border rounded text-black-600"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Note" : "Add Note"}
          </button>
        </form>

        {/* NOTES LIST */}
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note._id}
              className="bg-white p-4 rounded shadow"
            >
              <h2 className="font-semibold text-lg">
                {note.title}
              </h2>
              <p className="text-black-600">{note.content}</p>

              <div className="mt-3 flex gap-3">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => editNote(note)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => deleteNote(note._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}