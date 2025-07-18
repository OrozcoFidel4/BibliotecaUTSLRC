import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";

import { GraduationCap } from "lucide-react";
import { LibraryBig } from "lucide-react";

import { useNavigate } from "react-router";

function Home() {
  const { usuario, loadingUsuario } = useAuth();

  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 1024);

  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 900px)");
    const handleResize = () => setExpanded(mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const res = await fetch("http://localhost:4000/prestamos/activos");
        const data = await res.json();
        setPrestamos(data.data || []);
      } catch (error) {
        console.error("Error al obtener préstamos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Para ignorar hora y comparar solo la fecha

  const prestamosAentregarHoy = prestamos.filter((prestamo) => {
    const fechaDevolucion = new Date(prestamo.fecha_devolucion);
    fechaDevolucion.setHours(0, 0, 0, 0);
    return fechaDevolucion.getTime() === hoy.getTime();
  });

  const prestamosTardios = prestamos.filter((prestamo) => {
    const fechaDevolucion = new Date(prestamo.fecha_devolucion);
    fechaDevolucion.setHours(0, 0, 0, 0);
    return fechaDevolucion.getTime() < hoy.getTime();
  });

  // Cantidad de préstamos hechos hoy
  const cantidadPrestamosEntregaHoy = prestamosAentregarHoy.length;

  //Prestamos tardios
  const PrestamosConRetraso = prestamosTardios.length;

  const nombreTurno = (id) => {
    if (id === 1) return "Admin";
    if (id === 2) return "Matutino";
    if (id === 3) return "Vespertino";
    return "Invitado";
  };

  // Uso:
  const turno = nombreTurno(usuario.id);

  return (
    <div className="h-full w-full px-16">
      <div className="flex flex-col pt-6">
        <div className="font-bold text-5xl mb-2">Inicio</div>
        <div className="text-xl mb-12 text-gray-500">
          Bienvenido Usuario {turno}
        </div>

        <div
          className={`flex justify-end mb-8 gap-4 ${
            expanded ? "flex-row" : "flex flex-col items-end"
          }`}
        >
          <div
            className={`flex flex-row gap-2 items-center  ${
              expanded ? "border-r-2 border-gray-300 pr-4" : " "
            }`}
          >
            <h2 className="text-2xl">Por Entregar Hoy:</h2>
            <div className="flex bg-green-600 w-12 h-12 rounded-sm items-center justify-center">
              <h2 className="text-gray-50 text-2xl font-bold">
                {cantidadPrestamosEntregaHoy}
              </h2>
            </div>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-2xl">Entrega Tardía:</h2>
            <div className="flex bg-red-500 w-12 h-12 rounded-sm items-center justify-center">
              <h2 className="text-gray-50 text-2xl font-bold">
                {PrestamosConRetraso}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`gap-4 flex ${
          expanded
            ? "w-full flex-row mb-4 h-80 justify-center"
            : "h-screen flex-col h-120 justify-around mb-24"
        }`}
      >
        {/* Botones */}
        <button
          className="flex-1 flex flex-col items-center justify-center bg-[#88073f] shadow shadow-xl rounded-xl hover:bg-[#480422]"
          onClick={() => navigate("/libros")}
        >
          <GraduationCap size={140} className="text-gray-100" />
          <h1 className="text-2xl font-semibold text-gray-100">
            Crear {!expanded && "Préstamo"}
          </h1>
          <h1 className="text-2xl font-semibold text-gray-100">
            {expanded && "Prestamo"}
          </h1>
        </button>

        <button
          className="flex-1 flex flex-col items-center justify-center bg-[#88073f] shadow shadow-xl rounded-xl hover:bg-[#480422]"
          onClick={() => navigate("/prestamos")}
        >
          <LibraryBig size={140} className="text-gray-100" />
          <h1 className="text-2xl font-semibold text-gray-100">
            Devolver {!expanded && "Préstamo"}
          </h1>
          <h1 className="text-2xl font-semibold text-gray-100">
            {expanded && "Préstamo"}
          </h1>
        </button>
      </div>
    </div>
  );
}

export default Home;
