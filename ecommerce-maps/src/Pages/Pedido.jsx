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
import axios from "axios";
import ModalQRCode from "../Components/QrCode";

const Pedido = () => {
  const { frete, carrinhoItems, produtos, backendUrl, token, navigate } =
    useContext(ShopContext);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [method, setMethod] = useState(null);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [copiaEColaPix, setCopiaEColaPix] = useState("");

  const [formData, setFormData] = useState({
    primeiroNome: "",
    sobrenome: "",
    email: "",
    cpf: "",
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
    let itensPedido = [];
    for (const [itemId, quantidade] of Object.entries(carrinhoItems)) {
      if (quantidade > 0) {
        const itemInfo = produtos.find((produto) => produto._id === itemId);
        if (itemInfo) {
          itensPedido.push({
            produtoId: itemInfo._id,
            quantidade: quantidade,
            nome: itemInfo.nome,
          });
        }
      }
    }
    const nomeCompleto = formData.primeiroNome + " " + formData.sobrenome;

    const pedidoData = {
      usuarioId: formData.email,
      itens: itensPedido,
      endereco: { ...formData },
      metodoPagamento: method,
      pagamento: false,
      cpf: formData.cpf,
      nome: nomeCompleto,
      preco: valorTotal.toFixed(2),
    };

    console.log("Pedido enviado para gerar o QR Code:", pedidoData);

    try {
      switch (method) {
        case "pix":
          try {
            const response = await axios.post(
              `${backendUrl}/api/pedido/pix-qr-code`,
              pedidoData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("Resposta da API:", response.data); // Verifique o que está sendo retornado

            // Agora acessamos a chave qrCode, que contém os dados qrcode e imagemQrcode
            const { qrcode, imagemQrcode } = response.data.qrCode;

            if (imagemQrcode && qrcode) {
              console.log("QR Code gerado:", imagemQrcode);
              toast.success("QR Code gerado com sucesso!");

              // Atualiza o estado com os dados recebidos
              setCopiaEColaPix(qrcode);
              setQrCodeUrl(imagemQrcode);
              setShowModal(true);
            } else {
              throw new Error("Dados de QR Code ausentes na resposta.");
            }
          } catch (error) {
            toast.error("Erro ao gerar QR Code!");
            console.error("Erro:", error.response?.data || error.message);
          }

          break;

        default:
          toast.error("Método de pagamento desconhecido.");
          break;

        case "teste":
          try {
            const response = await axios.post(
              backendUrl + "/api/pedido/fazer_pedido",
              pedidoData,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
              toast.success("Pedido teste realizado");
            } else {
              toast.error(response.data.message && "Erro pedido teste");
            }
          } catch (error) {
            console.log(error);
            toast.error(response.data.message && "Erro pedido teste");
          }
          break;

        case "stripe":
          const response = await axios.post(
            backendUrl + "/api/pedido/stripe",
            pedidoData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.success) {
            const { session_url } = response.data;
            window.location.replace(session_url);
          } else {
            toast.error(response.data.message);
          }
          break;
      }
    } catch (error) {
      toast.error("Erro ao processar o pedido!");
      console.error(error);
    }

    // navigate('/perfil')
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
              type="number"
              name="cpf"
              placeholder="Digite seu CPF (Apenas Números)"
              className="border border-gray-300 rounded-md w-full p-3 text-gray-800 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              value={formData.cpf}
              onChange={onChangeHandler}
              required
            />

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
                  onClick={() => setMethod("teste")}
                  className="flex items-center gap-1 border p-2 cursor-pointer rounded-xl"
                >
                  <p
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      method === "teste" ? "bg-green-400" : ""
                    }`}
                  />
                  <FontAwesomeIcon icon={faQrcode} className="h-5 mx-4" />
                  <span className="text-gray-500 text-sm font-medium">
                    teste
                  </span>
                </div>


                <div
                  onClick={() => setMethod("stripe")}
                  className="flex items-center gap-1 border p-2 cursor-pointer rounded-xl"
                >
                  <p
                    className={`min-w-3.5 h-3.5 border rounded-full ${
                      method === "stripe" ? "bg-green-400" : ""
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
      <ModalQRCode
        showModal={showModal}
        qrCodeUrl={qrCodeUrl}
        copiaECola={copiaEColaPix}
        closeModal={() => setShowModal(false)}
      />
    </form>
  );
};

export default Pedido;
