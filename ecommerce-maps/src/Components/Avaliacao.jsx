import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faStar as solidStar,
  faStarHalfAlt as halfStar,
  faStar as regularStar,
} from "@fortawesome/free-solid-svg-icons";
import Bolinhas from './Bolinhas-Design'

const Avaliacao = () => {
  const avaliacoes = [
    {
      id: 1,
      nome: "Maria Silva",
      comentario: "Os pastéis são incríveis! Super recomendo!",
      estrelas: 5,
    },
    {
      id: 2,
      nome: "João Pereira",
      comentario: "Muito saboroso, mas poderia ser um pouco mais crocante.",
      estrelas: 3.5,
    },
    {
      id: 3,
      nome: "Ana Souza",
      comentario: "Atendimento excelente e pastéis deliciosos!",
      estrelas: 4,
    },
    {
      id: 4,
      nome: "Carlos Almeida",
      comentario: "Não gostei do sabor. Espero que melhorem.",
      estrelas: 2,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 3 < avaliacoes.length ? prev + 3 : prev));
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 3 >= 0 ? prev - 3 : prev));
      setFade(true);
    }, 300);
  };

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FontAwesomeIcon key={i} icon={solidStar} className="text-yellow-500" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FontAwesomeIcon key={i} icon={halfStar} className="text-yellow-500" />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={regularStar} className="text-yellow-500 opacity-50" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">Feedbacks de Clientes</h1>
          <p className="text-base font-light">Não se preocupe. Confie em nossos clientes.</p>
        </div>
        <div className="flex flex-row gap-4">
          <button
            onClick={handlePrev}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-yellow-200 hover:bg-yellow-400 duration-300 transition-all"
            disabled={currentIndex === 0}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            onClick={handleNext}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-yellow-200 hover:bg-yellow-400 duration-300 transition-all"
            disabled={currentIndex + 3 >= avaliacoes.length}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      <Bolinhas />

      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {avaliacoes.slice(currentIndex, currentIndex + 3).map((avaliacao) => (
          <div key={avaliacao.id} className="p-4 border rounded-md shadow-md bg-white">
            <h2 className="font-bold">{avaliacao.nome}</h2>
            <div className="my-2">{renderStarRating(avaliacao.estrelas)}</div>
            <p>{avaliacao.comentario}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Avaliacao;
