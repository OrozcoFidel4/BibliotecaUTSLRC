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
  const [datosPorMes, setDatosPorMes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const res = await fetch("http://localhost:4000/estadisticas/mas-prestados-por-mes");
        const data = await res.json();
        console.log(data)

        // Agrupamos por mes
        const agrupado = {};
        for (const row of data.data) {
          const { mes, titulo, cantidad_prestamos } = row;
          if (!agrupado[mes]) agrupado[mes] = [];
          agrupado[mes].push({ titulo, cantidad: cantidad_prestamos });
        }

        setDatosPorMes(agrupado);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full px-16 pt-6">
      <h1 className="text-4xl font-bold mb-4">Estadísticas</h1>
      <p className="text-gray-600 text-lg mb-8">
        Libros más prestados por mes
      </p>

      {loading ? (
        <p className="text-gray-500">Cargando datos...</p>
      ) : Object.keys(datosPorMes).length === 0 ? (
        <p className="text-gray-500">No hay datos de préstamos.</p>
      ) : (
        Object.entries(datosPorMes).map(([mes, libros]) => {
          const labels = libros.map((l) => l.titulo);
          const dataValues = libros.map((l) => l.cantidad);

          const data = {
            labels,
            datasets: [
              {
                label: `Préstamos en ${mes}`,
                data: dataValues,
                backgroundColor: "#88073f",
                borderRadius: 5,
              },
            ],
          };

          return (
            <div
              key={mes}
              className="bg-white p-6 rounded-lg shadow-md mb-10"
            >
              <h2 className="text-2xl font-semibold mb-4">Mes: {mes}</h2>
              <Bar
                data={data}
                options={{
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
                }}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

export default Estadisticas;
