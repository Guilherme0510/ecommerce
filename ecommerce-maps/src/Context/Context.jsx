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

  const addParaCarrinho = async (itemId) => {
    setCarrinhoItems((prevCarrinho) => {
      const updatedCarrinho = { ...prevCarrinho };
      updatedCarrinho[itemId] = (updatedCarrinho[itemId] || 0) + 1;
      return updatedCarrinho;
    });

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/carrinho/addcarrinho",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error("Erro ao adicionar item ao carrinho. Tente novamente.");
      }
    }
  };

  const contagemCarrinho = () => {
    return Object.values(carrinhoItems).reduce((acc, count) => acc + count, 0);
  };

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

  const atualizarQuantidade = async (itemId, quantidade) => {
    let carrinhoDados = structuredClone(carrinhoItems);
    carrinhoDados[itemId] = quantidade;
    setCarrinhoItems(carrinhoDados);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/carrinho/atualizar",
          { itemId, quantidade },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const pegarDadosProdutos = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/produto/listaproduto");
      if (response.data.success) {
        setProdutos(response.data.produtos);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const pegarCarrinhoUsuario = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/carrinho/visualizar",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCarrinhoItems(response.data.dadosCarrinho);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  
  useEffect(() => {
    pegarDadosProdutos()
  },[])
  
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !token) {
      setToken(savedToken);
    }
  }, [token]);
  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      pegarCarrinhoUsuario(localStorage.getItem("token"))
    }
  }, []);
  
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
    setCarrinhoItems
  };
  return (
    <ShopContext.Provider value={valores}>{children}</ShopContext.Provider>
  );
};
