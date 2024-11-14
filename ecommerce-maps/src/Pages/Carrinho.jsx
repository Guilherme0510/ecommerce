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
    pegarDadosProdutos,
    frete,
    atualizarQuantidade,
  } = useContext(ShopContext);

  const [produtosCarrinho, setProdutosCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmaExcluir, setConfirmaExcluir] = useState(false);

  const calcularTotalCarrinho = () => {
    let totalProdutos = 0;

    produtosCarrinho.forEach((item) => {
      const totalItem = item.produto.preco * item.quantidade;
      totalProdutos += totalItem;
    });

    return { totalProdutos, };
  };

  const { totalProdutos} = calcularTotalCarrinho();

  const excluirPedido = (id) => {
    toast.info("Produto removido do carrinho.");
    atualizarQuantidade(id, 0);
    setConfirmaExcluir(false)
  };

  useEffect(() => {
    pegarDadosProdutos();
  }, []);

  useEffect(() => {
    if (produtos && produtos.length > 0 && carrinhoItems) {
      const tempData = [];
      for (const itemId in carrinhoItems) {
        const produto = produtos.find((produto) => produto._id === itemId);
        const quantidade = carrinhoItems[itemId];

        if (produto && quantidade > 0) {
          tempData.push({
            _id: itemId,
            quantidade,
            produto,
          });
        }
      }

      setProdutosCarrinho(tempData);
      setLoading(false);
    }
  }, [produtos, carrinhoItems]);

  useEffect(() => {
    atualizarQuantidade();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }
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
          {produtosCarrinho.length > 0 ? (
            produtosCarrinho.map((item, index) => {
              const dadosProduto = item.produto;
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
                      R$ {dadosProduto.preco.toFixed(2)} x {item.quantidade}
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
                      onClick={() =>setConfirmaExcluir(true)}
                    />
                    <Tooltip id="lixeira" />

                    {confirmaExcluir && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
                          <h3 className="text-lg mb-4 text-center">
                            Tem certeza que deseja remover o produto do
                            carrinho?
                          </h3>
                          <div className="flex justify-around">
                            <button
                             onClick={() => excluirPedido(item._id)} 
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                              Sim
                            </button>
                            <button 
                            onClick={() =>setConfirmaExcluir(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                              Não
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <input
                      type="number"
                      className="border w-10 rounded-xl text-center"
                      value={item.quantidade}
                      onChange={(e) =>
                        atualizarQuantidade(item._id, parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p>Seu carrinho está vazio!</p>
          )}
        </div>

        <div className="w-[calc(100%-100px)] md:w-1/4 flex flex-col gap-5">
          <TotalCarrinho
            totalProdutos={totalProdutos}
            valorTotal={totalProdutos + frete}
          />
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
