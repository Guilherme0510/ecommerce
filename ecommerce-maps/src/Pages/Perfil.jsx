import React, { useState } from "react";
import { images } from "../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCartShopping,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Perfil = () => {
  const [selectedImage, setSelectedImage] = useState(images.user);
  const [pedidosTotais, setPedidosTotais] = useState([
    { id: 1, img: images.p1, nome: "Pastel de Carne", preco: 19.99 },
    { id: 2, img: images.p2, nome: "Pastel de Queijo", preco: 17.99 },
    { id: 3, img: images.p3, nome: "Pastel de Carne Seca", preco: 21.99 },
    { id: 4, img: images.p4, nome: "Pastel de Frango", preco: 18.99 },
    { id: 5, img: images.p5, nome: "Pastel de Camarão", preco: 24.99 },
  ]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-center items-center gap-8">
        <div className="w-[100px] h-[100px] relative border-4 rounded-full border-yellow-200">
          <img
            src={selectedImage}
            alt="User"
            className="w-full h-full rounded-full object-cover"
          />
          <label
            htmlFor="img-user"
            className="absolute bottom-2 right-2 text-blue-700 cursor-pointer text-xl border border-blue-700 rounded-full h-7 w-7 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faCamera} />
          </label>
          <input
            type="file"
            id="img-user"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </div>

        <div className="flex flex-col items-center justify-center mt-4">
          <p className="text-3xl">Guilherme Silva</p>
          <p className="text-lg">guissilval005@gmail.com</p>
        </div>
      </div>

      <div className="mx-auto flex flex-col gap-4 px-7 mt-8 bg-yellow-50   p-6 rounded-xl">
        <h1 className="text-4xl font-semibold my-2 bebas-neue-regular">Meus Pedidos</h1>      
        <div className="flex flex-col gap-2">
          {pedidosTotais.length > 0 ? (
            pedidosTotais.map((item, index) => (
              <div
                key={item.id}
                className="relative group shadow-sm border-t rounded-s-3xl bg-white"
                data-aos="fade-up"
                data-aos-duration="300"
                data-aos-delay={`${200 + index * 100}`}
              >
                <div className="flex items-center">
                  <img
                    src={item.img}
                    alt=""
                    className="object-cover w-[100px] h-full rounded-l-3xl"
                  />
                  <div className="flex flex-col mx-auto justify-center items-center gap-4 px-4">
                    <h1 className="text-2xl">{item.nome}</h1>
                    <p className="font-semibold">R$ {item.preco}</p>
                  </div>
                  
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Nenhum produto encontrado</p>
          )}
        </div>
      </div>

      {pedidosTotais.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 bg-white h-[150px] w-screen flex items-center justify-between px-12 p-4 mx-5 border border-black flex-row rounded-3xl">
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-lg">
              Total: R${" "}
              {pedidosTotais
                .reduce((total, item) => total + item.preco, 0)
                .toFixed(2)}
            </h2>
            <h2 className="text-lg font-semibold">Quantidade: {pedidosTotais.length}</h2>
          </div>
          <Link
            to={"/carrinho"}
            className="text-2xl border border-black w-16 h-16 rounded-full flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Perfil;
