import React, { useState } from "react";
import Texto from "./Texto.jsx";
import { images } from "../assets/assets.js";
import ItemProduto from "./ItemProduto";
import { Link } from "react-router-dom";

const Destaques = () => {
  const [pDestaques] = useState([
    { id: 1, img: images.p1, nome: "Pastel de Carne", preco: 19.99 },
    { id: 2, img: images.p2, nome: "Pastel de Queijo", preco: 17.99 },
    { id: 3, img: images.p3, nome: "Pastel de Carne Seca", preco: 21.99 },
    { id: 4, img: images.p4, nome: "Pastel de Frango", preco: 18.99 },
    { id: 5, img: images.p5, nome: "Pastel de Camarão", preco: 24.99 },
  ]);

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
        {pDestaques.slice(0, 5).map((item, index) => (
          <div
            key={item.id}
            className="text-center overflow-hidden"
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay={`${200 + index * 100}`}
          >
              <ItemProduto
                id={item.id}
                image={item.img}
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
