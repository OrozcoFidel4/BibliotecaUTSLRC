import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast, { Toaster } from 'react-hot-toast';

import Modal from "../../components/Modal";

function Prestamos() {
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 1024);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [open, setOpen] = useState(false);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [condiciones, setCondiciones] = useState({
    roto: false,
    manchado: false,
    mojado: false,
    rayado: false,
    sin_daños: false,
    retraso: false,  // solo booleano, sin cálculo automático
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

    const importes = {
      roto: "$30",
      manchado: "$20",
      mojado: "$25",
      rayado: "$15",
      sin_daños: "$0",
      retraso: "$10",  // importe fijo si se marca
    };

    let daños = Object.entries(condiciones)
      .filter(([_, marcado]) => marcado)
      .map(([clave]) => [
        clave === "retraso"
          ? "ENTREGA TARDÍA"
          : clave.replace("_", " ").toUpperCase(),
        importes[clave] || "$0",
      ]);

    if (daños.length === 0) {
      daños = [["SIN DAÑOS", "$0"]];
    }

    autoTable(doc, {
      startY: 75,
      head: [["Daños reportados", "Importe"]],
      body: daños,
      headStyles: {
        fillColor: "#537473",
        textColor: 255,
        halign: "center",
      },
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        textColor: [50, 50, 50],
      },
      styles: {
        fontSize: 10,
        cellPadding: 6,
      },
    });

    const total = daños.reduce((sum, [_, importe]) => {
      const valor = parseFloat(importe.replace("$", "")) || 0;
      return sum + valor;
    }, 0);

    doc.setFontSize(12);
    doc.text(`Total: $${total}`, 14, doc.lastAutoTable.finalY + 10);

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
        const res = await fetch(
          `http://localhost:4000/prestamos/activos?search=${busqueda}`
        );
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

  const tipoTitulo = (texto) =>
    typeof texto === "string"
      ? texto
          .toLowerCase()
          .split(" ")
          .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
          .join(" ")
      : "";

  const abrirModal = (prestamo) => {
    setPrestamoSeleccionado(prestamo);
    setCondiciones({
      roto: false,
      manchado: false,
      mojado: false,
      rayado: false,
      sin_daños: false,
      retraso: false, // no marcado automático
    });
    setOpen(true);
  };


  const confirmarDevolucion = async () => {
    try {
      // Envía condiciones tal cual, retraso es booleano controlado manualmente
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

      setOpen(false)
      generarPDF()
      toast.success('Prestamo devuelto con éxito!')

    } catch (error) {
      console.error(error);
      toast.error(`Hubo un error al devolver el libro: ${error.message}`);
    }
  };

  if (loading) return <p>Cargando préstamos activos...</p>;

  return (
    <div className="flex flex-col h-full w-full px-16 pt-6">
      <div><Toaster/></div>

      <div className="font-bold text-5xl mb-2">Préstamos</div>
      <div className="text-xl mb-4 text-gray-500">
        Listado de Préstamos en Activo
      </div>

      <input
        className={`bg-white w-72 px-4 py-2 mb-4 self-end rounded-lg shadow-md ${
          expanded ? "h-auto" : "hidden"
        } overflow-hidden`}
        type="search"
        placeholder="Buscar"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      
      <div className="flex-grow w-full">
      {loading ? (
        <p>Cargando Préstamos Activos</p> 
      ) : prestamos.length === 0 ? ( 
      <p>No hay Préstamos Activos</p>
      ) : (

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
                <tr
                  key={`${p.ISBN}-${p.nombre_solicitante}-${p.fecha_prestamo}`}
                  className={`hover:bg-gray-100 ${
                    false /* ya no usamos retraso automático */ ? "bg-red-100" : ""
                  }`}
                  onClick={() => abrirModal(p)}
                >
                  <td className="py-2 px-4 border-t border-gray-400 font-bold">
                    {tipoTitulo(p.ISBN)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    {tipoTitulo(p.titulo)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    {tipoTitulo(p.autor)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    {tipoTitulo(p.nombre_solicitante)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    {formatearFecha(p.fecha_prestamo)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    {formatearFecha(p.fecha_devolucion)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    <button
                      className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]"
                      onClick={() => abrirModal(p)}
                    >
                      Devolver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="text-center w-160">
          <h3 className="text-lg font-black">Devolver Préstamo</h3>
          <p className="text-sm text-gray-500">
            Captura los datos para la devolución del préstamo.
          </p>

          <div className="flex flex-row justify-stretch items-start mt-8 mb-8">
            {open && prestamoSeleccionado && (
              <div className="text-left mx-3 basis-3/5 flex-none border-r-2 border-gray-300 ">
                <h4 className="font-semibold mb-1">Titulo</h4>
                <p className="text-md text-gray-500 pb-2 mr-4">
                  {tipoTitulo(prestamoSeleccionado.titulo)}
                </p>
                <h4 className="font-semibold mb-1">Solicitante</h4>
                <p className="text-md text-gray-500 mr-4">
                  {tipoTitulo(prestamoSeleccionado.nombre_solicitante)}
                </p>
              </div>
            )}

            <div className="text-left mx-3 flex-1">
              <div className="flex flex-col justify-between">
                <h4 className="font-semibold mb-1">Multas Aplicables</h4>

                {["retraso", "roto", "manchado", "mojado", "rayado", "sin_daños"].map(
                  (cond) => {
                    const label =
                      cond === "sin_daños"
                        ? "Sin daños"
                        : cond === "retraso"
                        ? "Entrega tardía"
                        : cond.charAt(0).toUpperCase() + cond.slice(1);

                    return (
                      <label className="block" key={cond}>
                        <input
                          type="checkbox"
                          className="mr-2 accent-[#480422]"
                          checked={!!condiciones[cond]}
                          onChange={(e) => {
                          const updated = {
                            ...condiciones,
                            [cond]: e.target.checked,
                          };

                          // Si se selecciona cualquier otro que NO sea "sin_daños" ni "retraso", desmarcar "sin_daños"
                          if (cond !== "sin_daños" && cond !== "retraso" && e.target.checked) {
                            updated.sin_daños = false;
                          }

                          // Si se selecciona "sin_daños", desmarcar todos excepto "sin_daños" y "retraso"
                          if (cond === "sin_daños" && e.target.checked) {
                            Object.keys(updated).forEach((key) => {
                              if (key !== "sin_daños" && key !== "retraso") updated[key] = false;
                            });
                          }

                          setCondiciones(updated);
                        }}
                        />
                        {label}
                      </label>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="w-full h-12 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="w-full h-12 bg-[#537473] text-gray-100 rounded-lg hover:bg-[#3d5352]"
              onClick={() => {
                confirmarDevolucion();
              }}
            >
              Devolver Préstamo
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Prestamos;
