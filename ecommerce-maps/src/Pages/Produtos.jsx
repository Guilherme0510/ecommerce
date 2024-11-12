import React, { useState } from "react";
import ItemProduto from "../Components/ItemProduto";
import { images } from "../assets/assets.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Texto from "../Components/Texto.jsx";
import {
  faArrowLeft,
  faArrowRight,
  faClose,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const Produtos = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBar, setSearchBar] = useState(false);
  const [sortOption, setSortOption] = useState("relevante"); 
  const itemsPerPage = 8;

  const produtos = [
    { id: 1, img: images.p1, nome: "Pastel de Carne", preco: 19.99, categoria: "Carne" },
    { id: 2, img: images.p2, nome: "Pastel de Queijo", preco: 17.99, categoria: "Queijo" },
    { id: 3, img: images.p3, nome: "Pastel de Carne Seca", preco: 21.99, categoria: "Carne" },
    { id: 4, img: images.p4, nome: "Pastel de Frango", preco: 18.99, categoria: "Frango" },
    { id: 5, img: images.p5, nome: "Pastel de Camarão", preco: 24.99, categoria: "Frutos do Mar" },
    { id: 6, img: images.p6, nome: "Pastel de Palmito", preco: 20.99, categoria: "Vegetais" },
    { id: 7, img: images.p7, nome: "Pastel de Vegetais", preco: 16.99, categoria: "Vegetais" },
    { id: 8, img: images.p8, nome: "Pastel de Picanha", preco: 22.99, categoria: "Carne" },
    { id: 9, img: images.p9, nome: "Pastel de Batata", preco: 15.99, categoria: "Vegetais" },
    { id: 10, img: images.p10, nome: "Pastel de Frutos do Mar", preco: 29.99, categoria: "Frutos do Mar" },
  ];

  const toggleCategory = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((category) => category !== value)
        : [...prev, value]
    );
  };

  const filteredProducts =
    selectedCategories.length > 0
      ? produtos.filter((produto) => selectedCategories.includes(produto.categoria))
      : produtos;

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOption === "relevante") {
      return a.id - b.id; 
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
            {["Carne", "Queijo", "Frango", "Vegetais", "Frutos do Mar"].map(
              (label) => (
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
                  <span>{label}</span>
                </label>
              )
            )}
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
              key={item.id}
              data-aos="fade-down"
              data-aos-duration="200"
              data-aos-delay={`${200 + index * 100}`}
            >
              <ItemProduto
                id={item.id}
                image={item.img}
                name={item.nome}
                preco={item.preco}
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