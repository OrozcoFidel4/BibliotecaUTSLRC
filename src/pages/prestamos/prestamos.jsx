import { useState, useEffect } from "react";

function Prestamos() {
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 1024);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");


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
        const res = await fetch(`http://localhost:4000/prestamos/activos?search=${busqueda}`);
        const data = await res.json();
        setPrestamos(data.data);
      } catch (error) {
        console.error("Error al cargar préstamos activos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, [busqueda]);

const manejarDevolucion = async (prestamo) => {
  const confirmar = window.confirm("¿Seguro que deseas devolver este libro?");
  if (!confirmar) return;

  try {
    const res = await fetch("http://localhost:4000/prestamos/devolver", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ISBN: prestamo.ISBN,
        nombre_solicitante: prestamo.nombre_solicitante,
        fecha_prestamo: prestamo.fecha_prestamo,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    setPrestamos((prev) =>
      prev.filter(
        (p) =>
          !(
            p.ISBN === prestamo.ISBN &&
            p.nombre_solicitante === prestamo.nombre_solicitante &&
            p.fecha_prestamo === prestamo.fecha_prestamo
          )
      )
    );
  } catch (error) {
    console.error(error);
    alert(`Hubo un error al devolver el libro: ${error.message}`);
  }
};



  if (loading) return <p>Cargando préstamos activos...</p>;


  function tipoTitulo(texto) {
    return texto
      .toLowerCase()
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  }

  return (
    <div className="flex flex-col h-full w-full px-16 pt-6">
      <div className="font-bold text-5xl mb-2">Préstamos</div>

      <div className="text-xl mb-4 text-gray-500">Listado de Préstamos en Activo</div>

      <input
        className={`bg-white w-72 px-4 py-2 mb-4 self-end rounded-lg shadow-md
                           ${expanded ? "h-auto" : "hidden"} overflow-hidden`}
        type="search"
        placeholder="Buscar"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="flex-grow w-full">
        <div className="overflow-hidden rounded-lg shadow-md mb-8">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="hover:bg-gray-100 cursor-pointer">
                <th className="py-2 px-4 border-gray-400">ISBN</th>
                <th className="py-2 px-4 border-gray-400">Título</th>
                <th className="py-2 px-4 border-gray-400">Autor</th>
                <th className="py-2 px-4 border-gray-400">Alumno</th>
                <th className="py-2 px-4 border-gray-400">Fecha Salida</th>
                <th className="py-2 px-4 border-gray-400 ">Fecha Devolución</th>
                <th className="py-2 px-4 border-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((p) => (
                <tr key={`${p.ISBN}-${p.nombre_solicitante}-${p.fecha_prestamo}`} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-t border-gray-400 font-bold">{tipoTitulo(p.ISBN)}</td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">{tipoTitulo(p.titulo)}</td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">{tipoTitulo(p.autor)}</td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">{tipoTitulo(p.nombre_solicitante)}</td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    {formatearFecha(p.fecha_prestamo)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    {formatearFecha(p.fecha_devolucion)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    <button className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]"
                    onClick={()=> manejarDevolucion(p)}>
                      Devolver
                    </button>
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
