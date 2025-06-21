import React from "react";
import { useState, useEffect } from "react";

function Prestamos() {
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 1024);

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
                <th className="py-2 px-4 border-gray-400">ISBN</th>
                <th className="py-2 px-4 border-gray-400">Título</th>
                <th className="py-2 px-4 border-gray-400">Autor</th>
                <th className="py-2 px-4 border-gray-400">Edición</th>
                <th className="py-2 px-4 border-gray-400"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 cursor-pointer">
                <td className="py-2 px-4 border-t border-gray-400 font-bold">
                  9780875847405
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DESARROLLO HUMANO
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DIANE E. PAPALIA GABRIELA MARTORELL
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DECIMOTERCERA EDICIÓN
                </td>
                <td className="py-2 px-4 border-t border-gray-400">
                  <button className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]">
                    Devolver
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-gray-100 cursor-pointer">
                <td className="py-2 px-4 border-t border-gray-400 font-bold">
                  9780875847405
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DESARROLLO HUMANO
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DIANE E. PAPALIA GABRIELA MARTORELL
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DECIMOTERCERA EDICIÓN
                </td>
                <td className="py-2 px-4 border-t border-gray-400">
                  <button className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]">
                    Devolver
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-gray-100 cursor-pointer">
                <td className="py-2 px-4 border-t border-gray-400 font-bold">
                  9780875847405
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DESARROLLO HUMANO
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DIANE E. PAPALIA GABRIELA MARTORELL
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DECIMOTERCERA EDICIÓN
                </td>
                <td className="py-2 px-4 border-t border-gray-400">
                  <button className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]">
                    Devolver
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-gray-100 cursor-pointer">
                <td className="py-2 px-4 border-t border-gray-400 font-bold">
                  9780875847405
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DESARROLLO HUMANO
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DIANE E. PAPALIA GABRIELA MARTORELL
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DECIMOTERCERA EDICIÓN
                </td>
                <td className="py-2 px-4 border-t border-gray-400">
                  <button className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]">
                    Devolver
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-gray-100 cursor-pointer">
                <td className="py-2 px-4 border-t border-gray-400 font-bold">
                  9780875847405
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DESARROLLO HUMANO
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DIANE E. PAPALIA GABRIELA MARTORELL
                </td>
                <td className="py-2 px-4 border-t border-gray-400 text-gray-500">
                  DECIMOTERCERA EDICIÓN
                </td>
                <td className="py-2 px-4 border-t border-gray-400">
                  <button className="h-8 w-24 mx-2 bg-[#88073f] text-gray-100 rounded-lg hover:bg-[#480422]">
                    Devolver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Prestamos;
