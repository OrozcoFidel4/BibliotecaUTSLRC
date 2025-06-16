import React from 'react'

import Sidebar, { SidebarItem } from "../../components/Sidebar";
import {
  House,
  BookUp,
  History,
  LibraryBig,
  ChartLine
} from 'lucide-react'

function Libros() {
  return (
    <Sidebar>
      <SidebarItem icon={<House size={20}/>} text="Inicio" navigateTo={"/home"}/>
      <SidebarItem icon={<BookUp size={20}/>} text="Préstamos" navigateTo={"/prestamos"}/>
      <SidebarItem icon={<History size={20}/>} text="Historial" navigateTo={"/historial"}/>
      <SidebarItem icon={<LibraryBig size={20}/>} text="Libros" navigateTo={"/libros"} active/>
      <SidebarItem icon={<ChartLine size={20}/>} text="Estadísticas" navigateTo={"/estadisticas"}/>
    </Sidebar>
  )
}

export default Libros