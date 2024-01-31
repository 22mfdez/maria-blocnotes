import React, { useState } from "react";
import axios from "axios";

function Bloc() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleNoteSubmit = (event) => {
    event.preventDefault();

    const newNote = {
      content: note,
    };

    axios
      .post("/api/notes", newNote)
      .then((res) => {
        if (res.data.success) {
          setNotes([...notes, res.data.note]);
          setNote("");
        } else {
          console.error("Error al guardar la nota:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error al guardar la nota:", error);
      });
  };

  return (
    <div className="font-mono min-h-screen bg-purple-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-bold underline mb-6 text-purple-800">
            Add a new note
          </h1>
          <form onSubmit={handleNoteSubmit}>
            <label className="font-bold mb-1 block text-purple-800">
              Note
              <textarea
                value={note}
                onChange={handleNoteChange}
                className="w-full px-2 py-1 border rounded"
              />
            </label>
            <button
              type="submit"
              className="mt-3 px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
            >
              Add Note
            </button>
          </form>
          <div className="mt-8">
            {notes.map((note, index) => (
              <div
                key={index}
                className="mb-4 p-2 border rounded bg-purple-200"
              >
                {note.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Bloc;
