import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../Auth/AuthContext";
import LogoUT from "../../assets/LogoUt.png";
import LogoBis from "../../assets/Bis.png";
import Background from "../../assets/background.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="relative h-screen w-full">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full bg-green-800 opacity-50"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h4 className="relative z-10 text-center text-white text-5xl font-bold">
          Sistema
        </h4>
        <h4 className="relative z-10 text-center text-white text-5xl font-bold mb-6">
          Bibliotecario
        </h4>
        <div className="h-94 w-120 bg-gray-100 flex flex-col items-center justify-center rounded-xl shadow-xl">
          

          <div className="flex flex-row justify-around items-center mb-6">
            <img src={LogoUT} className="h-12 w-auto object-contain border-r-2 border-gray-300 pr-2" alt="UT" />
            <img src={LogoBis} className="h-12 w-auto object-contain pl-2" alt="BIS"/>
          </div>

          <input
            className="bg-gray-200 w-96 h-12 p-6 m-2 rounded-lg inset inset-shadow-sm inset-shadow-gray-400/50"
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="bg-gray-200 w-96 h-12 p-6 m-2 rounded-lg inset inset-shadow-sm inset-shadow-gray-400/50"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="h-12 w-48 mt-6 font-semibold bg-[#537473] text-white rounded-lg hover:bg-[#3d5352]"
            onClick={handleLogin}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
