import React, { useState, useEffect, useContext } from "react";
import Texto from "./Texto.jsx";
import ItemProduto from "./ItemProduto";
import { Link } from "react-router-dom";
import axios from "axios"; // Importando axios
import { ShopContext } from "../Context/Context.jsx";
import { toast } from "react-toastify";

const Destaques = () => {
  const { backendUrl } = useContext(ShopContext);
  const [pDestaques, setPDestaques] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controle de loading
  const [error, setError] = useState(null); // Estado para controle de erro

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/produto/listaproduto");
        if (response.data.success) {
          // Pega os últimos 5 produtos
          setPDestaques(response.data.lista.slice(-5)); // Pega os 5 últimos produtos
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false); // Finaliza o estado de loading
      }
    };

    fetchProdutos();
  }, [backendUrl]);

  if (loading) return <div>Carregando produtos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <Texto text1="NOSSOS" text2="DESTAQUES" />
        <p className="text-[16px] text-center">
          Conheça os nossos destaques: cada pastel que servimos é uma
          obra-prima, elaborada com os melhores ingredientes e uma pitada de
          amor. Experimente a crocância perfeita e os recheios que vão deixar
          você pedindo mais!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-9 justify-center">
        {pDestaques.map((item, index) => (
          <div
            key={item._id}
            className="text-center overflow-hidden"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay={`${200 + index * 100}`}
          >
            <ItemProduto
            key={item._id}
              produtoId={item._id}
              image={item.imagem[0]}
              name={item.nome}
              preco={item.preco}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destaques;
