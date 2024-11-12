import React, { useState, useEffect, useContext } from "react";
import Texto from "../Components/Texto";
import TotalCarrinho from "../Components/TotalCarrinho";
import { ShopContext } from "../Context/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faCreditCard,
  faWallet,
  faQrcode,
  faBarcode,
  faMoneyBillAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Pedido = () => {
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const { frete } = useContext(ShopContext);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [method, setMethod] = useState(null);

  const produtosCarrinho = [
    { id: 1, nome: "Pastel de Carne", preco: 19.99 },
    { id: 2, nome: "Pastel de Queijo", preco: 17.99 },
    { id: 3, nome: "Pastel de Carne Seca", preco: 21.99 },
  ];

  const [formData, setFormData] = useState({
    primeiroNome: "",
    sobrenome: "", 
    email: "",
    endereco: "",
    numeroCasa: "",
    cidade: "",
    estado: "",
    cep: "",
    pais: "",
    telefone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    toast.success("Compra finalizada com sucesso!");
    console.log(formData);
    console.log(valorTotal);
    console.log(method);
    
  }

  useEffect(() => {
    const total = produtosCarrinho.reduce(
      (acc, produto) => acc + produto.preco,
      0
    );
    setTotalProdutos(total);
    setValorTotal(total + frete);
  }, [produtosCarrinho, frete]);


  return (
    <form onSubmit={onSubmitHandler}>
      <div className="mt-10 mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-8">
          <Texto text1={"INFORMAÇÕES"} text2={"DE ENTREGA"} />
        </div>

        <div className="flex flex-col justify-between md:flex-row gap-8">
          <div className="flex flex-col w-full md:w-3/6 gap-4">
            <div className="flex gap-4">
              <input
                type="text"
                name="primeiroNome"
                placeholder="Primeiro Nome"
                className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.primeiroNome}
                onChange={onChangeHandler}
              />
              <input
                type="text"
                name="sobrenome" 
                placeholder="Sobrenome"
                className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.sobrenome}
                onChange={onChangeHandler}
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Endereço de Email"
              className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              value={formData.email}
              onChange={onChangeHandler}
            />

            <div className="flex gap-4">
              <input
                type="text"
                name="endereco"
                placeholder="Endereço Residencial"
                className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.endereco}
                onChange={onChangeHandler}
              />
              <input
                type="text"
                name="numeroCasa"
                placeholder="Número Residencial"
                className="border border-gray-300 rounded-md w-1/4 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.numeroCasa}
                onChange={onChangeHandler}
              />
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                name="cidade"
                placeholder="Cidade"
                className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.cidade}
                onChange={onChangeHandler}
              />
              <input
                type="text"
                name="estado"
                placeholder="Estado"
                className="border border-gray-300 rounded-md w-1/4 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.estado}
                onChange={onChangeHandler}
              />
            </div>

            <div className="flex gap-4">
              <input
                type="number"
                name="cep"
                placeholder="CEP"
                className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.cep}
                onChange={onChangeHandler}
              />
              <input
                type="text"
                name="pais"
                placeholder="País"
                className="border border-gray-300 rounded-md w-1/4 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.pais}
                onChange={onChangeHandler}
              />
            </div>

            <input
              type="number"
              name="telefone"
              placeholder="Telefone"
              className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              value={formData.telefone}
              onChange={onChangeHandler}
            />
          </div>

          <div className="w-full md:w-2/5 bg-gray-50 p-2 rounded-md shadow-md flex gap-4 flex-col">
            <TotalCarrinho
              totalProdutos={totalProdutos}
              valorTotal={valorTotal}
            />
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div
                  onClick={() => setMethod("pix")}
                  className="flex items-center gap-1 border p-2 cursor-pointer rounded-xl hover:scale-[1.02] hover:bg-gray-100"
                >
                  <p
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      method === "pix" ? "bg-green-400" : ""
                    }`}
                  ></p>
                  <FontAwesomeIcon icon={faQrcode} className="h-5 mx-4" />
                  <span className="text-gray-500 text-sm font-medium">Pix</span>
                </div>

                <div
                  onClick={() => setMethod("boleto")}
                  className="flex items-center gap-1 border p-2 cursor-pointer rounded-xl hover:scale-[1.02] hover:bg-gray-100"
                >
                  <p
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      method === "boleto" ? "bg-green-400" : ""
                    }`}
                  ></p>
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="h-5 mx-4"
                  />
                  <span className="text-gray-500 text-sm font-medium">
                    Crédito
                  </span>
                </div>

                <div
                  onClick={() => setMethod("credito")}
                  className="flex items-center gap-1 border p-2 cursor-pointer rounded-xl hover:scale-[1.02] hover:bg-gray-100"
                >
                  <p
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      method === "credito" ? "bg-green-400" : ""
                    }`}
                  ></p>
                  <FontAwesomeIcon icon={faMoneyBillAlt} className="h-5 mx-4" />
                  <span className="text-gray-500 text-sm font-medium">
                    Pagar na entrega
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                type="submit"
                  className="bg-gray-700 w-36 h-9 text-white rounded-xl flex items-center justify-center hover:rotate-2 hover:bg-gray-900 transition-all duration-300 ease-in-out"
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Pedido;
