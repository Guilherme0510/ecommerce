import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/Context";
import axios from "axios";

const Perfil = () => {
  const { token, backendUrl, currency } = useContext(ShopContext);
  const [pedidosTotais, setPedidosTotais] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de loading

  const pedidosUsuario = async () => {
    try {
      if (!token) return null;

      setLoading(true); // Começar o loading

      const response = await axios.post(
        backendUrl + "/api/pedido/pedidousuario",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        let todosPedidos = [];

        // Processar os pedidos
        for (const pedido of response.data.pedidos) {
          // Iterar sobre os itens do pedido
          for (const item of pedido.itens) {
            // Adicionar informações adicionais ao item
            item["status"] = pedido.status;
            item["pagamento"] = pedido.pagamento;
            item["metodoPagamento"] = pedido.metodoPagamento;
            item["data"] = pedido.data;

            // Buscar o produto para esse item
            const produtoResponse = await axios.post(
              backendUrl + "/api/produto/unico",
              {
                id: item.produtoId,
              }
            );

            if (produtoResponse.data.success) {
              item.produto = produtoResponse.data.produto; // Adiciona o produto completo ao item
            } else {
              item.produto = {}; // Fallback caso o produto não seja encontrado
            }

            todosPedidos.push(item);
          }
        }

        setPedidosTotais(todosPedidos);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Termina o loading
    }
  };

  useEffect(() => {
    pedidosUsuario();
  }, [token]);

  return (
    <div className="mt-8">
      <div className="mx-auto flex flex-col gap-4 px-7 mt-8 bg-yellow-50 p-6 rounded-xl">
        <h1 className="text-4xl font-semibold my-2">Meus Pedidos</h1>

        {/* Indicador de loading */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="spinner-border text-blue-500" role="status">
              <span className="sr-only">Carregando...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {pedidosTotais.length === 0 ? (
              <p className="text-center text-lg font-semibold">
                Nenhum pedido ainda.
              </p>
            ) : (
              pedidosTotais.map((pedido, index) => {
                return (
                  <div
                    key={index}
                    className="relative group shadow-sm border-t rounded-s-3xl bg-white"
                  >
                    <div className="flex flex-col items-center justify-center gap-6 px-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div className="flex flex-row items-start gap-4 p-4 border rounded-lg shadow-md">
                          <img
                            src={
                              pedido.produto?.imagem[0] || "default_image_url"
                            }
                            alt={pedido.produto?.nome || "Produto sem nome"}
                            className="object-cover w-[200px] h-[200px] rounded-lg"
                          />
                          <div>
                            <h2 className="text-2xl font-semibold">
                              {pedido.produto?.nome ||
                                "Nome do produto indisponível"}
                            </h2>
                            <p className="text-lg">
                              Quantidade: {pedido.quantidade || "N/A"}
                            </p>
                            <p className="text-lg font-semibold">
                              {currency}{" "}
                              {pedido.produto?.preco * pedido.quantidade}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-4 p-4 border rounded-lg shadow-md">
                          <h3 className="text-xl font-semibold">
                            Detalhes do Pedido
                          </h3>
                          <p>Status: {pedido.status || "Indefinido"}</p>
                          <p
                            className={`${
                              pedido.pagamento
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            Pagamento: {pedido.pagamento ? "Pago" : "Pendente"}
                          </p>
                          <p>Método de Pagamento: {pedido.metodoPagamento}</p>
                          <p>
                            Data do Pedido:{" "}
                            {new Date(pedido.data).toLocaleDateString() ||
                              "Indefinido"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;
