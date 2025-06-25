import React from "react";
import { useEffect, useState } from "react";

function Home() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Obtener la fecha de hoy en formato local
  const hoy = new Date().toLocaleDateString("es-MX");

  // Filtrar los préstamos hechos hoy
  const prestamosDeHoy = prestamos.filter(
    (prestamo) =>
      new Date(prestamo.fecha_prestamo).toLocaleDateString("es-MX") === hoy
  );

  // Cantidad de préstamos hechos hoy
  const cantidadPrestamosHoy = prestamosDeHoy.length;

  return (
    <div className="h-full w-full px-16">
      <div className="flex flex-col pt-6">
        <div className="font-bold text-5xl mb-2">Inicio</div>
        <div className="text-xl mb-12 text-gray-500">Bienvenido, Jonh Doe</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="h-48 bg-[#88073f] text-gray-100 rounded-xl shadow-xl hover:bg-[#480422] items-">
          Prestamos
        </button>

        <div>
          <h1>{cantidadPrestamosHoy}</h1>
        </div>
        <button className="h-48 bg-[#88073f] text-gray-100 rounded-xl shadow-xl hover:bg-[#480422] items-">
          Prestamos
        </button>
      </div>
    </div>
  );
}

export default Home;
