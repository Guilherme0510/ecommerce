import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/Context";

const ItemProduto = ({ produtoId, image, name, preco }) => {
  const { currency } = useContext(ShopContext);


  return (
    <Link to={`/produto/${produtoId}`} className="text-gray-700 cursor-pointer">
      <div className="flex flex-col items-center">
        <div className="overflow-hidden">
          <img
            src={image}
            className={` h-[200px] object-cover rounded-xl hover:scale-110 transition ease-in-out`} 
            alt={name || 'Produto'}
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">{currency} {preco}</p>
      </div>
    </Link>
  );
};

export default ItemProduto;
