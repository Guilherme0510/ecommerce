import React from "react";
import { images } from "../assets/assets";
import { Link } from 'react-router-dom'; 

const Footer = () => {
  return (<>
  <hr className="mt-20 w-4/5 mx-auto mb-4"/>
    <div className="px-8 flex flex-col gap-5 mb-4" data-aos='fade-down' data-aos-duration='500'>
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] items-top justify-center gap-5">
        <div className="flex flex-col md:items-start items-center" data-aos='fade-up' data-aos-duration='500' data-aos-delay='500'>
          <img className="w-32 md:w-56" src={images.logo} alt="Logo da Pastelaria" />
          <p className="text-base w-3/4 md:text-left text-center">
            Na nossa pastelaria, cada mordida é uma explosão de sabor, feita com
            ingredientes frescos e receitas que aquecem o coração.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-center" data-aos='fade-down' data-aos-duration='500' data-aos-delay='500'>
          <h1 className="font-bold text-xl">Companhia</h1>
          <div className="flex flex-col gap-3">
            <Link to='/' className=" hover:underline">Inicio</Link>
            <Link to='/sobre' className=" hover:underline">Sobre</Link>
            <Link to='/produtos' className=" hover:underline">Produtos</Link>
            <Link to='/contato' className=" hover:underline">Contato</Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-center" data-aos='fade-up' data-aos-duration='500' data-aos-delay='500'>
          <h1 className="font-bold text-xl">Contate já</h1>
          <div className="flex flex-col gap-3">
            <Link to='tel:70970707070' className=" hover:underline">(70) 97070-7070</Link>
            <Link to='mailto:test@test.com' className=" hover:underline">test@test.com</Link>
          </div>
        </div>
      </div>
      <hr className="w-4/5 mx-auto" />
      <div data-aos='fade-up' data-aos-duration='500' data-aos-delay='500'>
        <p className="text-center">
          Copyright 2024@ Teste.com - Todos os Direitos Reservados
        </p>
      </div>
    </div>
    </>
  );
};

export default Footer;
