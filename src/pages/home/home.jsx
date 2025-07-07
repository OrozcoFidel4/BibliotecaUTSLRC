import React from "react";
import { useEffect, useState } from "react";

import { GraduationCap } from 'lucide-react';
import { LibraryBig } from 'lucide-react';

import { useNavigate } from "react-router";


function Home() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

  return (
    <div className="h-full w-full px-16">
      <div className="flex flex-col pt-6">
        <div className="font-bold text-5xl mb-2">Inicio</div>
        <div className="text-xl mb-12 text-gray-500">Bienvenido, Jonh Doe</div>
      </div>

      <div className="flex-1 flex flex-row w-full justify-center gap-4 mb-4">
        
        {/* Botones */}
          <button 
            className="flex-1 flex flex-col items-center justify-center bg-[#88073f] shadow shadow-xl rounded-xl hover:bg-[#480422]"
            onClick={() => navigate("/libros")}>
            <GraduationCap size={160} className="text-gray-100" />
            <h1 className="text-2xl font-semibold text-gray-100">Crear</h1>
            <h1 className="text-2xl font-semibold text-gray-100">Préstamo</h1>
          </button>

          <button 
            className="flex-1 flex flex-col items-center justify-center bg-[#88073f] shadow shadow-xl rounded-xl hover:bg-[#480422]"
            onClick={() => navigate("/prestamos")}>
            <LibraryBig size={160} className="text-gray-100" />
            <h1 className="text-2xl font-semibold text-gray-100">Devolver</h1>
            <h1 className="text-2xl font-semibold text-gray-100">Préstamo</h1>
          </button>

        {/* Prestamos informacion */}
        <div className="bg-gray-100 p-4 rounded-xl shadow shadow-xl">
        
          <div className="basis-1/4 flex-col w-full space-y-4">

            <div className="flex flex-row justify-around items-center bg-gray-200 p-4 rounded-xl gap-4">
              <div className="flex flex-col">
                <h1 className="font-semibold">Préstamos</h1>
                <h1 className="font-semibold">para hoy:</h1>
              </div>

              <div className="flex flex-col bg-green-600 h-20 w-20 rounded-lg items-center justify-center inset-shadow-sm inset-shadow-green-800">
                <h1 className="font-bold text-2xl text-gray-50">
                  {cantidadPrestamosEntregaHoy}
                </h1>

                <h1 className="text-xs text-gray-50">Préstamos</h1>
              </div>
            </div>

            <div className="flex flex-row justify-around items-center bg-gray-200 p-4 rounded-xl gap-4 shadow shadow-xl">
              <div className="flex flex-col">
                <h1 className="font-semibold">Préstamos</h1>
                <h1 className="font-semibold">vencidos:</h1>
              </div>

              <div className="flex flex-col bg-red-500 h-20 w-20 rounded-lg items-center justify-center inset-shadow-sm inset-shadow-red-800">
                <h1 className="font-bold text-2xl text-gray-50">
                  {PrestamosConRetraso}
                </h1>

                <h1 className="text-xs text-gray-50">Préstamos</h1>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;
