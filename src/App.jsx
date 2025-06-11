import { useState } from "react";
import "./App.css";
import { Route, BrowserRouter, Routes} from "react-router";

/* Pages */
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Prestamos from "./pages/prestamos/prestamos";
import Devoluciones from "./pages/devoluciones/devoluciones";

import Sidebar, { SidebarItem } from "./components/Sidebar";
import {
  House,
  BookUp,
  History,
  LibraryBig,
  ChartLine
} from 'lucide-react'

function App() {


  return (
    <BrowserRouter>
      
    <Sidebar>
      <SidebarItem icon={<House size={20}/>} text="Inicio"/>
      <SidebarItem icon={<BookUp size={20}/>} text="Préstamos"/>
      <SidebarItem icon={<History size={20}/>} text="Historial"/>
      <SidebarItem icon={<LibraryBig size={20}/>} text="Libros"/>
      <SidebarItem icon={<ChartLine size={20}/>} text="Estadísticas"/>

    </Sidebar>

      {/* <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/prestamos" element={<Prestamos />}/>
        <Route path="/devoluciones" element={<Devoluciones />}/>

      </Routes> */}

    </BrowserRouter>
  );
}

export default App;
