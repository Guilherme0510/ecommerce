import React from "react";
import { images } from "../assets/assets";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contato = () => {
  const onSubmitHandler = (e) => {
    e.preventDefault(); 

    const formData = new FormData(e.target);

    const data = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      mensagem: formData.get("mensagem"),
    };


    toast.success("Mensagem enviada com sucesso!");

    console.log(data);
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="h-screen relative">
        <div className="flex items-center justify-center h-full">
          <div className="md:w-3/5 w-full h-4/6 border-2 flex flex-col md:flex-row bg-white bg-opacity-80 shadow-lg rounded-lg">
            <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r p-5 relative">
              <img
                src={images.banner}
                className="w-full h-full object-cover absolute inset-0 rounded-lg bg-slate-600"
                alt="Banner"
              />
              <div className="absolute inset-0 bg-slate-700 opacity-60 rounded-lg" />
              <div className="w-full relative p-5 z-10 flex flex-col justify-center items-center gap-10 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Informações da Empresa
                </h2>
                <p className="text-lg">Telefone: (11) 1234-5678</p>
                <p className="text-lg">
                  Endereço: Rua Exemplo, 123 - Cidade, Estado
                </p>
                <p className="text-lg">
                  Horário de Funcionamento: Seg-Sex: 8h - 18h
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r p-5 relative">
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-xl font-bold mb-4">Entre em Contato</h2>
                <div className="mb-4">
                  <label className="block mb-1" htmlFor="nome">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome" 
                    id="nome"
                    className="w-[250px] p-2 border rounded"
                    placeholder="Digite seu nome"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1" htmlFor="email">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email" 
                    id="email"
                    className="w-[250px] p-2 border rounded"
                    placeholder="Digite seu e-mail"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1" htmlFor="mensagem">
                    Mensagem
                  </label>
                  <textarea
                    name="mensagem" 
                    id="mensagem"
                    className="w-[250px] p-2 border rounded"
                    placeholder="Digite sua mensagem"
                    rows="4"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white w-[250px] py-2 rounded hover:bg-yellow-600 transition"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer /> 
    </form>
  );
};

export default Contato;
