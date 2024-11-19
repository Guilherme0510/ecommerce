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

  const addParaCarrinho = async (item) => {
    try {
      const itemId = item._id;

      if (token) {
        // Envia a requisição ao backend
        const response = await axios.post(
          `${backendUrl}/api/carrinho/addcarrinho`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          // Atualiza o estado do carrinho local apenas em caso de sucesso
          let dadosCarrinho = structuredClone(carrinhoItems);

          if (dadosCarrinho[itemId]) {
            dadosCarrinho[itemId] += 1;
          } else {
            dadosCarrinho[itemId] = 1;
          }

          setCarrinhoItems(dadosCarrinho);
          console.log("Item adicionado ao carrinho:", response.data.message);
          toast.success("Item adicionado ao carrinho!");
        } else {
          console.error("Erro do backend:", response.data.message);
          toast.error(
            response.data.message || "Erro ao adicionar item ao carrinho."
          );
        }
      } else {
        // Caso o usuário não esteja autenticado, atualiza apenas o estado local
        let dadosCarrinho = structuredClone(carrinhoItems);

        if (dadosCarrinho[itemId]) {
          dadosCarrinho[itemId] += 1;
        } else {
          dadosCarrinho[itemId] = 1;
        }

        setCarrinhoItems(dadosCarrinho);
        console.log("Item adicionado ao carrinho localmente.");
        toast.info("Você precisa estar logado para salvar no servidor.");
      }
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error);
      toast.error("Erro ao adicionar item ao carrinho. Tente novamente.");
    }
  };

  const contagemCarrinho = () => {
    let totalCount = 0;
  
    // Itera sobre os itens do carrinho
    for (const itemId in carrinhoItems) {
      const quantidade = carrinhoItems[itemId]; // Considera a quantidade do item sem considerar o tamanho
    
      try {
        // Verifica se a quantidade é um número válido e maior que 0
        if (typeof quantidade === 'number' && quantidade > 0) {
          totalCount += quantidade;
        }
      } catch (error) {
        console.log(`Erro ao processar o item ${itemId}:`, error);
      }
    }
  
    console.log('Total de itens no carrinho:', totalCount); 
    return totalCount;
  };
  

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      let itemInfo = produtos.find((produto) => produto._id === itemId);

      if (itemInfo && cartItems[itemId] > 0) {
        try {
          totalAmount += itemInfo.preco * cartItems[itemId];
        } catch (error) {
          console.log(`Erro ao processar o item ${itemId}:`, error);
        }
      }
    }

    return totalAmount;
  };

  const atualizarQuantidade = async (itemId, quantidade) => {
    let dadosCarrinho = structuredClone(carrinhoItems);
    dadosCarrinho[itemId] = quantidade;
    setCarrinhoItems(dadosCarrinho);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/carrinho/atualizar",
          { itemId, quantidade },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const pegarDadosProdutos = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/produto/listaproduto`
      );
      if (response.data.success) {
        setProdutos(response.data.lista);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar produtos.");
    }
  };

  const pegarCarrinhoUsuario = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/carrinho/visualizar",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
    pegarDadosProdutos();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      pegarCarrinhoUsuario(localStorage.getItem('token'))
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
    setCarrinhoItems,
    pegarDadosProdutos,
    pegarCarrinhoUsuario,
  };

  return (
    <ShopContext.Provider value={valores}>{children}</ShopContext.Provider>
  );
};
