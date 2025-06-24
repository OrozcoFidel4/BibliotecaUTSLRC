import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";

function Libros() {
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 1024);
  const [open, setOpen] = useState(false)

  const [libros, setLibros] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [limitePorPagina, setLimitePorPagina] = useState(10);
  const [search, setSearch] = useState("");


  // Detectar cambio de tamaño para mostrar el input de búsqueda
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => {
      setExpanded(mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Obtener libros desde el backend
  useEffect(() => {
    const obtenerLibros = async () => {
      try {
        const offset = (paginaActual - 1) * limitePorPagina;
        const response = await fetch(
          `http://localhost:4000/libros?limit=${limitePorPagina}&offset=${offset}&search=${encodeURIComponent(search)}`
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

  //Cambiar titulo a tipo oracion
  function tipoTitulo(texto) {
    return texto
      .toLowerCase()
      .split(" ")
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  }

  return (
    <div className="flex flex-col min-h-screen w-full px-16 pt-6">
      <div className="font-bold text-5xl mb-2">Libros</div>
      <div className="text-xl mb-4">Listado de Libros en Biblioteca</div>


      {/* Input de búsqueda */}
      <input
        className={`bg-white w-72 px-4 py-2 mb-4 self-end rounded-lg shadow-md ${
          expanded ? "h-auto" : "hidden"
        } overflow-hidden`}
        type="search"
        placeholder="Buscar"
        value={search}
        onChange={(e)=> {
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
                    onClick={()=> setOpen(true)}>
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
              <option className="bg-gray-300 hover:bg-gray-300" value="10">10</option>
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
        <div className="text-center w-80">
          <div className="mx-auto my-4 w-64">
            <h3 className="text-lg font-black">Crear Préstamo</h3>
            <p className="text-sm text-gray-500">Captura los datos para el Préstamo</p>
          </div>
            
          <div className="flex gap-4 mt-8">
            <button className="w-full h-12 bg-gray-300 rounded-lg hover:bg-gray-400" onClick={() => setOpen(false)}> Cancelar</button>
            <button className="w-full h-12 bg-[#537473] text-gray-100 rounded-lg hover:bg-[#3d5352]" >Crear Préstamo</button>                
          </div>
        </div>
      </Modal>

    </div>
  );
}

export default Libros;
