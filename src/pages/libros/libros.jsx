import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";

function Libros() {
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 1024);
  const [open, setOpen] = useState(false);

  const [libros, setLibros] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limitePorPagina, setLimitePorPagina] = useState(10);
  const [search, setSearch] = useState("");

  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [fechaPrestamo, setFechaPrestamo] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [nombreSolicitante, setNombreSolicitante] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleResize = () => setExpanded(mediaQuery.matches);
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  useEffect(() => {
    const obtenerLibros = async () => {
      try {
        const offset = (paginaActual - 1) * limitePorPagina;
        const response = await fetch(
          `http://localhost:4000/libros?limit=${limitePorPagina}&offset=${offset}&search=${encodeURIComponent(
            search
          )}`
        );
        const result = await response.json();
        setLibros(result.data);
        setTotalPaginas(Math.ceil(result.total / limitePorPagina));
      } catch (error) {
        console.error("Error al obtener libros:", error);
      }
    };
    obtenerLibros();
  }, [paginaActual, limitePorPagina, search]);

  useEffect(() => {
    if (open) {
      const hoy = new Date().toISOString().split("T")[0];
      setFechaPrestamo(hoy);
      setFechaDevolucion("");
      setNombreSolicitante("");
      setSugerencias([]);
      setMostrarSugerencias(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || nombreSolicitante.trim() === "") {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetch(
        `http://localhost:4000/alumnos?nombre=${encodeURIComponent(
          nombreSolicitante
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          setSugerencias(data.data || []);
          setMostrarSugerencias(true);
        })
        .catch(() => {
          setSugerencias([]);
          setMostrarSugerencias(false);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [nombreSolicitante, open]);

  function tipoTitulo(texto) {
    return texto
      .toLowerCase()
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  }

  const abrirModalPrestamo = (libro) => {
    setLibroSeleccionado(libro);
    setOpen(true);
  };

  const validarYConfirmarPrestamo = async () => {
    try {
      const responseAlumno = await fetch(
        `http://localhost:4000/alumnos?nombre=${encodeURIComponent(
          nombreSolicitante
        )}`
      );
      const resultAlumno = await responseAlumno.json();

      if (!resultAlumno.data || resultAlumno.data.length === 0) {
        alert("El alumno no existe. Verifica el nombre.");
        return;
      }

      const responsePrestamo = await fetch("http://localhost:4000/prestamos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ISBN: libroSeleccionado.ISBN,
          fechaPrestamo,
          fechaDevolucion,
          nombreSolicitante,
        }),
      });

      if (!responsePrestamo.ok) {
        const errorData = await responsePrestamo.json();
        alert("Error al realizar préstamo: " + errorData.message);
        return;
      }

      alert("Préstamo realizado correctamente");
      setOpen(false);
      setPaginaActual(1);
      setSearch("");
    } catch (error) {
      console.error("Error en el préstamo:", error);
      alert("Ocurrió un error al registrar el préstamo.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full px-16 pt-6">
      <div className="font-bold text-5xl mb-2">Libros</div>
      <div className="text-xl mb-4 text-gray-500">
        Listado de Libros en Biblioteca
      </div>

      {/* Input de búsqueda */}
      <input
        className={`bg-white w-72 px-4 py-2 mb-4 self-end rounded-lg shadow-md ${
          expanded ? "h-auto" : "hidden"
        } overflow-hidden`}
        type="search"
        placeholder="Buscar"
        value={search}
        onChange={(e) => {
          setPaginaActual(1);
          setSearch(e.target.value);
        }}
      />

      {/* Tabla de libros */}
      <div className="flex-grow w-full">
        <div className="overflow-hidden rounded-lg shadow-md mb-8">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="hover:bg-gray-100 cursor-pointer">
                <th className="py-2 px-4 border-gray-400">ISBN</th>
                <th className="py-2 px-4 border-gray-400">Título</th>
                <th className="py-2 px-4 border-gray-400">Autor</th>
                <th className="py-2 px-4 border-gray-400">Disponibles</th>
                <th className="py-2 px-4 border-gray-400">Edición</th>
                <th className="py-2 px-4 border-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro, index) => (
                <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                  <td className="py-2 px-4 border-t border-gray-400 font-bold">
                    {libro.ISBN}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    {tipoTitulo(libro.titulo)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    {tipoTitulo(libro.autor)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm text-center">
                    {libro.cantidad_total_en_existencia}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400 text-gray-500 text-sm">
                    {tipoTitulo(libro.edicion)}
                  </td>
                  <td className="py-2 px-4 border-t border-gray-400">
                    <button
                      className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]"
                      onClick={() => abrirModalPrestamo(libro)}
                    >
                      Préstamo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-row justify-between items-center">
          {/* Selector de libros por página */}
          <div className="flex justify-end mb-4 gap-2 items-center">
            <label>Libros por página:</label>
            <select
              value={limitePorPagina}
              onChange={(e) => {
                setPaginaActual(1);
                setLimitePorPagina(parseInt(e.target.value));
              }}
              className="bg-gray-300 rounded p-1 hover:bg-gray-400 disabled:opacity-50"
            >
              <option className="bg-gray-300 hover:bg-gray-300" value="10">
                10
              </option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {/* Controles de paginación al final de la tabla */}
          <div className="flex justify-end pr-4 gap-2 mb-2">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="py-2 px-4 self-center">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
              }
              disabled={paginaActual >= totalPaginas}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="text-center w-180">
          <h3 className="text-lg font-black">Crear Préstamo</h3>
          <p className="text-sm text-gray-500 ">
            Captura los datos para el préstamo
          </p>

          <div className="flex flex-row justify-around items-start mt-6 mb-4">

            {libroSeleccionado && (
              <div className="text-left mx-3 justify-center">
                
                <h4 className="font-semibold mb-1">Titulo</h4>
                <p className="text-md text-gray-500 pb-2">
                  {tipoTitulo(libroSeleccionado.titulo)}
                </p>

                <h4 className="font-semibold mb-1">Autor</h4>
                <p className="text-md text-gray-500">
                  {tipoTitulo(libroSeleccionado.autor)}
                </p>

              </div>
            )}

            


            <div>
              <input
              type="date"
              className="w-full border p-2 rounded mb-2"
              value={fechaPrestamo}
              onChange={(e) => setFechaPrestamo(e.target.value)}
              disabled={true}
            />

              <input
              type="date"
              className="w-full border p-2 rounded mb-2"
              value={fechaDevolucion}
              onChange={(e) => setFechaDevolucion(e.target.value)}
              />

              <input
                type="text"
                placeholder="Nombre del solicitante"
                className="w-full border p-2 rounded mb-2"
                value={nombreSolicitante}
                onChange={(e) => setNombreSolicitante(e.target.value)}
              />

            </div>

          </div>

          {mostrarSugerencias && sugerencias.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-48 overflow-auto rounded shadow-md">
                      {sugerencias.map((alumno, index) => {
                        const nombreCompleto = `${alumno.NOMBRE} ${alumno.APELLIDO_PATERNO} ${alumno.APELLIDO_MATERNO}`;
                        return (
                          <li
                            key={index}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                            onClick={() => {
                              setNombreSolicitante(nombreCompleto);
                              setMostrarSugerencias(false);
                            }}
                          >
                            {nombreCompleto}
                          </li>
                        );
                      })}
                    </ul>
                  )}

          <div className="flex gap-4">
            <button
              className="w-full h-12 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="w-full h-12 bg-[#537473] text-gray-100 rounded-lg hover:bg-[#3d5352]"
              onClick={validarYConfirmarPrestamo}
            >
              Crear Préstamo
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Libros;
