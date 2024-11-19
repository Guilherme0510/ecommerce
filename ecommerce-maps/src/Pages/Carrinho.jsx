import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/Context";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { images } from "../assets/assets.js";
import Texto from "../Components/Texto.jsx";
import TotalCarrinho from "../Components/TotalCarrinho.jsx";
import { Tooltip } from "react-tooltip";

const Carrinho = () => {
  const {
    produtos,
    carrinhoItems,
    navigate,
    atualizarQuantidade,
    token,
    pegarCarrinhoUsuario,
    setCarrinhoItems, // Assumindo que você tenha a função setCarrinhoItems no contexto
  } = useContext(ShopContext);

  const [dadosCarrinho, setDadosCarrinho] = useState([]);
  const [totalCarrinho, setTotalCarrinho] = useState(0); // Estado para o total do carrinho

  // Função para sincronizar o carrinho com os dados do contexto
  useEffect(() => {
    if (produtos.length > 0 && Object.keys(carrinhoItems).length > 0) {
      const tempData = Object.keys(carrinhoItems)
        .map((itemId) => {
          const produto = produtos.find((produto) => produto._id === itemId);
          if (produto) {
            return {
              ...produto,
              quantidade: carrinhoItems[itemId],
            };
          }
          return null; // Garante que itens inexistentes sejam descartados
        })
        .filter(Boolean); // Remove itens nulos (caso algum produto não seja encontrado)
    
      setDadosCarrinho(tempData);

      // Calcular o total do carrinho
      const total = tempData.reduce(
        (acc, item) => acc + item.preco * item.quantidade,
        0
      );
      setTotalCarrinho(total); // Atualiza o total
    }
  }, [carrinhoItems, produtos, setCarrinhoItems]); // Atualiza dadosCarrinho e totalCarrinho sempre que carrinhoItems ou produtos mudam

  return (
    <div className="mx-auto mt-10 flex flex-col gap-8 md:gap-2">
      <div className="flex justify-center items-center">
        <img src={images.logo} alt="Logo" className="w-36" />
      </div>
      <div className="md:text-start text-center">
        <Texto text1="SEU" text2="CARRINHO" />
      </div>

      <div className="flex flex-col justify-center items-center md:justify-between md:flex-row mt-10 gap-12">
        <div className="w-[calc(100%-100px)] md:w-2/4">
          {dadosCarrinho.length > 0 ? (
            dadosCarrinho.map((item, index) => {
              const dadosProduto = produtos.find(
                (produto) => produto._id.toString() === item._id.toString()
              );
              return (
                <div
                  key={index}
                  className="flex items-center text-center justify-between gap-4 mb-4 border px-3 rounded-xl"
                >
                  <img
                    src={dadosProduto.imagem[0]}
                    alt={dadosProduto.nome}
                    className="w-20 h-24 object-cover"
                  />
                  <div>
                    <h3 className="text-lg">{dadosProduto.nome}</h3>
                    <p>
                      R$ {dadosProduto.preco.toFixed(2)} 
                      {/* x {item.quantidade} */}
                    </p>
                    <p>
                      Total: R${" "}
                      {(dadosProduto.preco * item.quantidade).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-8 items-center text-2xl pr-6">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 cursor-pointer hover:rotate-[20deg] transition-all duration-100 ease-in hover:text-red-700"
                      data-tooltip-id="lixeira"
                      data-tooltip-content="Excluir"
                    />
                    <Tooltip id="lixeira" />
                    <input
                      type="number"
                      className="border w-10 rounded-xl text-center"
                      value={item.quantidade}
                      onChange={(e) =>
                        atualizarQuantidade(item._id, parseInt(e.target.value))
                      }
                      disabled
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p>Seu carrinho está vazio!</p>
          )}
        </div>

        {/* Exibição do total do carrinho */}
        <div className="w-[calc(100%-100px)] md:w-1/4 flex flex-col gap-5">
          <TotalCarrinho totalProdutos={totalCarrinho} />

          <div className="flex justify-end">
            <button
              onClick={() => navigate("/fazer-pedido")}
              className="bg-gray-700 w-36 h-9 text-white rounded-xl flex items-center justify-center hover:rotate-2 hover:bg-gray-900 transition-all duration-300 ease-in-out"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrinho;
