import React from "react";
import Sidebar, { SidebarItem } from "../components/Sidebar";
import { House, BookUp, History, LibraryBig, ChartLine } from "lucide-react";

import { useLocation, Outlet } from "react-router";

function Layout() {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div className="h-screen flex">
      <Sidebar>
        <SidebarItem
          icon={<House size={20} />}
          text="Inicio"
          navigateTo={"/"}
          active={currentPath === "/"}
        />
        <SidebarItem
          icon={<BookUp size={20} />}
          text="Préstamos"
          navigateTo={"/prestamos"}
          active={currentPath.startsWith("/prestamos")}
        />
        <SidebarItem
          icon={<History size={20} />}
          text="Historial"
          navigateTo={"/historial"}
          active={currentPath.startsWith("/historial")}
        />
        <SidebarItem
          icon={<LibraryBig size={20} />}
          text="Libros"
          navigateTo={"/libros"}
          active={currentPath.startsWith("/libros")}
        />
        <SidebarItem
          icon={<ChartLine size={20} />}
          text="Estadísticas"
          navigateTo={"/estadisticas"}
          active={currentPath.startsWith("/estadisticas")}
        />
      </Sidebar>

      
      <div className="flex flex-col flex-1 min-w-0 bg-gray-200">
        <main className="flex-1 overflow-auto px-4 py-6">
          <Outlet />
        </main>

        <footer className="bg-gray-800 text-center p-3 text-sm text-white">
          Universidad Tecnológica De San Luis Rio Colorado.
        </footer>
      </div>
    </div>
  );
}

export default Layout;
