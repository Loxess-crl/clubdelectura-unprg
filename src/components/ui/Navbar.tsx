import React, { useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  ChevronDown,
  Book,
  User,
} from "lucide-react";
import { Button } from "./shadcn/Button";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/Avatar";
import { cn } from "@/lib/utils";
import { app } from "@/firebase/client";
import LoginModal from "./LoginModal";

interface SidebarButtonProps {
  href: string;
  isActive: boolean;
  icon: ReactNode;
  children: ReactNode;
}

const SidebarButton = ({
  href,
  isActive,
  icon,
  children,
}: SidebarButtonProps) => {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center space-x-3 p-2 rounded-lg transition-colors transform duration-300 ease-in-out",
        isActive
          ? "bg-gray-900 text-white hover:bg-gray-700"
          : " text-gray-500 hover:bg-gray-200"
      )}
    >
      {icon}
      <span>{children}</span>
    </a>
  );
};

const Navbar = ({ currentPath }: { currentPath: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isUserLoggedIn = localStorage.getItem("userId") !== null;
  const userName = localStorage.getItem("userName") ?? "User";
  const userEmail = localStorage.getItem("userEmail") ?? "";
  const userAvatar = localStorage.getItem("userAvatar") ?? "";
  const userAvatarFallback = userName[0];

  return (
    <div className="fixed right-0 top-0 z-50 flex h-full translate-x-full">
      <div
        className={`
          bg-slate-50 p-4 shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? "-translate-x-full" : "translate-x-0"}
          w-80 h-full overflow-y-auto rounded-l-lg
        `}
      >
        <div className="flex items-center justify-between p-2 bg-white rounded-lg mb-6 shadow-sm border">
          {isUserLoggedIn ? (
            <>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>{userAvatarFallback}</AvatarFallback>
                </Avatar>

                <div className="text-left">
                  <p className="text-sm font-semibold">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
              </div>

              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center items-center w-full p-3 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
                <button
                  className="text-sm font-medium"
                  onClick={() => setIsModalOpen(true)}
                >
                  Iniciar sesión
                </button>
              </div>
            </>
          )}
        </div>

        {/* Menú de navegación */}
        <nav className="space-y-2">
          <SidebarButton
            href="/"
            isActive={currentPath === "/"}
            icon={<Home className="h-5 w-5" />}
          >
            Inicio
          </SidebarButton>
          <SidebarButton
            href="/libros/el_corazon_delator"
            isActive={currentPath.includes("/libros")}
            icon={<Book className="h-5 w-5" />}
          >
            Libros
          </SidebarButton>
          <SidebarButton
            href="/perfil"
            isActive={currentPath === "/perfil"}
            icon={<User className="h-5 w-5" />}
          >
            Perfil
          </SidebarButton>
        </nav>
      </div>

      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          absolute top-1/4 right-[calc(100% - 2rem)]
          flex items-center justify-center
          w-10 h-12 
          bg-blue-600
          text-white
          rounded-l-lg
          shadow-lg
          transform -translate-x-full
          transition-all duration-300 ease-in-out
          hover:w-12 hover:bg-blue-700
          hover:shadow-xl
          hover:scale-105
          active:scale-95
          focus:outline-none
          group
        `}
        title="Abrir navbar"
      >
        {isOpen ? (
          <ChevronRight className="w-6 h-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-1" />
        ) : (
          <ChevronLeft className="w-6 h-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1" />
        )}
      </button>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        action="interactuar con la comunidad"
      />
    </div>
  );
};

export default Navbar;
