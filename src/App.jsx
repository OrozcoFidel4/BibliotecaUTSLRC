import { useState } from "react";
import "./App.css";
import { Route, BrowserRouter, Routes} from "react-router";

/* Pages */
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Prestamos from "./pages/prestamos/prestamos";
import Estadisticas from "./pages/estadisticas/estadisticas";
import Historial from "./pages/historial/historial"; 
import Libros from "./pages/libros/libros";

function App() {


  return (
    <BrowserRouter>


      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Home />}/>
        <Route path="/prestamos" element={<Prestamos />}/>
        <Route path="/historial" element={<Historial />}/>
        <Route path="/libros" element={<Libros />}/>
        <Route path="/estadisticas" element={<Estadisticas />}/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
