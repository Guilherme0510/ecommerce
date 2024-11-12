import axios from "axios";
import { backendUrl } from "../App";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        senha,
      });
      console.log(response);

      if (response.data.success) {
        setToken(response.data.token);
        console.log(response);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-xl px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Painel de Administrador</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
            <input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Senha</p>
            <input
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="password"
              placeholder="Insira sua senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
            type="submit"
          >
            {" "}
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
