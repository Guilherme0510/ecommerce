import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

export const useShop = () => {
  return useContext(ShopContext);
};

export const ShopContextProvider = ({ children }) => {
  const currency = "R$";
  const frete = 10;
  const navigate = useNavigate();
  const [carrinhoItems, setCarrinhoItems] = useState({});
  const [produtos, setProdutos] = useState([]);
  const [token, setToken] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Função para adicionar item ao carrinho
  const addParaCarrinho = async (itemId) => {
    setCarrinhoItems((prevCarrinho) => {
      const updatedCarrinho = { ...prevCarrinho };
      updatedCarrinho[itemId] = (updatedCarrinho[itemId] || 0) + 1;
      return updatedCarrinho;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/carrinho/addcarrinho`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error("Erro ao adicionar item ao carrinho. Tente novamente.");
      }
    }
  };

  // Função para contar os itens no carrinho
  const contagemCarrinho = () => {
    return Object.values(carrinhoItems).reduce((acc, count) => acc + count, 0);
  };

  // Função para calcular o valor total do carrinho
  const getCartAmount = () => {
    const produtosMap = produtos.reduce((map, produto) => {
      map[produto._id] = produto;
      return map;
    }, {});

    return Object.keys(carrinhoItems).reduce((totalAmount, itemId) => {
      const produto = produtosMap[itemId];
      if (produto) {
        const quantidade = carrinhoItems[itemId];
        totalAmount += produto.preco * quantidade;
      }
      return totalAmount;
    }, 0);
  };

  // Função para atualizar a quantidade de um item no carrinho
  const atualizarQuantidade = async (itemId, quantidade) => {
    const carrinhoDados = { ...carrinhoItems, [itemId]: quantidade };
    setCarrinhoItems(carrinhoDados);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/carrinho/atualizar`,
          { itemId, quantidade },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Erro ao atualizar o carrinho.");
      }
    }
  };

  // Função para buscar os dados dos produtos
  const pegarDadosProdutos = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/produto/listaproduto`);
      if (response.data.success) {
        setProdutos(response.data.produtos);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar produtos.");
    }
  };

  // Função para pegar os dados do carrinho do usuário
  const pegarCarrinhoUsuario = async (token) => {
    try {
     const response = await axios.post(backendUrl + '/api/carrinho/visualizar', {}, {headers: {token }})
      if (response.data.success) {
        setCarrinhoItems(response.data.dadosCarrinho);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Erro ao carregar o carrinho.");
    }
  };

  useEffect(() => {
    pegarDadosProdutos();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !token) {
      setToken(savedToken);
      pegarCarrinhoUsuario(savedToken);
    }
  }, [token]);

  // Valores passados pelo contexto
  const valores = {
    currency,
    frete,
    navigate,
    backendUrl,
    token,
    setToken,
    addParaCarrinho,
    contagemCarrinho,
    getCartAmount,
    produtos,
    atualizarQuantidade,
    carrinhoItems,
    setCarrinhoItems,
  };

  return <ShopContext.Provider value={valores}>{children}</ShopContext.Provider>;
};
