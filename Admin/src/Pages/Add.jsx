import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { imagens } from "../assets/assets";
import { backendUrl } from "../App.jsx";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");

  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Inicia o carregamento

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("descricao", descricao);
      formData.append("preco", preco);
      formData.append("categoria", categoria);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/produto/addproduto",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setNome("");
        setDescricao("");
        setPreco("");
        setCategoria("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-10"
      >
        <div className="flex flex-col gap-4">
          <p className="text-2xl">Adicionar imagem do Produto</p>
          <div className="flex gap-5">
            <label
              htmlFor="image1"
              className="border border-gray-200 rounded-xl"
            >
              <img
                className="w-28"
                src={!image1 ? imagens.upload : URL.createObjectURL(image1)}
                alt=""
              />
              <input
                type="file"
                id="image1"
                hidden
                onChange={(e) => setImage1(e.target.files[0])}
              />
            </label>
            <label
              htmlFor="image2"
              className="border border-gray-200 rounded-xl"
            >
              <img
                className="w-28"
                src={!image2 ? imagens.upload : URL.createObjectURL(image2)}
                alt=""
              />
              <input
                type="file"
                id="image2"
                hidden
                onChange={(e) => setImage2(e.target.files[0])}
              />
            </label>
            <label
              htmlFor="image3"
              className="border border-gray-200 rounded-xl"
            >
              <img
                className="w-28"
                src={!image3 ? imagens.upload : URL.createObjectURL(image3)}
                alt=""
              />
              <input
                type="file"
                id="image3"
                hidden
                onChange={(e) => setImage3(e.target.files[0])}
              />
            </label>
            <label
              htmlFor="image4"
              className="border border-gray-200 rounded-xl"
            >
              <img
                className="w-28"
                src={!image4 ? imagens.upload : URL.createObjectURL(image4)}
                alt=""
              />
              <input
                type="file"
                id="image4"
                hidden
                onChange={(e) => setImage4(e.target.files[0])}
              />
            </label>
          </div>
        </div>
        <div className="w-full">
          <p>Nome do Produto</p>
          <input
            type="text"
            name="nome"
            placeholder="Digite o nome do Produto"
            className="w-full max-w-[500px] px-3 py-2 border border-gray-500 rounded-2xl"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="w-full">
          <p>Descrição do Produto</p>
          <input
            type="text"
            name="descricao"
            placeholder="Digite a descrição do Produto"
            className="w-full max-w-[500px] px-3 py-2 border border-gray-500 rounded-2xl"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-2">Categoria do Produto</p>
            <select
              className="w-full max-w-[500px] px-3 py-2 border border-gray-500 rounded-2xl"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecione a categoria</option>
              <option value="homem">Para Homens</option>
              <option value="mulher">Para Mulher</option>
            </select>
          </div>
          <div>
            <p className="mb-2">Preço do Produto</p>
            <input
              type="number"
              placeholder="****"
              className="w-full max-w-[500px] px-3 py-2 border border-gray-500 rounded-2xl"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </div>
        </div>
        <button
  type="submit"
  className={`bg-orange-400 hover:bg-orange-600 duration-200 transition-all ease-in-out ${isLoading ? '' : 'hover:rotate-6'} w-32 py-3 rounded-2xl text-white tracking-wider hover:tracking-widest`}
  disabled={isLoading} 
>
  {isLoading ? (
    <span>Carregando...</span> 
  ) : (
    "Adicionar"
  )}
</button>

      </form>
    </>
  );
};

export default Add;
