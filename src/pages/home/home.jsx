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
  const prestamosAentregarHoy = prestamos.filter(
    (prestamo) =>
      new Date(prestamo.fecha_devolucion).toLocaleDateString("es-MX") === hoy
  );

  // Cantidad de préstamos hechos hoy
  const cantidadPrestamosEntregaHoy = prestamosAentregarHoy.length;

  return (
    <div className="h-full w-full px-16">
      <div className="flex flex-col pt-6">
        <div className="font-bold text-5xl mb-2">Inicio</div>
        <div className="text-xl mb-12 text-gray-500">Bienvenido, Jonh Doe</div>
      </div>

      <div className="flex-1 flex flex-row w-full justify-center gap-4 mb-4">
        
        {/* Botones */}
        <div className="flex-1 flex flex-col">
          <button className="flex-1 bg-red-500 h-64">BTN1</button>
          <button className="flex-1 bg-red-500 h-64">BTN2</button>
        </div>

        {/* Prestamos informacion */}
        <div className="flex-1 flex flex-col justify-between gap-4">

          <div className="flex flex-row w-full justify-center gap-4 mb-24">

            <div className="flex flex-row justify-start items-center gap-4 bg-gray-100 p-4 rounded-xl">
              <div className="flex flex-col">
                <h1 className="text-2xl">Préstamos por</h1>
                <h1 className="text-2xl">entregar hoy:</h1>
              </div>

              <div className="flex flex-col bg-green-600 h-32 w-32 rounded-lg items-center justify-center inset-shadow-sm inset-shadow-green-800">
                <h1 className="font-bold text-5xl text-gray-50">
                  {cantidadPrestamosEntregaHoy}
                </h1>

                <h1 className="font-bold text-xxl text-gray-50">Libros</h1>
              </div>
            </div>

            <div className="flex flex-row justify-start items-center gap-4 bg-gray-100 p-4 rounded-xl">
              <div className="flex flex-col">
                <h1 className="text-2xl">Préstamos con</h1>
                <h1 className="text-2xl">entrega tardía:</h1>
              </div>

              <div className="flex flex-col bg-red-500 h-32 w-32 rounded-lg items-center justify-center inset-shadow-sm inset-shadow-red-600">
                <h1 className="font-bold text-5xl text-gray-50">
                  {cantidadPrestamosEntregaHoy}
                </h1>

                <h1 className="font-bold text-xxl text-gray-50">Libros</h1>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
