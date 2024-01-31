import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
  const [name, setName] = useState(""); // hook de react para manejar el estado de un componente
  const [password, setPassword] = useState(""); // hook de react para manejar el estado de un componente
  const navigate = useNavigate(); // hook de react-router-dom para navegar entre rutas

  const handleSubmit = (event) => {
    event.preventDefault();

    const postData = {
      // objeto que se envía al backend para hacer el login (ver server.js)
      name: name,
      password: password,
    };

    axios
      .post("/api/login", postData) // esto es una peticion POST a la ruta /api/login (ver server.js)
      .then((res) => {
        if (res.data.message === "Login successful") {
          // si el login fue exitoso, navega a la ruta /bloc (ver main.jsx)
          navigate("/bloc");
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="font-mono min-h-screen bg-purple-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-3xl font-bold underline mb-6 text-purple-800">
            Welcome to your Bloc
          </h1>
          <form onSubmit={handleSubmit}>
            <label className="font-bold mb-1 block text-purple-800">
              Username
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2 py-1 border rounded"
              />
            </label>
            <label className="font-bold mb-1 block mt-2 text-purple-800">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 py-1 border rounded"
              />
            </label>
            <label className="font-bold mb-1 block mt-2 text-purple-800">
              Accept Lovely and Cutie Terms and Conditions
              <input type="checkbox" required className="ml-2" />
            </label>
            <button
              type="submit"
              className="mt-3 px-4 py-2 rounded text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default App;
