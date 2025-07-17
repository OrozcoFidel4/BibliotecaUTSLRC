import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:4000/api/usuario", { withCredentials: true })
      .then(res => setUsuario(res.data))
      .catch(() => setUsuario(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      await axios.post("http://localhost:4000/api/login", { email, password }, {
        withCredentials: true
      });
      const res = await axios.get("http://localhost:4000/api/usuario", {
        withCredentials: true
      });
      setUsuario(res.data);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Error al iniciar sesión: " + (error.response?.data?.error || error.message));
    }
  };


const logout = async () => {
  await axios.post("http://localhost:4000/api/logout", {}, {
    withCredentials: true
  });
  setUsuario(null); // borra el estado en React también
};
  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
