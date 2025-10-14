import AdminLayout from "@/components/admin/AdminLayout";
import { BookOpen, Library, Users, BookMarked } from "lucide-react";
import { motion } from "framer-motion";
import { LocalStorageKeys } from "@/data/constants";
import { getItemsFromLocalStorage } from "@/hooks/localStorageService";
import type { User } from "@/interfaces/user.interface";

const IndexAdmin = ({ currentPath }: { currentPath: string }) => {
  const user = getItemsFromLocalStorage<User>(LocalStorageKeys.user);

  const features = [
    {
      icon: BookOpen,
      title: "Gestión de Libros",
      description: "Administra el catálogo completo de libros del club",
      link: "/admin/libros",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Library,
      title: "Biblioteca Digital",
      description: "Organiza y categoriza la colección literaria",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Comunidad Lectora",
      description: "Conecta con los miembros del club de lectura",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BookMarked,
      title: "Contenido Destacado",
      description: "Selecciona y promociona las mejores lecturas",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <AdminLayout currentPath={currentPath}>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-foreground/80">
                  Panel de Administración
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Bienvenido,{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {user?.displayName?.split(" ")[0] || "Administrador"}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Gestiona y organiza el contenido del Club de Lectura UNPRG de
                forma eficiente y profesional.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.a
                key={index}
                href={feature.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className={`group relative overflow-hidden rounded-2xl bg-card border border-border p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                  feature.link ? "cursor-pointer" : "cursor-default"
                }`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative space-y-2">
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Arrow indicator for clickable cards */}
                {feature.link && (
                  <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.a>
            ))}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-border"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Acceso Rápido</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Comienza a gestionar el contenido del club de lectura desde las
              opciones del menú lateral.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/admin/libros"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
              >
                <BookOpen className="w-4 h-4" />
                Gestionar Libros
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Ver Sitio Web
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default IndexAdmin;
