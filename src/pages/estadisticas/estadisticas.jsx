import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


function Estadisticas() {
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

  // Agrupar por fecha
  const prestamosPorFecha = prestamos.reduce((acc, prestamo) => {
    const fecha = new Date(prestamo.fecha_prestamo).toLocaleDateString("es-MX");
    acc[fecha] = (acc[fecha] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(prestamosPorFecha);
  const values = Object.values(prestamosPorFecha);

  const datosGrafica = {
    labels,
    datasets: [
      {
        label: "Préstamos activos por día",
        data: values,
        backgroundColor: "#88073f",
        borderRadius: 5,
      },
    ],
  };

  const opcionesGrafica = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen w-full px-16 pt-6">
      <h1 className="text-4xl font-bold mb-4">Estadísticas</h1>
      <p className="text-gray-600 text-lg mb-8">
        Visualización de préstamos activos
      </p>

      {loading ? (
        <p className="text-gray-500">Cargando datos...</p>
      ) : labels.length === 0 ? (
        <p className="text-gray-500">No hay préstamos activos para mostrar.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Bar data={datosGrafica} options={opcionesGrafica} />
        </div>
      )}
    </div>
  );
}

export default Estadisticas;