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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Pedido = () => {
  const { frete, carrinhoItems, produtos } = useContext(ShopContext);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [method, setMethod] = useState(null);

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
    e.preventDefault();
    toast.success("Compra finalizada com sucesso!");
    console.log(formData);
    console.log(valorTotal);
    console.log(method);
  };

  useEffect(() => {
    let total = 0;

    const produtosCarrinho = [];

    for (const produtoId in carrinhoItems) {
      const produto = produtos.find((p) => p._id === produtoId);
      if (produto && carrinhoItems[produtoId] > 0) {
        const quantidade = carrinhoItems[produtoId];
        produtosCarrinho.push({ ...produto, quantidade });
        total += produto.preco * quantidade;
      }
    }

    setTotalProdutos(total);
    setValorTotal(total + frete);
  }, [carrinhoItems, frete, produtos]);

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
                required
              />
              <input
                type="text"
                name="sobrenome"
                placeholder="Sobrenome"
                className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.sobrenome}
                onChange={onChangeHandler}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Endereço de Email"
              className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              value={formData.email}
              onChange={onChangeHandler}
              required
            />

            <div className="flex gap-4">
              <input
                type="text"
                name="endereco"
                placeholder="Endereço Residencial"
                className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.endereco}
                onChange={onChangeHandler}
                required
              />
              <input
                type="text"
                name="numeroCasa"
                placeholder="Número Residencial"
                className="border border-gray-300 rounded-md w-1/4 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.numeroCasa}
                onChange={onChangeHandler}
                required
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
                required
              />
              <input
                type="text"
                name="estado"
                placeholder="Estado"
                className="border border-gray-300 rounded-md w-1/4 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.estado}
                onChange={onChangeHandler}
                required
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
                required
              />
              <input
                type="text"
                name="pais"
                placeholder="País"
                className="border border-gray-300 rounded-md w-1/4 p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                value={formData.pais}
                onChange={onChangeHandler}
                required
              />
            </div>

            <input
              type="number"
              name="telefone"
              placeholder="Telefone"
              className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              value={formData.telefone}
              onChange={onChangeHandler}
              required
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
                  className="flex items-center gap-1 border p-2 cursor-pointer rounded-xl"
                >
                  <p
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      method === "pix" ? "bg-green-400" : ""
                    }`}
                  />
                  <FontAwesomeIcon icon={faQrcode} className="h-5 mx-4" />
                  <span className="text-gray-500 text-sm font-medium">Pix</span>
                </div>

                <div
                  onClick={() => setMethod("boleto")}
                  className="flex items-center gap-1 border p-2 cursor-pointer rounded-xl"
                >
                  <p
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      method === "boleto" ? "bg-green-400" : ""
                    }`}
                  />
                  <FontAwesomeIcon icon={faCreditCard} className="h-5 mx-4" />
                  <span className="text-gray-500 text-sm font-medium">
                    Boleto
                  </span>
                </div>

                <div
                  onClick={() => setMethod("credito")}
                  className="flex items-center gap-1 border p-2 cursor-pointer rounded-xl"
                >
                  <p
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      method === "credito" ? "bg-green-400" : ""
                    }`}
                  />
                  <FontAwesomeIcon icon={faMoneyBillAlt} className="h-5 mx-4" />
                  <span className="text-gray-500 text-sm font-medium">
                    Crédito
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gray-700 w-36 h-9 text-white rounded-xl"
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
