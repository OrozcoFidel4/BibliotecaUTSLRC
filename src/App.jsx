import { useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter, Routes, Navigate } from "react-router";
import axios from "axios";
import { useAuth } from "./Auth/AuthContext";

/* Pages */
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Prestamos from "./pages/prestamos/prestamos";
import Estadisticas from "./pages/estadisticas/estadisticas";
import Historial from "./pages/historial/historial"; 
import Libros from "./pages/libros/libros";
import Layout from "./layout/Layout";

function App() {
  const { usuario, loading } = useAuth();

  if (loading) return <div className="text-gray-500 m-6">Cargando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={usuario ? <Navigate to="/" /> : <Login />} />

        <Route path="/" element={usuario ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Home />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="historial" element={<Historial />} />
          <Route path="libros" element={<Libros />} />
          <Route path="estadisticas" element={<Estadisticas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
