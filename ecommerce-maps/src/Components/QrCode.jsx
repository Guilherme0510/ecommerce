import React, { useState } from "react";
import { Tooltip } from 'react-tooltip';
import { useNavigate } from "react-router-dom";

const ModalQRCode = ({ showModal, qrCodeUrl, closeModal, copiaECola }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(copiaECola)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((error) => {
        console.error("Erro ao copiar para a área de transferência:", error);
        setCopySuccess(false);
      });
  };

  const handleCloseClick = () => {
    closeModal();
    navigate("/perfil"); // Substitua "/perfil" pelo caminho desejado
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg md:w-2/4 w-5/6">
        <h3 className="text-2xl text-center font-semibold mb-4">Seu QR Code</h3>
        <img src={qrCodeUrl} alt="QR Code" className="w-2/5 mb-4 mx-auto" />
        <div>
          <p onClick={handleCopyClick}>
            Pix Copia e Cola:
            <p
              data-tooltip-id="copiaECola"
              data-tooltip-content={copySuccess ? "Copiado!" : "Clique para Copiar"}
              className="text-blue-500 cursor-pointer"
            >
              {copiaECola}
            </p>
          </p>
          <p className="text-center mt-4">
            Após o pagamento, aguarde até 1 hora para a atualização do status no perfil. Caso não atualize, entre em contato conosco.
          </p>
          <Tooltip id="copiaECola" />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCloseClick}
            className="bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalQRCode;
