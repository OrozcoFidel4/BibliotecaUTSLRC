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
  const [mesSeleccionado, setMesSeleccionado] = useState(""); // Nuevo estado

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const res = await fetch("http://localhost:4000/estadisticas/mas-prestados-por-mes");
        const data = await res.json();

        const agrupado = {};
        for (const row of data.data) {
          const { mes, titulo, cantidad_prestamos } = row;
          if (!agrupado[mes]) agrupado[mes] = [];
          agrupado[mes].push({ titulo, cantidad: cantidad_prestamos });
        }

        setDatosPorMes(agrupado);
        // Auto-seleccionar el mes más reciente
        const mesesOrdenados = Object.keys(agrupado).sort().reverse();
        setMesSeleccionado(mesesOrdenados[0] || "");
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstadisticas();
  }, []);

  const handleChangeMes = (e) => {
    setMesSeleccionado(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen w-full px-16 pt-6">
      <div className="font-bold text-5xl mb-2">Estadísticas</div>
      <div className="text-xl mb-4 text-gray-500">Estadísticas de Préstamos de Biblioteca</div>

      {loading ? (
        <p className="text-gray-500">Cargando datos...</p>
      ) : Object.keys(datosPorMes).length === 0 ? (
        <p className="text-gray-500">No hay datos de préstamos.</p>
      ) : (
        <>
          {/* Select de meses */}
          <div className="mb-6">
            <label className="block mb-2 text-lg font-medium">Selecciona un mes:</label>
            <select
              value={mesSeleccionado}
              onChange={handleChangeMes}
              className="border border-gray-300 rounded-md p-2 text-lg"
            >
              {Object.keys(datosPorMes)
                .sort()
                .reverse()
                .map((mes) => (
                  <option key={mes} value={mes}>
                    {mes}
                  </option>
                ))}
            </select>
          </div>

          {/* Mostrar solo el mes seleccionado */}
          {mesSeleccionado && datosPorMes[mesSeleccionado] && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-10">
              <h2 className="text-2xl font-semibold mb-4">Mes: {mesSeleccionado}</h2>
              <Bar
                data={{
                  labels: datosPorMes[mesSeleccionado].map((l) => l.titulo),
                  datasets: [
                    {
                      label: `Préstamos en ${mesSeleccionado}`,
                      data: datosPorMes[mesSeleccionado].map((l) => l.cantidad),
                      backgroundColor: "#88073f",
                      borderRadius: 5,
                    },
                  ],
                }}
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
          )}
        </>
      )}
    </div>
  );
}

export default Estadisticas;
