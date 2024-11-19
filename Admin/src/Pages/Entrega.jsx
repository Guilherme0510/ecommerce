import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { imagens } from "../assets/assets";

const Entrega = ({ token }) => {
  const [pedidos, setPedidos] = useState([]);
  const [pesquisa, setPesquisa] = useState(""); // Estado para a pesquisa

  // Função para buscar todos os pedidos
  const fetchTodosPedidos = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/pedido/lista`,
        {},
        { headers: { token } }
      );
      console.log("Resposta da API:", response.data.pedidos);

      if (response.data.success) {
        // Ordena os pedidos por data (do mais recente para o mais antigo)
        const pedidosOrdenados = response.data.pedidos.sort(
          (a, b) => new Date(b.data) - new Date(a.data)
        );
        setPedidos(pedidosOrdenados);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast.error("Erro ao buscar pedidos. Tente novamente.");
    }
  };

  // Função para atualizar o status do pedido
  const handleStatusChange = async (pedidoId, novoStatus) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/pedido/status",
        { pedidoId, status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        await fetchTodosPedidos();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Erro ao atualizar status");
    }
  };

  const onChange = (e, pedidoId) => {
    const novoStatus = e.target.value;
    handleStatusChange(pedidoId, novoStatus);
  };

  // Função para filtrar pedidos com base na pesquisa
  const filtrarPedidos = () => {
    return pedidos.filter(
      (pedido) =>
        // Pesquisa no nome do cliente
        pedido.endereco?.primeiroNome
          .toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        pedido.endereco?.sobrenome
          .toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        pedido.itens?.some((item) =>
          item.nome.toLowerCase().includes(pesquisa.toLowerCase())
        )
    );
  };

  useEffect(() => {
    fetchTodosPedidos();
  }, [token]);

  return (
    <div>
      <h1>Página de Pedidos</h1>

      {/* Barra de Pesquisa */}
      <div className="mb-4">
        <input
          type="text"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          placeholder="Pesquisar por nome"
          className="border p-2 rounded-lg w-full"
        />
      </div>

      <div>
        {Array.isArray(pedidos) && pedidos.length > 0 ? (
          filtrarPedidos().map((pedido, index) => (
            <div
              className="flex items-center justify-around gap-3 border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
              key={index}
            >
              {/* Imagem do pedido */}
              <div>
                <img
                  src={imagens.parcel || "defaultImage.png"}
                  alt="Imagem do pedido"
                  onError={(e) => (e.target.src = "defaultImage.png")}
                />
                {pedido.itens?.length ? (
                  pedido.itens.map((item, itemIndex) => (
                    <p className="py-0.5" key={itemIndex}>
                      {item.nome} x {item.quantidade}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum item encontrado.</p>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:justify-around justify-center items-center md:gap-[100px]">
                {/* Coluna 1 */}
                <div>
                  <h3 className="font-bold">Endereço de entrega:</h3>
                  <p>
                    {pedido.endereco?.primeiroNome} {pedido.endereco?.sobrenome}
                  </p>
                  <p>
                    {pedido.endereco?.endereco}, {pedido.endereco?.numeroCasa}
                  </p>
                  <p>
                    {pedido.endereco?.cidade} - {pedido.endereco?.estado},{" "}
                    {pedido.endereco?.cep}
                  </p>
                  <p>{pedido.endereco?.pais}</p>
                  <p>{pedido.endereco?.telefone}</p>
                </div>

                <div>
                  <h3 className="font-bold mt-3">Método de Pagamento:</h3>
                  <p>{pedido.metodoPagamento}</p>

                  <select
                    value={pedido.status}
                    onChange={(e) =>
                      handleStatusChange(pedido._id, e.target.value)
                    }
                    className="mt-2 w-full"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em Andamento</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>

                  <h3 className="font-bold mt-3">Pagamento:</h3>
                  <p>{pedido.pagamento ? "Pago" : "Não Pago"}</p>

                  <h3 className="font-bold mt-3">Data do Pedido:</h3>
                  <p>{new Date(pedido.data).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Entrega;
