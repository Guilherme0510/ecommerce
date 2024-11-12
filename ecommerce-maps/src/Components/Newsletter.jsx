import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Texto from "./Texto.jsx";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();


    //  api do Brevo
    try {
      const response = await axios.post(
        "https://api.sendinblue.com/v3/contacts",
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key":import.meta.env.VITE_EMAIL_KEY,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Inscrição realizada com sucesso!");
        setEmail("");
      }
    } catch (err) {
      toast.error("Ocorreu um erro. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <div className=" px-4 text-center">
      <div data-aos="fade-left" data-aos-duration='500'>
        <Texto text1={"RECEBA"} text2={"NOVIDADES"} />
      <p className="text-gray-600 mb-6">
        Receba ofertas exclusivas e novidades sobre nossos pastéis deliciosos.
      </p>
      </div>
      <form className="flex justify-center" onSubmit={handleSubmit} data-aos="fade-right" data-aos-duration='500'>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail para receber as novidades"
          className="w-auto md:w-[500px] py-2 px-4 rounded-l-md border border-gray-300 outline-none focus:ring-2 focus:ring-yellow-500"
          required
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded-r-md hover:bg-yellow-600 transition-colors duration-300"
        >
          Inscrever-se
        </button>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
      />
    </div>
  );
};

export default Newsletter;
