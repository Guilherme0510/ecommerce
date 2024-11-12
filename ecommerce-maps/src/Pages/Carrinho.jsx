import React, { useContext, useEffect, useState } from "react";
import TotalCarrinho from "../Components/TotalCarrinho";
import { ShopContext } from "../Context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { images } from "../assets/assets.js";
import Texto from "../Components/Texto.jsx";

const Carrinho = () => {
  const [produtosCarrinho, setProdutosCarrinho] = useState([]);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const { frete, navigate, carrinhoItens, produtos } = useContext(ShopContext);

  const excluirPedido = (id) => {
    const novosProdutos = produtosCarrinho.filter((produto) => produto.id !== id);
    setProdutosCarrinho(novosProdutos);
  };


  useEffect(() => {
    const total = produtosCarrinho.reduce(
      (acc, produto) => acc + produto.preco,
      0
    );
    setTotalProdutos(total);
    setValorTotal(total + frete);
  }, [produtosCarrinho, frete]);

  useEffect(() => {
    if (produtos && produtos.length > 0 && carrinhoItens) {
      const tempData = []
      for(const itens in carrinhoItens){
        for(const item in carrinhoItens[itens]){
          if(carrinhoItens[itens][item] > 0) {
            tempData.push({
              _id:itens,
              quantidade: carrinhoItens[itens][item]
            })
          }
        }
      }
      setProdutosCarrinho(tempData)
    }
  }, [carrinhoItens, produtos])

  
  return (
    <>
      <div className=" mx-auto mt-10 flex flex-col gap-8 md:gap-2">
        <div className="flex justify-center items-center">
          <img src={images.logo} alt="" className="w-36" />
        </div>
        <div className="md:text-start text-center">
          <Texto text1={"SEU"} text2={"CARRINHO"} />
        </div>

        <div className="flex flex-col justify-center items-center md:justify-between md:flex-row mt-10 gap-12">
          <div className="w-[calc(100%-100px)] md:w-2/4">
            {produtosCarrinho.map((item) => (
              <div
                key={item.id}
                className="flex items-center text-center justify-between gap-4 mb-4"
              >
                <img src={item.img} alt={item.nome} className="w-20 h-20" />
                <div>
                  <h3 className="text-lg">{item.nome}</h3>
                  <p>R$ {item.preco.toFixed(2)}</p>
                </div>
                <div
                  className="text-2xl pr-6 text-red-500 cursor-pointer hover:rotate-[20deg] transition-all duration-100 ease-in hover:text-red-700"
                  onClick={() => excluirPedido(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              </div>
            ))}
          </div>
          <div className="w-[calc(100%-100px)] md:w-1/4 flex flex-col gap-5">
            <TotalCarrinho
              totalProdutos={totalProdutos}
              valorTotal={valorTotal}
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
    </>
  );
};

export default Carrinho;
