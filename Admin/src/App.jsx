import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Add from "./Pages/Add";
import Login from "./Pages/Login";
import Lista from "./Pages/Lista";
import Entrega from "./Pages/Entrega";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const moeda = "R$";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row sm:items-start justify-center items-center w-full">
            <Navbar setToken={setToken} />
            <div className="md:w-[70%] w-full mx-auto md:ml-[max(5vw,25px)] ml-0 my-2 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/lista" element={<Lista token={token} />} />
                <Route path="/status" element={<Entrega token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
