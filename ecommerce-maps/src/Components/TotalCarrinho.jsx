import React, { useContext } from "react";
import { ShopContext } from "../Context/Context";
import Texto from "./Texto";

const TotalCarrinho = ({ totalProdutos, valorTotal }) => {
  const { currency, frete, navigate } = useContext(ShopContext);

  valorTotal = totalProdutos + frete

  return (
    <>
      <Texto text1={"TOTAL"} text2={"CARRINHO"} />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <div className="border-b-2 flex flex-row justify-between">
            <p className="text-base font-normal">Produtos</p>
            <p>
              {currency} {totalProdutos.toFixed(2)}
            </p>
          </div>
          <div className="border-b-2 flex flex-row justify-between">
            <p className="text-base font-normal">Frete</p>
            <p>
              {currency} {frete.toFixed(2)}
            </p>
          </div>
          <div className="border-b-2 flex flex-row justify-between mt-2">
            <p className="text-xl">Total Geral</p>
            <p className="text-xl">
              {currency} {valorTotal.toFixed(2)}
            </p>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default TotalCarrinho;
