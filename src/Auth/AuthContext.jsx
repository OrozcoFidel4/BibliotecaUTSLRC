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
    await axios.post("http://localhost:4000/api/login", { email, password }, {
      withCredentials: true
    });
    const res = await axios.get("http://localhost:4000/api/usuario", {
      withCredentials: true
    });
    setUsuario(res.data);
  };

  const logout = () => {
    setUsuario(null);
    // También puedes limpiar cookie del backend si agregas /api/logout
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
