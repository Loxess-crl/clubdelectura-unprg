import React, { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Book,
  Home,
  User,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Settings,
} from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/shadcn/Avatar";
import { Button } from "@/components/ui/shadcn/Button";
import LoginModal from "./LoginModal";

interface SidebarButtonProps {
  href: string;
  isActive: boolean;
  icon: any;
  children: ReactNode;
}

const SidebarButton = ({
  href,
  isActive,
  icon,
  children,
}: SidebarButtonProps) => {
  return (
    <motion.a
      href={href}
      className={`
        flex items-center gap-4 px-6 py-4 
        rounded-xl transition-all duration-500
        group relative overflow-hidden
        ${isActive ? "text-primaryTheme bg-accentTheme/10" : "text-gray-600 hover:text-primaryTheme"}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative z-10 flex items-center gap-4">
        {React.cloneElement(icon, {
          className: `w-5 h-5 transition-transform duration-500 
            ${isActive ? "text-primaryTheme" : "text-gray-600 group-hover:text-primaryTheme"}`,
        })}
        <span className="font-medium">{children}</span>
      </div>
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-accentTheme/5"
          layoutId="activeTab"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
          }}
        />
      )}
    </motion.a>
  );
};

const QuoteCard = () => (
  <div className="px-6 py-4 mt-6 bg-bgTheme rounded-2xl border border-surfaceTheme/30">
    <BookOpen className="w-8 h-8 text-secondaryTheme mb-3" />
    <p className="text-sm text-slate-800 italic">
      "Los libros son espejos: sólo ves en ellos lo que ya llevas dentro."
    </p>
    <p className="text-xs text-slate-700 mt-2">- Carlos Ruiz Zafón</p>
  </div>
);

const Navbar = ({ currentPath }: { currentPath: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isUserLoggedIn = localStorage.getItem("userId") !== null;
  const userName = localStorage.getItem("userName") ?? "Lector";
  const userEmail = localStorage.getItem("userEmail") ?? "";
  const userAvatar = localStorage.getItem("userAvatar") ?? "";
  const userAvatarFallback = userName[0];

  return (
    <motion.div
      className="fixed right-0 top-0 h-full z-50 flex"
      animate={{ x: isOpen ? 0 : 320 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`
          absolute right-full top-32
          w-12 h-12
          flex items-center justify-center
          bg-bgTheme rounded-l-xl
          shadow-lg border border-r-0 border-surfaceTheme
          text-surfaceTheme hover:text-primaryTheme
          transition-colors
        `}
        initial={false}
        animate={{ opacity: isOpen ? 0 : 1 }}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      <div className="w-80 h-full bg-bgTheme border-l border-surfaceTheme shadow-xl relative overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <motion.div
                className="text-xl font-semibold text-primaryTheme"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Club de Literatura
              </motion.div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-surfaceTheme hover:text-primaryTheme"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* User Profile */}
            {isUserLoggedIn ? (
              <motion.div
                className="flex items-center gap-4 p-4 bg-bgTheme rounded-2xl border border-surfaceTheme max-w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Avatar className="h-12 w-12 ring-2 ring-bgTheme">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-secondaryTheme text-bgTheme">
                    {userAvatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-brownTheme break-words">
                    {userName}
                  </p>
                  <p className="text-sm text-gray-800 break-words">
                    {userEmail}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.button
                className="w-full p-4 text-center bg-primaryTheme text-bgTheme rounded-xl font-medium hover:shadow-lg transition-shadow"
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Iniciar sesión
              </motion.button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 py-4">
            <SidebarButton
              href="/"
              isActive={currentPath === "/"}
              icon={<Home />}
            >
              Inicio
            </SidebarButton>
            <SidebarButton
              href="/libros"
              isActive={currentPath.includes("/libros")}
              icon={<Book />}
            >
              Biblioteca
            </SidebarButton>
            <SidebarButton
              href="/perfil"
              isActive={currentPath === "/perfil"}
              icon={<User />}
            >
              Mi Perfil
            </SidebarButton>
          </nav>

          <QuoteCard />

          <div className="p-6 border-t border-surfaceTheme/30">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 text-surfaceTheme hover:text-primaryTheme"
              onClick={() => {}}
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </Button>
          </div>
        </div>
      </div>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        action="interactuar con la comunidad"
      />
    </motion.div>
  );
};

export default Navbar;
