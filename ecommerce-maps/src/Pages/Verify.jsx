import React, { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../Context/Context";

const Verify = () => {
  const { navigate, token, setCarrinhoItems, backendUrl } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const success = searchParams.get("success");
  const orderId = searchParams.get("pedidoId");

  const verifyPayment = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(backendUrl + '/api/pedido/verificarstripe',
        { success, orderId },
        { headers: {Authorization: `Bearer ${ token }`}  }
      );
      console.log(response.data);
      if (response.data.success) {
        setCarrinhoItems([]);
        navigate("/perfil");
      } else {
        navigate("/carrinho");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return <div></div>;
};

export default Verify;
