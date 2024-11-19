import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faList,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import { imagens } from "../assets/assets";

const Navbar = ({ setToken }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const adminName = import.meta.env.VITE_EMAIL_NOME;
  const adminEmail = import.meta.env.VITE_EMAIL_EMAIL;

  return (
    <div className="w-full sm:w-[15%] h-full sm:h-screen bg-orange-400 shadow-md flex flex-col">
      {/* Header */}
      <div className="bg-white px-2 py-4 flex flex-col sm:flex-row justify-between items-center border-b border-orange-800">
        <div className="w-1/3 relative">
          <img
            src={imagens.adm}
            alt=""
            className="rounded-full border border-black cursor-pointer"
            onClick={toggleMenu}
          />
          {isOpen && (
            <div className="absolute top-full mt-2 bg-white shadow-md rounded-lg w-full">
              <div
                className="p-2 hover:bg-red-400 cursor-pointer hover:rounded-b-lg"
                onClick={() => setToken("")}
              >
                Sair
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center sm:items-start mt-3 sm:mt-0 text-center sm:text-left">
          <p>Nome: {adminName}</p>
          <p>Email: {adminEmail}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex sm:flex-col justify-center sm:items-start md:items-center gap-10 sm:h-5/6 p-4">
        <Link to={"/add"} className="relative group ">
          <div className="text-xl transition-transform duration-1000 md:hover:bg-white bg-orange-200 p-5 rounded-xl">
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
          </div>
          <span className="text-xl italic absolute top-1/2 -right-12 transform translate-x-1/2 -translate-y-1/2 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100">
            Adicionar
          </span>
        </Link>

        <Link to={"/lista"} className="relative group ">
          <div className="text-xl transition-transform duration-1000 md:hover:bg-white bg-orange-200 p-5 rounded-xl">
            <FontAwesomeIcon icon={faList} />
          </div>
          <span className="text-xl italic absolute top-1/2 -right-12 transform translate-x-1/2 -translate-y-1/2 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100">
            Produtos
          </span>
        </Link>

        <Link to={"/status"} className="relative group ">
          <div className="text-xl transition-transform duration-1000 md:hover:bg-white bg-orange-200 p-5 rounded-xl">
            <FontAwesomeIcon icon={faTruckFast} />
          </div>
          <span className="text-xl italic absolute top-1/2 -right-12 transform translate-x-1/2 -translate-y-1/2 opacity-0 md:group-hover:opacity-100  transition-opacity duration-300 delay-100">
            Status
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
