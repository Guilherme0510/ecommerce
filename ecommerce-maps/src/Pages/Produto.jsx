import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../Context/Context.jsx";

const Produto = () => {
  const { produtoId } = useParams(); // Pega o id da URL
  const { addParaCarrinho, backendUrl } = useContext(ShopContext); // Função para adicionar no carrinho
  const [produto, setProduto] = useState(null); // Estado para armazenar o produto
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado para erros
  const [imagemPrincipal, setImagemPrincipal] = useState(""); // Estado para a imagem principal

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await axios.post(backendUrl + "/api/produto/unico", {
          id: produtoId, // Envia o id como parte do corpo da requisição
        });

        // Verifica se a requisição foi bem-sucedida
        if (response.data.success) {
          setProduto(response.data.produto); // Atualiza o estado com o produto retornado
          setImagemPrincipal(response.data.produto.imagem[0]); // Define a primeira imagem como principal
        } else {
          setError("Produto não encontrado."); // Em caso de erro
        }
        setLoading(false); // Define o loading como false após a requisição
      } catch (err) {
        setError("Erro ao carregar o produto."); // Erro na requisição
        setLoading(false);
      }
    };

    fetchProduto(); // Chama a função para buscar o produto
  }, [produtoId]); // Depende do id da URL

  if (loading) return <div>Carregando...</div>; // Enquanto estiver carregando
  if (error) return <div>{error}</div>; // Se houver erro
  if (!produto) return <div>Produto não encontrado.</div>; // Se não encontrar o produto

  // Função para mudar a imagem principal
  const mudarImagemPrincipal = (imagem) => {
    setImagemPrincipal(imagem);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row">
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-10">
          <img
            src={imagemPrincipal}
            alt={produto.nome}
            className="w-[500px] h-[400px] object-cover rounded-lg mb-4"
          />
          <div className="flex flex-col gap-10">
            <div className="flex gap-8">
              {produto.imagem[0] && (
                <img
                  src={produto.imagem[0]}
                  alt={produto.nome}
                  className="w-[180px] h-[180px] object-cover rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:opacity-80 hover:scale-105"
                  onClick={() => mudarImagemPrincipal(produto.imagem[0])}
                />
              )}
              {produto.imagem[1] && (
                <img
                  src={produto.imagem[1]}
                  alt={produto.nome}
                  className="w-[180px] h-[180px] object-cover rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:opacity-80 hover:scale-105"
                  onClick={() => mudarImagemPrincipal(produto.imagem[1])}
                />
              )}
            </div>
            <div className="flex gap-8">
              {produto.imagem[2] && (
                <img
                  src={produto.imagem[2]}
                  alt={produto.nome}
                  className="w-[180px] h-[180px] object-cover rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:opacity-80 hover:scale-105"
                  onClick={() => mudarImagemPrincipal(produto.imagem[2])}
                />
              )}
              {produto.imagem[3] && (
                <img
                  src={produto.imagem[3]}
                  alt={produto.nome}
                  className="w-[180px] h-[180px] object-cover rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:opacity-80 hover:scale-105"
                  onClick={() => mudarImagemPrincipal(produto.imagem[3])}
                />
              )}
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold">{produto.nome}</h1>
        <p className="text-lg font-semibold mt-2">
          R$ {produto.preco.toFixed(2)}
        </p>
        <div className="mt-4">
          <h2 className="text-2xl">Descrição</h2>
          <p className="mt-2">{produto.descricao}</p>
          <p className="mt-2 text-gray-600">{produto.detalhes}</p>
        </div>
        <button
          onClick={() => addParaCarrinho(produto)}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default Produto;
