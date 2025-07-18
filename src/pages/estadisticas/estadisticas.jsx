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
  const [mesSeleccionado, setMesSeleccionado] = useState("");

  const [expanded, setExpanded] = useState(() => window.innerWidth >= 728);

  useEffect(() => {
      const mediaQuery = window.matchMedia("(min-width: 900px)");
      const handleResize = () => setExpanded(mediaQuery.matches);
      handleResize();
      mediaQuery.addEventListener("change", handleResize);
      return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/estadisticas/mas-prestados-por-mes"
        );
        const data = await res.json();

        const agrupado = {};
        for (const row of data.data) {
          const { mes, titulo, cantidad_prestamos } = row;
          if (!agrupado[mes]) agrupado[mes] = [];
          agrupado[mes].push({ titulo, cantidad: cantidad_prestamos });
        }

        setDatosPorMes(agrupado);

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
    <div className="flex flex-col w-full px-16 pt-6">
      <div className="font-bold text-5xl mb-2">Estadísticas</div>
      <div className="text-xl mb-4 text-gray-500">
        Estadísticas de Préstamos de Biblioteca
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando datos...</p>
      ) : Object.keys(datosPorMes).length === 0 ? (
        <p className="text-gray-500">No hay datos de préstamos.</p>
      ) : (
        <>
          <div className="flex flex-row gap-2 w-full justify-end items-center mb-6">
            <label className="block text-lg font-medium">
              Selecciona un mes:
            </label>
            <select
              value={mesSeleccionado}
              onChange={handleChangeMes}
              className="bg-gray-300 rounded p-1 hover:bg-gray-400 disabled:opacity-50"
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

          {mesSeleccionado && datosPorMes[mesSeleccionado] && ( expanded ? (
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 w-full">
              <div className="w-full h-[350px]">
                <Bar
                  data={{
                    labels: datosPorMes[mesSeleccionado]
                      .slice(0, 5)
                      .map((l) => l.titulo),
                    datasets: [
                      {
                        label: `Préstamos en ${mesSeleccionado}`,
                        data: datosPorMes[mesSeleccionado]
                          .slice(0, 5)
                          .map((l) => l.cantidad),
                        backgroundColor: "#88073f",
                        borderRadius: 5,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                      },
                      tooltip: {
                        enabled: false,
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          font: {
                            size: 10,
                          },
                          callback: function (value) {
                            const label = this.getLabelForValue(value);
                            return label.match(/.{1,12}/g); // dividir en líneas de 12
                          },
                        },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          ):(
            <h1 className="text-center text-gray-500">Parece que no hay suficiente espacio para mostrar la tabla...</h1>
          )
          )}
        </>
      )}
    </div>
  );
}

export default Estadisticas;
