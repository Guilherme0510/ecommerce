import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, moeda } from "../App";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faRightLong, faTrash } from "@fortawesome/free-solid-svg-icons";

const Lista = ({ token }) => {
  const [lista, setLista] = useState([]);
  const [precoOrdenado, setPrecoOrdenado] = useState("crescente");
  const [categoria, setCategoria] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("novos");
  const [showModal, setShowModal] = useState(false);
  const [produtoRemover, setProdutoRemover] = useState(null);
  const [confirmacao, setConfirmacao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const ListaProdutos = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/produto/listaproduto");
      console.log(response.data);
      
      if (response.data.success) {
        setLista(response.data.lista);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removerProduto = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/produto/removerproduto",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await ListaProdutos();
      } else {
        toast.error(response.data.message);
      }
      setShowModal(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const aplicarFiltros = () => {
    let produtosFiltrados = [...lista];

    if (categoria) {
      produtosFiltrados = produtosFiltrados.filter(
        (item) => item.categoria === categoria
      );
    }

    if (precoOrdenado === "crescente") {
      produtosFiltrados = produtosFiltrados.sort((a, b) => a.preco - b.preco);
    } else if (precoOrdenado === "decrescente") {
      produtosFiltrados = produtosFiltrados.sort((a, b) => b.preco - a.preco);
    }

    if (pesquisa) {
      produtosFiltrados = produtosFiltrados.filter((item) =>
        item.nome.toLowerCase().includes(pesquisa.toLowerCase())
      );
    }

    if (filtro === "novos") {
      produtosFiltrados = produtosFiltrados.sort(
        (a, b) => new Date(b.data) - new Date(a.data)
      );
    } else if (filtro === "antigos") {
      produtosFiltrados = produtosFiltrados.sort(
        (a, b) => new Date(a.data) - new Date(b.data)
      );
    }

    return produtosFiltrados;
  };

  useEffect(() => {
    ListaProdutos();
  }, []);

  const handleOpenModal = (produtoId) => {
    setProdutoRemover(produtoId);
    setConfirmacao("");
    setShowModal(true);
  };

  const totalPages = Math.ceil(aplicarFiltros().length / itensPorPagina);
  const currentPageItems = aplicarFiltros().slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  return (
    <div>
      <div className="my-10">
        <h1 className="text-3xl">Lista de todos os produtos</h1>
      </div>

      <div className="my-4">
        <div className="flex flex-col md:flex-row items-start justify-start gap-3 md:gap-6">
          <div className="flex gap-3 items-center">
            <label>Pesquisar produto:</label>
            <input
              type="text"
              className="p-2 border rounded-xl"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Digite o nome do produto"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="filtro">Ordenar:</label>
            <select
              id="filtro"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full max-w-[500px] px-3 py-2 border rounded-xl"
            >
              <option value="novos">Mais Novos</option>
              <option value="antigos">Mais Antigos</option>
            </select>
          </div>

          <div className="flex gap-3 items-center">
            <label>Ordenar por preço:</label>
            <select
              className="p-2 border rounded-xl"
              value={precoOrdenado}
              onChange={(e) => setPrecoOrdenado(e.target.value)}
            >
              <option value="crescente">Preço crescente</option>
              <option value="decrescente">Preço decrescente</option>
            </select>
          </div>

          <div className="flex gap-3 items-center">
            <label>Categoria:</label>
            <select
              className="p-2 border rounded-xl"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="homem">Homem</option>
              <option value="mulher">Mulher</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_3fr_1fr_1fr_1fr] grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center py-2 px-2 bg-orange-200 my-2 rounded-lg">
        <p>Imagem</p>
        <p>Nome</p>
        <p>Categoria</p>
        <p>Preço</p>
        <p>Ação</p>
      </div>

      {currentPageItems.map((item, index) => (
        <div
          className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 my-2 bg-white rounded-lg px-2"
          key={index}
        >
          <img src={item.imagem[0]} className="w-16 h-16 object-cover" alt="" />
          <p>{item.nome}</p>
          <p>{item.categoria}</p>
          <p>
            {moeda}
            {item.preco}
          </p>
          <p
            className="cursor-pointer group text-red-500"
            onClick={() => handleOpenModal(item._id)}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="group-hover:rotate-[10deg] group-hover:text-lg transition-transform duration-100"
            />
          </p>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] text-center">
            <h2 className="text-xl mb-4">Digite "confirmar" para remover o produto:</h2>
            <input
              type="text"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              className="p-2 border rounded-lg mb-4 w-full"
              placeholder="Escreva 'confirmar'"
            />
            <div className="flex justify-around">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (confirmacao.toLowerCase() === "confirmar") {
                    removerProduto(produtoRemover);
                  } else {
                    toast.error("Você precisa digitar 'confirmar' para remover.");
                  }
                  setShowModal(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center my-4 gap-3">
        <button
          onClick={() => setPaginaAtual(paginaAtual > 1 ? paginaAtual - 1 : 1)}
          disabled={paginaAtual === 1}
          className="bg-blue-500 text-white px-2 py-1 rounded-lg text-sm"
        >
          <FontAwesomeIcon icon={faLeftLong}/>
        </button>
        <span>{paginaAtual} - {totalPages}</span>
        <button
          onClick={() => setPaginaAtual(paginaAtual < totalPages ? paginaAtual + 1 : totalPages)}
          disabled={paginaAtual === totalPages}
          className="bg-blue-500 text-white px-2 py-1 rounded-lg text-sm"
        >
          <FontAwesomeIcon icon={faRightLong}/>
        </button>
      </div>
    </div>
  );
};

export default Lista;
