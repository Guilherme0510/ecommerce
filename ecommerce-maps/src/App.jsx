import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useLocation } from "react-router-dom";
import "aos/dist/aos.css";
import AOS from "aos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Produtos from "./Pages/Produtos";
import Produto from "./Pages/Produto";
import Perfil from "./Pages/Perfil";
import Carrinho from "./Pages/Carrinho";
import Pedido from "./Pages/Pedido";
import Sobre from "./Pages/Sobre";
import Contato from "./Pages/Contato";
import Login from "./Pages/Login";

import { Analytics } from '@vercel/analytics/react';
import Verify from "./Pages/Verify";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      offset: 50,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div>
      {location.pathname !== "/login" && <Navbar />}

      <hr className="w-4/5 mx-auto" />
      <ToastContainer />
      <div
        className={
          location.pathname !== "/login" ? "w-5/5 md:w-4/5 mx-auto" : ""
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produto/:produtoId" element={<Produto />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/fazer-pedido" element={<Pedido />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </div>

      {location.pathname !== "/perfil" &&
        location.pathname !== "/carrinho" &&
        location.pathname !== "/contato" &&
        location.pathname !== "/login" && <Footer />}
        <Analytics />
    </div>
  );
};

export default App;
