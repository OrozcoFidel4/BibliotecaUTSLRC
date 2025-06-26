import { useEffect, useState } from "react";

function Historial() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await fetch("http://localhost:4000/historial");
        const data = await res.json();
        setHistorial(data.data);
      } catch (error) {
        console.error("Error al obtener historial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const formatearFecha = (fecha) => {
    const f = new Date(fecha);
    return isNaN(f)
      ? "-"
      : f.toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  };

  if (loading) return <p className="p-10">Cargando historial...</p>;


  return (
    <div className="flex flex-col h-full w-full p-16">
      <div className="font-bold text-5xl mb-2">Historial</div>
      <div className="text-xl mb-12 text-gray-500">Historial de Préstamos</div>

      <div className="h-full w-full overflow-x-auto">
        <div className="overflow-hidden rounded-lg shadow-md">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">ISBN</th>
                <th className="py-2 px-4 border-b">Solicitante</th>
                <th className="py-2 px-4 border-b">Fecha Préstamo</th>
                <th className="py-2 px-4 border-b">Fecha Devolución</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h, index) => (
                <tr key={`${h.ISBN}-${h.nombre_solicitante}-${h.fecha_prestamo}-${index}`} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{h.ISBN}</td>
                  <td className="py-2 px-4 border-b">{h.nombre_solicitante}</td>
                  <td className="py-2 px-4 border-b">{formatearFecha(h.fecha_prestamo)}</td>
                  <td className="py-2 px-4 border-b">{formatearFecha(h.fecha_devolucion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Historial;
