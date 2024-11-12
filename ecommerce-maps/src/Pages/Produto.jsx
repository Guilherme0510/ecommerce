import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { images } from "../assets/assets.js";
import { ShopContext } from "../Context/Context.jsx";

const Produto = () => {
  const { id } = useParams();
  const { addParaCarrinho } = useContext(ShopContext);

  const produtos = [
    {
      id: "1",
      img: images.p1,
      nome: "Pastel de Carne",
      descricao: "Delicioso pastel de carne moída temperada.",
      preco: 19.99,
      detalhes:
        "Feito com carne moída, cebola, azeitonas e temperos especiais.",
      avaliacao: 4.5,
      imagens: [images.p1, images.p2, images.p3],
      relacionados: [
        { id: "2", img: images.p2, nome: "Pastel de Queijo", preco: 17.99 },
        { id: "3", img: images.p3, nome: "Pastel de Carne Seca", preco: 21.99 },
      ],
    },
    {
      id: "2",
      img: images.p2,
      nome: "Pastel de Queijo",
      descricao: "Pastel recheado com queijo derretido.",
      preco: 17.99,
      detalhes: "Recheio de queijo minas, perfeito para amantes de queijo.",
      avaliacao: 4.7,
      imagens: [images.p2, images.p4, images.p5],
      relacionados: [
        { id: "1", img: images.p1, nome: "Pastel de Carne", preco: 19.99 },
        { id: "3", img: images.p3, nome: "Pastel de Carne Seca", preco: 21.99 },
      ],
    },
    {
      id: "3",
      img: images.p3,
      nome: "Pastel de Carne Seca",
      descricao: "Pastel recheado com carne seca e queijo.",
      preco: 21.99,
      detalhes: "Carne seca desfiada com um toque de queijo coalho.",
      avaliacao: 4.8,
      imagens: [images.p3, images.p5, images.p6],
      relacionados: [
        { id: "1", img: images.p1, nome: "Pastel de Carne", preco: 19.99 },
        { id: "2", img: images.p2, nome: "Pastel de Queijo", preco: 17.99 },
      ],
    },
    {
      id: "4",
      img: images.p4,
      nome: "Pastel de Frango",
      descricao: "Pastel recheado com frango desfiado e temperos.",
      preco: 18.99,
      detalhes: "Feito com frango, milho, azeitonas e temperos caseiros.",
      avaliacao: 4.6,
      imagens: [images.p4, images.p7, images.p8],
      relacionados: [
        { id: "5", img: images.p5, nome: "Pastel de Palmito", preco: 16.99 },
        { id: "6", img: images.p6, nome: "Pastel de Camarão", preco: 25.99 },
      ],
    },
    {
      id: "5",
      img: images.p5,
      nome: "Pastel de Palmito",
      descricao: "Pastel recheado com palmito cremoso.",
      preco: 16.99,
      detalhes: "Uma combinação deliciosa de palmito com queijo e temperos.",
      avaliacao: 4.5,
      imagens: [images.p5, images.p6, images.p7],
      relacionados: [
        { id: "4", img: images.p4, nome: "Pastel de Frango", preco: 18.99 },
        { id: "6", img: images.p6, nome: "Pastel de Camarão", preco: 25.99 },
      ],
    },
    {
      id: "6",
      img: images.p6,
      nome: "Pastel de Camarão",
      descricao: "Pastel recheado com camarões temperados.",
      preco: 25.99,
      detalhes: "Camarões frescos com temperos especiais, muito saboroso.",
      avaliacao: 4.9,
      imagens: [images.p6, images.p8, images.p9],
      relacionados: [
        { id: "4", img: images.p4, nome: "Pastel de Frango", preco: 18.99 },
        { id: "5", img: images.p5, nome: "Pastel de Palmito", preco: 16.99 },
      ],
    },
    {
      id: "7",
      img: images.p7,
      nome: "Pastel de Banana",
      descricao: "Pastel doce recheado com banana e canela.",
      preco: 15.99,
      detalhes: "Um toque doce para finalizar a refeição.",
      avaliacao: 4.4,
      imagens: [images.p7, images.p8, images.p9],
      relacionados: [
        {
          id: "8",
          img: images.p8,
          nome: "Pastel de Doce de Leite",
          preco: 17.99,
        },
        { id: "9", img: images.p9, nome: "Pastel de Chocolate", preco: 19.99 },
      ],
    },
    {
      id: "8",
      img: images.p8,
      nome: "Pastel de Doce de Leite",
      descricao: "Pastel recheado com doce de leite cremoso.",
      preco: 17.99,
      detalhes: "Um doce irresistível para quem ama sobremesas.",
      avaliacao: 4.6,
      imagens: [images.p8, images.p9, images.p10],
      relacionados: [
        { id: "7", img: images.p7, nome: "Pastel de Banana", preco: 15.99 },
        { id: "9", img: images.p9, nome: "Pastel de Chocolate", preco: 19.99 },
      ],
    },
    {
      id: "9",
      img: images.p9,
      nome: "Pastel de Chocolate",
      descricao: "Pastel recheado com chocolate derretido.",
      preco: 19.99,
      detalhes: "Perfeito para os amantes de chocolate.",
      avaliacao: 4.8,
      imagens: [images.p9, images.p10, images.p1],
      relacionados: [
        { id: "7", img: images.p7, nome: "Pastel de Banana", preco: 15.99 },
        {
          id: "8",
          img: images.p8,
          nome: "Pastel de Doce de Leite",
          preco: 17.99,
        },
      ],
    },
    {
      id: "10",
      img: images.p10,
      nome: "Pastel de Frutas",
      descricao: "Pastel recheado com frutas sortidas.",
      preco: 20.99,
      detalhes: "Uma explosão de sabores com frutas frescas.",
      avaliacao: 4.7,
      imagens: [images.p10, images.p1, images.p2],
      relacionados: [
        { id: "7", img: images.p7, nome: "Pastel de Banana", preco: 15.99 },
        {
          id: "8",
          img: images.p8,
          nome: "Pastel de Doce de Leite",
          preco: 17.99,
        },
      ],
    },
  ];

  const produto = produtos.find((produto) => produto.id === id);

  if (!produto) {
    return <div>Produto não encontrado.</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2">
        <img
          src={produto.img}
          alt={produto.nome}
          className="w-full h-96 object-cover rounded-lg mb-4"
        />

        <h1 className="text-4xl font-bold">{produto.nome}</h1>
        <p className="text-lg font-semibold mt-2">
          R$ {produto.preco.toFixed(2)}
        </p>

        <div className="mt-4">
          <h2 className="text-2xl">Descrição</h2>
          <p className="mt-2">{produto.descricao}</p>
          <p className="mt-2 text-gray-600">{produto.detalhes}</p>
        </div>

        <button
          onClick={() => addParaCarrinho(produto)}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Adicionar ao Carrinho
        </button>
      </div>

      <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:ml-8">
        <h2 className="text-2xl">Galeria de Imagens</h2>
        <div className="flex flex-wrap mt-2">
          {produto.imagens.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={produto.nome}
              className="w-1/2 h-32 object-cover rounded-lg m-1"
            />
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl">Produtos Relacionados</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {produto.relacionados.map((rel) => (
              <div
                key={rel.id}
                className="flex flex-col items-center border rounded-lg p-2"
              >
                
                <img
                  src={rel.img}
                  alt={rel.nome}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="font-semibold">{rel.nome}</h3>
                <p className="text-lg">R$ {rel.preco.toFixed(2)}</p>
                <button
                  onClick={() => addParaCarrinho(produto)}
                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produto;
