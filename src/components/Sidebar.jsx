import { LogOut } from "lucide-react"
import { useContext, createContext, useState, useEffect } from "react"
import LogoUT from "../assets/UtLogo.png"
import LogoUTChico from "../assets/UtLogoChico.png"
import { useNavigate } from "react-router"

const SidebarContext = createContext()

export default function Sidebar({ children }) {

  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 1024)

  useEffect(() => {
  const mediaQuery = window.matchMedia("(min-width: 1024px)")

  const handleResize = () => {
    setExpanded(mediaQuery.matches)
  }

  // Set initial value and attach listener
  handleResize()
  mediaQuery.addEventListener("change", handleResize)

  // Clean up on unmount
  return () => mediaQuery.removeEventListener("change", handleResize)
  }, [])
  
  return (
    <aside className={`h-screen ${expanded ? "w-64" : "w-16"} transition-all duration-300`}>
      <nav className="h-full flex flex-col bg-[#537473]">
        <button className={`pt-8 pb-6 border-b border-[#3d5352] flex flex-col items-center px-4 space-x-2
                           ${expanded ?  "h-auto" : "h-0" } overflow-hidden` }  onClick={() => navigate("/")}>
          {expanded && <img
            
            src={LogoUT}
            className={`transition-all duration-300 ${
              expanded ? "w-32" : "w-0 h-0"
            } overflow-hidden`}
            alt=""
          />}

          {!expanded && <img
            
            src={LogoUTChico}
            className={`transition-all duration-300 h-auto w-auto ml-2 `}
            alt=""
          />}

          <h4
            className={`font-semibold transition-all duration-300 whitespace-nowrap text-gray-100 ${
              expanded
                ? "w-auto opacity-100 visible"
                : "w-0 opacity-0 invisible"
            }`}
          >
            Sistema Bibliotecario
          </h4>
        </button>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 mt-6">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-[#3d5352] flex p-3">
          
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-gray-100">John Doe</h4>
              <span className="text-xs text-gray-100">johndoe@gmail.com</span>
            </div>
            <button className="h-auto w-auto p-2 rounded-lg hover:bg-[#3d5352]">
              <LogOut size={20} className="text-gray-100"/>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert, navigateTo }) {
  const { expanded } = useContext(SidebarContext);
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(navigateTo);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer transition-colors group w-full
        ${active
          ? "bg-white text-[#3d5352]"
          : "hover:bg-[#3d5352] text-white"
        }
      `}
    >
      <div className="flex items-center w-full">
        
        <div className="flex items-center gap-2">
          <div className="text-xl">{icon}</div>

          <span
            className={`
              transition-all whitespace-nowrap overflow-hidden
              ${expanded ? "w-auto opacity-100" : "w-0 opacity-0"}
            `}
          >
            {text}
          </span>
        </div>
      </div>

      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded-full bg-yellow-400 ${expanded ? "" : "top-2"}`} />
      )}

    </button>
  );
}
