import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import { images } from "../assets/assets";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { ShopContext } from "../Context/Context";

const Navbar = () => {
  const { navigate, setToken, contagemCarrinho, token } = useContext(ShopContext);
  const [isVisible, setIsVisible] = useState(false);
  const [bgColor, setBgColor] = useState("bg-white");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken(""); 
  };

  const toggleProfileDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleOptionClick = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleScroll = useCallback(() => {
    setBgColor(
      window.scrollY > 80 ? "bg-yellow-100 shadow-md h-[90px]" : "bg-white"
    );
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <nav
      className={`sticky top-0 z-10 transition-all duration-700 flex items-center justify-between px-8 py-1 w-full h-[75px] ${bgColor}`}
    >
      {/* Logo */}
      <Link to="/">
        <img className="w-36" src={images.logo} alt="Logo" />
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex justify-center flex-grow gap-8 mx-4">
        {["Início", "Produtos", "Sobre Nós", "Contato"].map((link, index) => (
          <NavLink
            key={index}
            to={
              link === "Início"
                ? "/"
                : link === "Sobre Nós"
                ? "/sobre"
                : `/${link.toLowerCase().replace(" ", "")}`
            }
            className="relative group"
          >
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            <span className="relative z-10 text-[17px]">{link}</span>
          </NavLink>
        ))}
      </div>

      <div className="items-center gap-4 hidden md:flex">
        {token ? ( 
          <div className="relative">
            <NavLink to="#" onClick={toggleProfileDropdown} aria-label="Perfil">
              <FontAwesomeIcon
                className="hover:rotate-12"
                icon={faUser}
                fontSize="20px"
              />
            </NavLink>
            {isDropdownOpen && (
              <DropdownMenu onClose={handleOptionClick} onLogout={logout} />
            )}
          </div>
        ) : (
          <NavLink to="/login" aria-label="Perfil">
            <FontAwesomeIcon
              className="hover:rotate-12"
              icon={faUser}
              fontSize="20px"
            />
          </NavLink>
        )}
        <NavLink
          to="/carrinho"
          aria-label="Carrinho"
          className="relative flex items-center hover:rotate-12"
        >
          <FontAwesomeIcon
            icon={faCartShopping}
            fontSize="20px"
            data-tooltip-id="carrinhoTooltip"
            aria-hidden="true"
          />
          <span className="absolute bottom-0 left-3 px-1 text-[10px] font-semibold rounded-full bg-yellow-600 text-white">
            {contagemCarrinho()}
          </span>
          <Tooltip id="carrinhoTooltip" place="top" effect="solid">
            Carrinho
          </Tooltip>
        </NavLink>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="flex items-center md:hidden gap-4">
        <ProfileAndCartIcons
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleProfileDropdown}
          onClose={handleOptionClick}
          token={token}
          logout={logout}
        />
        <img
          onClick={() => setIsVisible(!isVisible)}
          src={images.dropdown_nav}
          className={`w-5 cursor-pointer ${isVisible ? "opacity-0" : "delay-500"}`}
          alt="Menu"
        />
      </div>

      {/* Mobile Dropdown Menu */}
      <MobileDropdownMenu
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </nav>
  );
};

// Dropdown menu component
const DropdownMenu = ({ onClose, onLogout }) => (
  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50">
    {["Perfil", "Sair"].map((option, index) => (
      <NavLink
        key={index}
        to={option === "Sair" ? "#" : `/${option.toLowerCase()}`}
        className="block px-4 py-2 hover:bg-gray-100"
        onClick={option === "Sair" ? onLogout : onClose}
      >
        {option}
      </NavLink>
    ))}
  </div>
);

// Mobile Profile and Cart Icons
const ProfileAndCartIcons = ({
  isDropdownOpen,
  toggleDropdown,
  onClose,
  token,
  logout,
}) => (
  <div className="relative flex gap-3">
    {token ? (
      <>
        <div className="relative">
          <NavLink to="#" onClick={toggleDropdown} aria-label="Perfil">
            <FontAwesomeIcon
              className="hover:rotate-12"
              icon={faUser}
              fontSize="20px"
            />
          </NavLink>
          {isDropdownOpen && (
            <DropdownMenu onClose={onClose} onLogout={logout} />
          )}
        </div>
      </>
    ) : (
      <NavLink to="/login" aria-label="Perfil">
        <FontAwesomeIcon
          className="hover:rotate-12"
          icon={faUser}
          fontSize="20px"
        />
      </NavLink>
    )}
    <NavLink to="/carrinho" aria-label="Carrinho">
      <FontAwesomeIcon
        icon={faCartShopping}
        fontSize="20px"
        data-tooltip-id="carrinhoMobileTooltip"
      />
      <Tooltip id="carrinhoMobileTooltip" place="top" effect="solid">
        Carrinho
      </Tooltip>
    </NavLink>
  </div>
);

// Mobile Dropdown Menu
const MobileDropdownMenu = ({ isVisible, onClose }) => (
  <div
    className={`absolute top-full right-0 w-full overflow-hidden bg-white transition-all duration-500 ease-in-out ${
      isVisible ? "max-h-screen" : "max-h-0"
    }`}
  >
    <div className="flex flex-col text-gray-600">
      <div onClick={onClose} className="flex items-center gap-4 p-3">
        <img src={images.cross_icon} className="h-4 rotate-180" alt="Fechar" />
        <p>Fechar</p>
      </div>
      <ul className="flex flex-col gap-4 p-3">
        {["Início", "Produtos", "Sobre Nós", "Contato"].map((link, index) => (
          <li key={index}>
            <NavLink
              to={`/${link.toLowerCase().replace(" ", "")}`}
              onClick={onClose}
              className="text-black hover:border-b-2 border-yellow-500 transition-transform"
            >
              {link}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default Navbar;
