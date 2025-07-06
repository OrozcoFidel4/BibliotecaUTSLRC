import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


function Prestamos() {
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 1024);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [condiciones, setCondiciones] = useState({
    roto: false,
    manchado: false,
    mojado: false,
  });


  const generarPDF = () => {
  const doc = new jsPDF();

  const { titulo, autor, ISBN, nombre_solicitante, fecha_prestamo } = prestamoSeleccionado;

  doc.setFontSize(16);
  doc.text("Reporte de Devolución de Libro", 14, 20);

  doc.setFontSize(12);
  doc.text(`Título: ${titulo}`, 14, 35);
  doc.text(`Autor: ${autor}`, 14, 42);
  doc.text(`ISBN: ${ISBN}`, 14, 49);
  doc.text(`Solicitante: ${nombre_solicitante}`, 14, 56);
  doc.text(`Fecha de préstamo: ${formatearFecha(fecha_prestamo)}`, 14, 63);

  const daños = Object.entries(condiciones)
    .filter(([_, marcado]) => marcado)
    .map(([clave]) => clave.charAt(0).toUpperCase() + clave.slice(1));

  autoTable(doc, {
    startY: 75,
    head: [["Daños reportados"]],
    body: daños.length ? daños.map((d) => [d]) : [["Sin daños reportados"]],
  });

  const fecha = new Date().toISOString().slice(0, 10);
  doc.save(`Devolucion_${ISBN}_${fecha}.pdf`);
};


  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => setExpanded(mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

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

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    if (isNaN(fecha)) return "-";
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  function esPrestamoTardio(fechaDevolucion) {
    const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaDev = new Date(fechaDevolucion);
  fechaDev.setHours(0, 0, 0, 0);

  return fechaDev.getTime() < hoy.getTime();
  }

  const tipoTitulo = (texto) =>
    texto
      .toLowerCase()
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");

  const abrirModal = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setCondiciones({ roto: false, manchado: false, mojado: false });
    setModalAbierto(true);
  };

  const confirmarDevolucion = async () => {
    try {
      const res = await fetch("http://localhost:4000/prestamos/devolver", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ISBN: prestamoSeleccionado.ISBN,
          nombre_solicitante: prestamoSeleccionado.nombre_solicitante,
          fecha_prestamo: prestamoSeleccionado.fecha_prestamo,
          condiciones: condiciones,
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
              p.ISBN === prestamoSeleccionado.ISBN &&
              p.nombre_solicitante === prestamoSeleccionado.nombre_solicitante &&
              p.fecha_prestamo === prestamoSeleccionado.fecha_prestamo
            )
        )
      );
      setModalAbierto(false);
    } catch (error) {
      console.error(error);
      alert(`Hubo un error al devolver el libro: ${error.message}`);
    }
  };

  if (loading) return <p>Cargando préstamos activos...</p>;

  return (
    <div className="flex flex-col h-full w-full px-16 pt-6">
      <div className="font-bold text-5xl mb-2">Préstamos</div>
      <div className="text-xl mb-4 text-gray-500">Listado de Préstamos en Activo</div>

      <input
        className={`bg-white w-72 px-4 py-2 mb-4 self-end rounded-lg shadow-md ${expanded ? "h-auto" : "hidden"} overflow-hidden`}
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
                <th className="py-2 px-4 border-gray-400">Fecha Devolución</th>
                <th className="py-2 px-4 border-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((p) => (
                <tr key={`${p.ISBN}-${p.nombre_solicitante}-${p.fecha_prestamo}`}   className={`hover:bg-gray-100 ${esPrestamoTardio(p.fecha_devolucion) ? 'bg-red-100' : ''}`} onClick={()=>abrirModal(p)}>
                  <td className="py-2 px-4 border-t border-gray-400 font-bold">{tipoTitulo(p.ISBN)}</td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">{tipoTitulo(p.titulo)}</td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">{tipoTitulo(p.autor)}</td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">{tipoTitulo(p.nombre_solicitante)}</td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">{formatearFecha(p.fecha_prestamo)}</td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">{formatearFecha(p.fecha_devolucion)}</td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    <button
                      className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]"
                      onClick={() => {
                        abrirModal(p)
                      }}
                    >
                      Devolver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Confirmar Devolución</h2>
            <p className="mb-2">Libro: <strong>{tipoTitulo(prestamoSeleccionado.titulo)}</strong></p>
            <p className="mb-4">Solicitante: <strong>{tipoTitulo(prestamoSeleccionado.nombre_solicitante)}</strong></p>

            <div className="mb-4">
              <p className="font-semibold mb-1">Condición del libro al devolver:</p>
              {["roto", "manchado", "mojado","rayado","sin daños"].map((cond) => (
                <label className="block" key={cond}>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={condiciones[cond]}
                    onChange={(e) => setCondiciones((c) => ({ ...c, [cond]: e.target.checked }))}
                  />
                  {cond.charAt(0).toUpperCase() + cond.slice(1)}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setModalAbierto(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-[#88073f] text-white px-4 py-2 rounded hover:bg-[#5d052d]"
                onClick={()=>{
                  generarPDF()
                  confirmarDevolucion()
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prestamos;
