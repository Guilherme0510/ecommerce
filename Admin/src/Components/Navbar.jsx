import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faList,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate } from "react-router-dom";
import { imagens } from "../assets/assets";
import { useState } from "react";

const Navbar = ({setToken}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

 
  return (
    <div className="w-[15%] min-h-screen border-r-2 bg-orange-400 shadow-md">
      <div className="bg-white h-1/6 px-2 flex justify-between items-center w-full border-b border-orange-800">
        <div className="w-1/3 relative">
          <img
            src={imagens.adm}
            alt=""
            className="rounded-full border border-black cursor-pointer"
            onClick={toggleMenu}
          />
          {isOpen && (
            <div className="absolute top-full mt-2 bg-white shadow-md rounded-lg  w-full">
              <div className="p-2 hover:bg-gray-200 cursor-pointer hover:rounded-t-lg">
                Editar
              </div>
              <div className="p-2 hover:bg-red-400  cursor-pointer hover:rounded-b-lg" onClick={() => setToken('')} >
                Sair
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p>Nome</p>
          <p>Email</p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-10 h-5/6">
        <Link to={"/add"} className="relative group">
          <div className="text-xl animacao-navbar transition-transform duration-1000 bg-orange-200 hover:bg-white p-5 rounded-xl">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
          </div>
          <span className="text-xl italic absolute top-1/2 -right-12 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            Adicionar
          </span>
        </Link>
        <Link to={"/lista"} className="relative group">
          <div className="text-xl animacao-navbar transition-transform duration-1000 bg-orange-200 hover:bg-white p-5 rounded-xl">
            <FontAwesomeIcon icon={faList} />
          </div>
          <span className="text-xl italic absolute top-1/2 -right-12 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            Produtos
          </span>
        </Link>
        <Link to={"/status"} className="relative group">
          <div className="text-xl animacao-navbar transition-transform duration-1000 bg-orange-200 hover:bg-white p-5 rounded-xl">
            <FontAwesomeIcon icon={faTruckFast} />
          </div>
          <span className="text-xl italic absolute top-1/2 -right-12 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            Status
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
