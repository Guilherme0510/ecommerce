import React, { useState, useEffect } from "react";
import ItemProduto from "../Components/ItemProduto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Texto from "../Components/Texto.jsx";
import {
  faArrowLeft,
  faArrowRight,
  faClose,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ShopContext } from "../Context/Context.jsx";

const Produtos = () => {
  const { backendUrl } = useContext(ShopContext);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBar, setSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Variável para armazenar o texto da pesquisa
  const [sortOption, setSortOption] = useState("relevante");
  const [produtos, setProdutos] = useState([]);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/produto/listaproduto"
        );
        if (response.data.success) {
          setProdutos(response.data.lista);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

    fetchProdutos();
  }, [backendUrl]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((category) => category !== value)
        : [...prev, value]
    );
  };

  // Filtrando os produtos com base na pesquisa e categorias selecionadas
  const filteredProducts = produtos.filter((produto) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(produto.categoria);
    const matchesSearch =
      produto.nome.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Ordenação dos produtos
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOption === "relevante") {
      return new Date(b.dataCriacao) - new Date(a.dataCriacao); // Ordena pela data de criação
    }
    if (sortOption === "crescente") {
      return a.preco - b.preco;
    }
    if (sortOption === "decrescente") {
      return b.preco - a.preco;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex flex-col md:flex-row mt-8">
      <div className="w-full md:w-1/4 p-4">
        <h2 className="text-3xl font-semibold mb-4">Filtros</h2>
        <div
          className={`border border-gray-300 rounded-xl pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-lg font-medium">CATEGORIAS</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["homem", "mulher"].map((label) => (
              <label
                key={label}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={label}
                  onChange={toggleCategory}
                  className="appearance-none h-4 w-4 border-2 border-gray-300 rounded-full transition duration-200 cursor-pointer checked:bg-blue-500 checked:border-transparent focus:outline-none shadow-sm"
                />
                <span>{label.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/4">
        <div className="flex justify-between flex-col md:flex-row items-center mb-4 p-4 px-8">
          <Texto text1={"NOSSOS"} text2={"PRODUTOS"} />
          <div className="flex gap-5 items-center justify-center">
            <FontAwesomeIcon
              onClick={() => setSearchBar(true)}
              icon={faSearch}
              className="hover:-rotate-12 transition-all duration-100 ease-in cursor-pointer hover:scale-105"
            />
            <select
              className="mt-2 py-2 px-1 rounded-lg border border-black"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="relevante">Relevante</option>
              <option value="crescente">Ordem Crescente</option>
              <option value="decrescente">Ordem Decrescente</option>
            </select>
          </div>
        </div>

        {searchBar && (
          <div className="flex justify-center items-center gap-9 w-full bg-yellow-100 p-5">
            <input
              type="text"
              placeholder="Digite o que precisa"
              className="border border-black rounded-lg py-1 px-4 w-3/5 hover:border-yellow-700 hover:border-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Atualizando a pesquisa
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="hover:-rotate-12 transition-all duration-100 ease-in cursor-pointer hover:scale-105"
            />
            <FontAwesomeIcon
              onClick={() => setSearchBar(false)}
              icon={faClose}
              className="hover:-rotate-12 transition-all duration-100 ease-in cursor-pointer hover:scale-105"
            />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-9 justify-center items-center">
          {paginatedProducts.map((item, index) => (
            <div
              className="flex flex-col"
              key={`${item.id}-${index}`} // Combinação do ID e índice para garantir unicidade
              data-aos="fade-down"
              data-aos-duration="200"
              data-aos-delay={`${200 + index * 100}`}
            >
              <ItemProduto
                produtoId={item._id}
                image={item.imagem[0]}
                name={item.nome}
                preco={item.preco.toFixed(2)}
                size="h-40 w-44 md:h-64 md:w-56"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <span className="px-4">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
