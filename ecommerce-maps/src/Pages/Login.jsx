import React, { useContext, useEffect, useState } from "react";
import { images } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../Context/Context";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const { backendUrl, token, setToken, navigate } = useContext(ShopContext);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [form, setForm] = useState("Cadastre-se");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de loading

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Começa o carregamento
    try {
      if (form === "Cadastre-se") {
        const response = await axios.post(backendUrl + "/api/user/registrar", {
          nome,
          email,
          senha,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          senha,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Fim do carregamento
    }

    setNome("");
    setEmail("");
    setSenha("");
  };

  const toggleForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setForm((prev) => (prev === "Login" ? "Cadastre-se" : "Login"));
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler}>
      <div className={`h-screen w-full flex flex-col md:flex-row justify-center items-center transition-all duration-300`}>
        <div className="relative md:w-3/4 w-full h-1/2 md:h-full">
          <img src={images.login} className="h-screen object-cover object-top" alt="Login" />
          <div className="absolute inset-0 bg-black opacity-20" />
        </div>

        <div className={`w-full md:w-2/5 bg-white h-1/2 md:h-full flex flex-col gap-10 justify-center items-center transform transition-transform duration-300 ${isTransitioning ? "translate-x-full" : "translate-x-[0%]"}`}>
          <h1 className="text-5xl">{form}</h1>
          <div className="w-full flex flex-col justify-center items-center gap-7">
            {form === "Cadastre-se" && (
              <div className="flex flex-col w-3/4">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" placeholder="Insira seu nome" value={nome} onChange={(e) => setNome(e.target.value)} className="py-2 rounded-xl px-2 border border-black" />
              </div>
            )}
            <div className="flex flex-col w-3/4">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Insira seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="py-2 rounded-xl px-2 border border-black" />
            </div>
            <div className="flex flex-col w-3/4">
              <label htmlFor="senha">Senha</label>
              <input type="password" id="senha" placeholder="Insira sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} className="py-2 rounded-xl px-2 border border-black" />
            </div>
            <div className="flex justify-between w-3/4">
              <div className="w-full">
                {form === "Cadastre-se" ? (
                  <div className="flex justify-end">
                    Fazer Login?{" "}
                    <Link to="" className="underline hover:tracking-[1px] transition-all duration-300 ease-in-out" onClick={toggleForm}>
                      Aqui
                    </Link>
                  </div>
                ) : (
                  <div className="flex justify-between w-full">
                    <p className="cursor-pointer">Esqueceu a senha?</p>
                    <p>
                      Criar conta?{" "}
                      <Link to="" className="underline hover:tracking-[1px] transition-all duration-300 ease-in-out" onClick={toggleForm}>
                        Aqui
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Exibir botão de submit apenas se for login */}
            <button className="bg-black text-white font-light px-8 py-2 mt-4 rounded-lg hover:scale-[1.02] hover:mt-3" disabled={loading}>
              {loading ? "Carregando..." : form === "Login" ? "Login" : "Cadastre-se"}
            </button>
          </div>
          <ToastContainer />
        </div>
      </div>
    </form>
  );
};

export default Login;
