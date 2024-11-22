import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { imagens } from "../assets/assets";
import { faRightLong, faLeftLong } from "@fortawesome/free-solid-svg-icons";

const Entrega = ({ token }) => {
  const [pedidos, setPedidos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtroPagamento, setFiltroPagamento] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(3);

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

  const handlePagamentoChange = async (pedidoId, pagamentoAtivo) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/pedido/pagamento",
        { pedidoId, pagamento: pagamentoAtivo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        await fetchTodosPedidos();
        console.log(response.data.pagamento);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Erro ao atualizar status");
    }
  };

  // Função para filtrar pedidos com base na pesquisa e no filtro de pagamento
  const filtrarPedidos = () => {
    return pedidos.filter((pedido) => {
      const pesquisaMatch =
        pedido.endereco?.primeiroNome
          .toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        pedido.endereco?.sobrenome
          .toLowerCase()
          .includes(pesquisa.toLowerCase()) ||
        pedido.itens?.some((item) =>
          item.nome.toLowerCase().includes(pesquisa.toLowerCase())
        );

      const pagamentoMatch =
        filtroPagamento === "" ||
        (filtroPagamento === "pago" && pedido.pagamento) ||
        (filtroPagamento === "pendente" && !pedido.pagamento);

      const statusMatch = filtroStatus === "" || pedido.status === filtroStatus;

      return pesquisaMatch && pagamentoMatch && statusMatch;
    });
  };

  // Função para paginação
  const paginarPedidos = () => {
    const pedidosFiltrados = filtrarPedidos();
    const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);

    // Calculando os pedidos a serem exibidos na página atual
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return pedidosFiltrados.slice(inicio, fim);
  };

  // Função para mudar a página
  const handlePageChange = (novaPagina) => {
    if (
      novaPagina >= 1 &&
      novaPagina <= Math.ceil(pedidos.length / itensPorPagina)
    ) {
      setPaginaAtual(novaPagina);
    }
  };

  useEffect(() => {
    fetchTodosPedidos();
  }, [token]);

  return (
    <div>
      <h1>Página de Pedidos</h1>

      {/* Barra de Pesquisa */}
      <div className="flex gap-4">
        <div className="mb-1">
          <input
            type="text"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder="Pesquisar por nome"
            className="border p-2 rounded-lg w-full"
          />
        </div>

        {/* Filtro de Pagamento */}
        <div className="mb-4">
          <select
            value={filtroPagamento}
            onChange={(e) => setFiltroPagamento(e.target.value)}
            className="border p-2 rounded-lg w-full"
          >
            <option value="">Todos</option>
            <option value="pago">Pagos</option>
            <option value="pendente">Pendentes</option>
          </select>
        </div>

        <div className="mb-4">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="border p-2 rounded-lg w-full"
          >
            <option value="">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="em andamento">Em Andamento</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div>
        {Array.isArray(pedidos) && pedidos.length > 0 ? (
          paginarPedidos().map((pedido, index) => (
            <div
              className="flex items-center justify-around border-2 border-gray-200 p-4 md:p-3 my-3 md:my-2 text-xs sm:text-sm text-gray-700 rounded-xl"
              key={index}
            >
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
                  <h3 className="font-bold mt-3">Status do pedido</h3>
                  <select
                    value={pedido.status}
                    onChange={(e) =>
                      handleStatusChange(pedido._id, e.target.value)
                    }
                    className="mt-2 w-full"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="em andamento">Em Andamento</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>

                  <h3 className="font-bold mt-3">Status Pagamento</h3>
                  <select
                    value={pedido.pagamento}
                    onChange={(e) =>
                      handlePagamentoChange(pedido._id, e.target.value)
                    }
                    className="mt-2 w-full"
                  >
                    <option value="false">Pendente</option>
                    <option value="true">Pago</option>
                  </select>

                  <h3 className="font-bold mt-3">Data:</h3>
                  <p>{new Date(pedido.data).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center">
            <h2 className="text-xl">Nenhum pedido encontrado!</h2>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 ">
        <button
          onClick={() => handlePageChange(paginaAtual - 1)}
          disabled={paginaAtual === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <FontAwesomeIcon icon={faLeftLong} />
        </button>
        <span>{paginaAtual}</span>
        <button
          onClick={() => handlePageChange(paginaAtual + 1)}
          disabled={paginaAtual === Math.ceil(pedidos.length / itensPorPagina)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <FontAwesomeIcon icon={faRightLong} />
        </button>
      </div>
    </div>
  );
};

export default Entrega;
