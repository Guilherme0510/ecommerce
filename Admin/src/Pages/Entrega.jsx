import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { imagens } from "../assets/assets";

const Entrega = ({ token }) => {
  const [pedidos, setPedidos] = useState([]);

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
        setPedidos(response.data.pedidos);
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
        backendUrl + '/api/pedido/status',
        { pedidoId, status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        await fetchTodosPedidos();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar status');
    }
  };
  
  const onChange = (e, pedidoId) => {
    const novoStatus = e.target.value;
    handleStatusChange(pedidoId, novoStatus);
  };
  

  // Carrega os pedidos quando o componente é montado ou o token muda
  useEffect(() => {
    fetchTodosPedidos();
  }, [token]);

  return (
    <div>
      <h1>Página de Pedidos</h1>
      <div>
        {Array.isArray(pedidos) && pedidos.length > 0 ? (
          pedidos.map((pedido, index) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
              key={index}
            >
              {/* Imagem do pedido */}
              <img
                src={imagens.parcel || "defaultImage.png"}
                alt="Imagem do pedido"
                onError={(e) => e.target.src = "defaultImage.png"} 
              />
              <div>
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

              {/* Exibindo detalhes do pedido */}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="font-bold">Endereço de entrega:</h3>
                {/* Verificar e exibir o endereço corretamente */}
                <p>{pedido.endereco?.primeiroNome} {pedido.endereco?.sobrenome}</p>
                <p>{pedido.endereco?.endereco}, {pedido.endereco?.numeroCasa}</p>
                <p>{pedido.endereco?.cidade} - {pedido.endereco?.estado}, {pedido.endereco?.cep}</p>
                <p>{pedido.endereco?.pais}</p>
                <p>{pedido.endereco?.telefone}</p>
                
                <h3 className="font-bold mt-3">Método de Pagamento:</h3>
                <p>{pedido.metodoPagamento}</p>

                {/* Select para alteração de status */}
                <select
                  value={pedido.status}
                  onChange={(e) => handleStatusChange(pedido._id, e.target.value)}
                  className="mt-2"
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
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Entrega;
