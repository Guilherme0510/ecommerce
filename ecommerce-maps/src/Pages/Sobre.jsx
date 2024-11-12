import React from "react";
import Texto from "../Components/Texto";
import { images } from "../assets/assets";

const Sobre = () => {
  return (
    <div className="mt-10">
      <div className="text-center">
        <Texto text1={"SOBRE"} text2={"NÓS"} />
      </div>

      <div className="flex flex-col justify-center items-center md:flex-row w-full gap-10 mt-5">
        <div className="w-5/6 md:w-2/4" data-aos='fade-up' data-aos-duration='500'>
          <img src={images.img_sobre} alt="" />
        </div>
        <div className="w-5/6 md:w-2/4 flex items-center"data-aos='fade-down' data-aos-duration='500'>
          <p className="text-lg">
            Na Delícias do Pastel, nossa paixão por criar os melhores pastéis
            começou há mais de uma década. Fundada por Maria Silva, a pastelaria
            nasceu da vontade de compartilhar receitas tradicionais e
            autênticas, feitas com ingredientes frescos e selecionados. Desde
            então, temos nos dedicado a proporcionar uma experiência
            gastronômica única, onde cada pastel é preparado com carinho e
            atenção aos detalhes. <br />
            <br />
            Em nosso cardápio, você encontrará uma variedade de opções que
            atendem a todos os gostos: desde os recheios clássicos de carne e
            queijo até alternativas veganas e opções doces. Cada pastel é feito
            à mão, garantindo frescor e sabor em cada mordida. Nossa missão é
            oferecer não apenas pastéis, mas momentos de prazer e alegria a cada
            cliente que nos visita.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Texto text1={"POR QUE"} text2={"NOS ESCOLHER"} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
  <div
    className="border-b-2 md:border-b-0 md:border-r-2 md:border-r-yellow-200 p-5 h-[230px] flex flex-col gap-5 justify-center items-center"
    data-aos="fade-up"
    data-aos-duration="500"
    data-aos-delay="100"
  >
    <h1 className="text-xl">Ingredientes Frescos e de Qualidade</h1>
    <p>
      Utilizamos apenas os melhores ingredientes em nossos pastéis,
      garantindo sabor e frescor em cada porção. Trabalhamos com
      fornecedores locais para oferecer produtos sempre frescos e
      saborosos.
    </p>
  </div>
  <div
    className="border-b-2 md:border-b-0 md:border-r-2 md:border-r-yellow-200 p-5 h-[230px] flex flex-col gap-5 justify-center items-center"
    data-aos="fade-up"
    data-aos-duration="500"
    data-aos-delay="200"
  >
    <h1 className="text-xl">Receitas Tradicionais e Autênticas</h1>
    <p>
      Nossas receitas são baseadas em tradições familiares que foram
      passadas de geração em geração. Cada pastel carrega a história e o
      carinho que dedicamos à nossa arte.
    </p>
  </div>
  <div
    className="p-5 h-[230px] flex flex-col gap-5 justify-center items-center"
    data-aos="fade-up"
    data-aos-duration="500"
    data-aos-delay="300"
  >
    <h1 className="text-xl">Atendimento Excepcional</h1>
    <p>
      Nossa equipe é apaixonada pelo que faz e está sempre pronta para
      oferecer um atendimento cordial e personalizado. Queremos que cada
      cliente se sinta em casa em nossa pastelaria, criando uma
      experiência memorável a cada visita.
    </p>
  </div>
</div>

    </div>
  );
};

export default Sobre;
