import { useState, useEffect } from "react";



function Prestamos() {
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 1024);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => {
      setExpanded(mediaQuery.matches);
    };

    // Set initial value and attach listener
    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    // Clean up on unmount
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  if (isNaN(fecha)) return "-"; // si la fecha no es válida

  return fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

    useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const res = await fetch('http://localhost:4000/prestamos/activos');
        const data = await res.json();
        setPrestamos(data.data);
      } catch (error) {
        console.error('Error al cargar préstamos activos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  if (loading) return <p>Cargando préstamos activos...</p>;

  if (prestamos.length === 0) return <p>No hay préstamos activos.</p>;

  return (
    <div className="flex flex-col h-full w-full px-16 pt-6">
      <div className="font-bold text-5xl mb-2">Préstamos</div>

      <div className="text-xl mb-12">Listado de Préstamos en Activo</div>

     <input
        className={`bg-white w-72 px-4 py-2 mb-4 self-end rounded-lg shadow-md
                           ${expanded ?  "h-auto" : "hidden" } overflow-hidden` }
        type="text"
        placeholder="Buscar"
      />

      <div className="h-full w-full">
        <div className="overflow-hidden rounded-lg shadow-md mb-24">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="hover:bg-gray-100 cursor-pointer">
                <th className="py-2 px-4 border-gray-400">Titulo</th>
                <th className="py-2 px-4 border-gray-400">Autor</th>
                <th className="py-2 px-4 border-gray-400">Alumno</th>
                <th className="py-2 px-4 border-gray-400">Fecha Salida</th>
                <th className="py-2 px-4 border-gray-400">Fecha devolucion</th>
                <th className="py-2 px-4 border-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((p) => (
            <tr key={p.id } className="hover:bg-gray-100">
              <td className="border px-4 py-2">{p.titulo}</td>
              <td className="border px-4 py-2">{p.autor}</td>
              <td className="border px-4 py-2">{p.nombre_solicitante}</td>
              <td className="border px-4 py-2">{formatearFecha(p.fecha_prestamo)}</td>
              <td className="border px-4 py-2">{formatearFecha(p.fecha_devolucion)}</td>
              <td className="border px-4 py-2">
                <button
                className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]"

                >Devolver</button>
              </td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Prestamos;