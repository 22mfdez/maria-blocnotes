import React, { useState } from "react";
import axios from "axios";
import LogoutIcon from "./assets/salida.png";

function Bloc() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteContent, setEditingNoteContent] = useState("");

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleEdit = (noteId, noteContent) => {
    setEditingNoteId(noteId);
    setEditingNoteContent(noteContent);
  };

  // Función para manejar la actualización de una nota
  const handleUpdate = (noteId) => {
    axios
      .put(`/api/notes/${noteId}`, { content: editingNoteContent })
      .then((res) => {
        if (res.data.success) {
          setNotes(
            notes.map((note) => (note._id === noteId ? res.data.note : note))
          );
          setEditingNoteId(null);
          setEditingNoteContent("");
        }
      })
      .catch((err) => console.error(err));
  };

  // Función para manejar la eliminación de una nota
  const handleDelete = (noteId) => {
    axios
      .delete(`/api/notes/${noteId}`) // se hace la petición al backend para eliminar la nota con el id noteId
      .then((res) => {
        if (res.data.success) {
          // si la petición es exitosa
          setNotes(notes.filter((note) => note._id !== noteId)); //manejo del estado de la aplicación para eliminar la nota
        }
      })
      .catch((err) => console.error(err));
  };

  const handleNoteSubmit = (event) => {
    event.preventDefault(); // evita que el formulario se envíe por defecto y recargue la página

    const newNote = {
      content: note,
    };

    axios
      .post("/api/notes", newNote) // se hace la petición al backend para guardar la nota
      .then((res) => {
        if (res.data.success) {
          setNotes([...notes, res.data.note]); //manejo del estado de la aplicación para agregar la nota
          setNote(""); //manejo del estado de la aplicación para agregar la nota
        } else {
          console.error("Error al guardar la nota:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error al guardar la nota:", error);
      });
  };

  useState(() => {
    axios
      .get("/api/notes")
      .then((res) => {
        if (res.data.success) {
          // si la petición es exitosa se actualiza el estado de la aplicación
          setNotes(res.data.notes);
        } else {
          console.error("Error al obtener las notas:", res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error al obtener las notas:", error);
      });
  }, []);

  const handleLogout = () => {
    // Elimina el token del almacenamiento local
    localStorage.removeItem("token");
    // Redirige al usuario al formulario de login
    window.location.href = "";
  };

  return (
    <div className="font-mono min-h-screen bg-purple-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white border-purple-500 border rounded"
          >
            <img
              src={LogoutIcon}
              alt="Logout"
              style={{ width: "30px", height: "30px", margin: "auto" }}
            />
          </button>

          <h1 className="text-3xl font-bold underline mb-6 text-purple-800">
            Add a new note
          </h1>
          <form onSubmit={handleNoteSubmit}>
            <label className="font-bold mb-1 block text-purple-800">
              Note
              <textarea
                value={note}
                onChange={handleNoteChange}
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring focus:ring-purple-200 focus:ring-opacity-50 resize-none"
                style={{ minHeight: "200px" }}
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
                className="mb-4 p-2 border rounded bg-purple-200 flex justify-between items-center"
              >
                {editingNoteId === note._id ? (
                  <textarea
                    value={editingNoteContent}
                    onChange={(e) => setEditingNoteContent(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  <span className="flex-grow">{note.content}</span>
                )}
                <div className="flex justify-end">
                  {editingNoteId === note._id ? (
                    <button
                      onClick={() => handleUpdate(note._id)}
                      className="ml-2 px-2 py-1 rounded text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(note._id, note.content)}
                      className="ml-2 px-2 py-1 rounded text-white bg-purple-500 hover:bg-purple-600 focus:outline-none"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="ml-2 px-2 py-1 rounded text-white bg-purple-400 hover:bg-purple-500 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Bloc;
