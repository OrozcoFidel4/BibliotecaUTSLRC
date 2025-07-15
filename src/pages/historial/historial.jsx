import { useEffect, useState } from "react";
import Modal from "../../components/Modal";

function Historial() {
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 1024);
  const [open, setOpen] = useState(false);

  const [prestamo, setPrestamo] = useState([]);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [isbn, setIsbn] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limitePorPagina, setLimitePorPagina] = useState(10);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => setExpanded(mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        const offset = (paginaActual - 1) * limitePorPagina;

        const params = new URLSearchParams({
          limit: limitePorPagina,
          offset,
          search: busqueda,
          isbn,
          fechaDesde,
          fechaHasta,
        });

        const res = await fetch(
          `http://localhost:4000/historial?${params.toString()}`
        );
        const data = await res.json();
        setHistorial(data.data);
        setTotalPaginas(Math.ceil(data.total / limitePorPagina));
      } catch (error) {
        console.error("Error al obtener historial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [busqueda, isbn, fechaDesde, fechaHasta, paginaActual, limitePorPagina]);

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

  function tipoTitulo(texto) {
    return texto
      .toLowerCase()
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  }

  const limpiarFiltros = () => {
    setBusqueda("");
    setIsbn("");
    setFechaDesde("");
    setFechaHasta("");
    setPaginaActual(1);
  };

  const abrirModalHistorial = (prestamo) => {
    
    setPrestamoSeleccionado(prestamo);
    console.log(prestamoSeleccionado)
    setOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen w-full px-16 pt-6">
      <div className="font-bold text-5xl mb-2">Historial</div>
      <div className="text-xl mb-4 text-gray-500">Historial de Préstamos</div>

      {/* Filtros */}

      <div
        className={`flex flex-wrap gap-4 mb-6 self-end ${
          expanded ? "flex" : "hidden"
        } overflow-hidden`}
      >
        <input
          className="bg-white w-64 px-4 py-2 rounded-lg shadow-md "
          type="search"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
          placeholder="Solicitante"
        />

        <input
          type="search"
          value={isbn}
          onChange={(e) => {
            setIsbn(e.target.value);
            setPaginaActual(1);
          }}
          placeholder="ISBN"
          className="bg-white w-48 px-4 py-2 rounded-lg shadow-md "
        />

        <input
          type="date"
          value={fechaDesde}
          onChange={(e) => {
            setFechaDesde(e.target.value);
            setPaginaActual(1);
          }}
          className="bg-white w-48 px-4 py-2 rounded-lg shadow-md "
        />

        <input
          type="date"
          value={fechaHasta}
          onChange={(e) => {
            setFechaHasta(e.target.value);
            setPaginaActual(1);
          }}
          className="bg-white w-48 px-4 py-2 rounded-lg shadow-md "
        />

        <button
          onClick={limpiarFiltros}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Limpiar
        </button>
      </div>

      {/* Tabla */}
      <div className="flex-grow w-full">
        {loading ? (
          <p>Cargando historial...</p>
        ) : historial.length === 0 ? (
          <p>No hay registros que coincidan con los filtros.</p>
        ) : (
          <div className="overflow-hidden rounded-lg shadow-md mb-8">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-gray-400">ISBN</th>
                  <th className="py-2 px-4 border-gray-400">Solicitante</th>
                  <th className="py-2 px-4 border-gray-400">Fecha Préstamo</th>
                  <th className="py-2 px-4 border-gray-400">
                    Fecha Devolución
                  </th>
                  <th className="py-2 px-4 border-gray-400">
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                {historial.map((h, index) => (
                  <tr
                    key={`${h.ISBN}-${h.nombre_solicitante}-${h.fecha_prestamo}-${index}`}
                    className="hover:bg-gray-50"
                    onClick={() => abrirModalHistorial(h)}
                  >
                    <td className="py-2 px-4 border-t border-gray-400 font-bold">
                      {h.ISBN}
                    </td>
                    <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                      {tipoTitulo(h.nombre_solicitante)}
                    </td>
                    <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                      {formatearFecha(h.fecha_prestamo)}
                    </td>
                    <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                      {formatearFecha(h.fecha_devolucion)}
                    </td>
                    <td className="py-2 px-4 border-t border-gray-400">
                    <button
                      className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]"
                      onClick={() => abrirModalHistorial(h)}
                    >
                      Detalles
                    </button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-end items-center gap-4 mt-4">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>

            <span>
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
              }
              disabled={paginaActual >= totalPaginas}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        
        <div className="text-center w-160">
          <h3 className="text-lg font-black">Información del Préstamo</h3>
          <p className="text-sm text-gray-500 ">
            Consulta la información detallada del préstamo seleccionado.
          </p>

          <div className="flex flex-row justify-stretch items-start mt-8 mb-8">
            {open && (
              <div className="text-left mx-3 flex-none border-r-2 border-gray-300 ">
                <h4 className="font-semibold mb-1">ISBN</h4>
                <p className="text-md text-gray-500 pb-2 mr-4">
                  {prestamoSeleccionado.ISBN}
                </p>
                <h4 className="font-semibold mb-1">Solicitante</h4>
                <p className="text-md text-gray-500 mr-4">
                  {tipoTitulo(prestamoSeleccionado.nombre_solicitante)}
                </p>
              </div>
            )}

            <div className="text-left mx-3 flex-1">
              <div className="flex flex-col justify-between ">
                <h4 className="font-semibold mb-1">Multas Aplicadas</h4>
                  
                  <div> 
                    {prestamoSeleccionado?.retraso === 1 && <p className="text-md text-gray-500 mr-4">• Entrega Tardía</p>}
                    {prestamoSeleccionado?.roto === 1 && <p className="text-md text-gray-500 mr-4">• Roto</p>}
                    {prestamoSeleccionado?.manchado === 1 && <p className="text-md text-gray-500 mr-4">• Manchado</p>}
                    {prestamoSeleccionado?.roto === 1 && <p className="text-md text-gray-500 mr-4">• Mojado</p>}
                    {prestamoSeleccionado?.rayado === 1 && <p className="text-md text-gray-500 mr-4">• Rayado</p>}  
                  </div>

              </div>
            </div>
          </div>

          <div className="flex flex-row justify-end">
          
              <button
              className="basis-1/4 h-12 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422] "
              onClick={() => setOpen(false)}
            >
              Cerrar
            </button>
        
            
            
          </div>
        </div>

      </Modal>
    </div>
  );
}

export default Historial;
