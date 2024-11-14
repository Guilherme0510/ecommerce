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
      let dadosCarrinho = structuredClone(carrinhoItems);
      // Salvar o id do produto diretamente no banco de dados
      const itemId = item._id; 
  
      if (dadosCarrinho[itemId]) {
        dadosCarrinho[itemId] += 1;  
      } else {
        dadosCarrinho[itemId] = 1;  
      }
      
      setCarrinhoItems(dadosCarrinho);
  
      console.log("itemId adicionado:", itemId); 
  
      if (token) {
        await axios
          .post(
            backendUrl + "/api/carrinho/addcarrinho",
            { itemId },  
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            console.log("Item adicionado ao carrinho:", response.data);
          })
          .catch((error) => {
            console.error("Erro na requisição:", error);
          });
      }
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error);
      toast.error("Erro ao adicionar item ao carrinho. Tente novamente.");
    }
  };
  

  const contagemCarrinho = () => {
    return carrinhoItems ? Object.values(carrinhoItems).reduce((acc, count) => acc + count, 0) : 0;
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
      
      console.log("Carrinho:", response.data.dadosCarrinho); 
  
      if (response.data.success) {
        setCarrinhoItems(response.data.dadosCarrinho);
      } else {
        toast.error(response.data.message || "Erro ao carregar o carrinho.");
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
  if(!token && localStorage.getItem("token")){
    setToken(localStorage.getItem("token"))
    pegarCarrinhoUsuario(localStorage.getItem("token"))
  }
 },[])

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
    pegarDadosProdutos
  };

  return (
    <ShopContext.Provider value={valores}>{children}</ShopContext.Provider>
  );
};
