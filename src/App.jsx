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
  Boxes
} from 'lucide-react'

function App() {


  return (
    <BrowserRouter>
      
    <Sidebar>
      <SidebarItem icon={<Boxes size={20}/>} text="Inventory" active/>

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
