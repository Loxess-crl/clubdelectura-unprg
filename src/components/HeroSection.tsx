import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import logo from "@assets/images/icon.png";
import club2 from "@assets/img/club2.png";
import club3 from "@assets/img/club3.png";
import club6 from "@assets/img/club6.png";
import club7 from "@assets/img/club7.png";
import club8 from "@assets/img/club8.png";

const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-bgTheme px-6 pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-transparent"></div>

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-[20%] w-32 h-32 opacity-20"
        >
          <BookSVG1 />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-40 left-[15%] w-24 h-24 opacity-10"
        >
          <BookSVG2 />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="bg-purple-100 text-primaryTheme px-4 py-1.5 rounded-full text-sm font-medium">
                Club de Lectura UNPRG
              </span>
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-bold mt-6 mb-6 leading-tight">
              Un espacio para{" "}
              <span className="relative">
                crecer
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute bottom-1 left-0 h-3 bg-purple-200 -z-10"
                />
              </span>{" "}
              juntos a través de la lectura
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-8 lg:max-w-xl">
              Únete al club de lectura de la UNPRG, una comunidad hecha por y
              para estudiantes, donde nos reunimos para explorar libros
              fascinantes, compartir ideas y disfrutar de un espacio de
              aprendizaje y crecimiento.
            </p>

            <div className="flex flex-wrap gap-6 mb-12">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-accentTheme hover:bg-primaryTheme text-white px-8 py-4 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-purple-200 transition-colors"
              >
                Únete ahora
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.a
                href="#info"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border-2 border-gray-200 hover:border-purple-200 px-8 py-4 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                Conoce más
              </motion.a>
            </div>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <img src={club7.src} alt="icono 7 de club" />
                </div>
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-gray-600">Miembros</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <img src={club6.src} alt="icono 6 de club" />
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-gray-600">Libros leídos</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <img src={club8.src} alt="icono 8 de club" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-gray-600">Ciclos activos</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center lg:justify-end"
          >
            <MainIllustration />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
};

const MainIllustration = () => (
  <img src={logo.src} alt="Ilustración principal" className="w-80 lg:w-96" />
);

const BookSVG1 = () => (
  <img src={club2.src} alt="Ilustración principal" className="w-80 lg:w-96" />
);

const BookSVG2 = () => (
  <img src={club3.src} alt="Ilustración principal" className="w-80 lg:w-96" />
);

export default HeroSection;
