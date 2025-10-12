import { motion } from "framer-motion";
import TopBooks from "./TopBooks";
import { links } from "@/data/constants";
import type { Book } from "@/interfaces/book.interface";

const BookClubHero = ({ books }: { books: Book[] }) => {
  return (
    <section className="relative min-h-screen py-12 md:py-24 px-4 md:px-6 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className="absolute top-10 md:top-20 left-5 md:left-20 w-48 h-48 md:w-64 md:h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-20 md:top-40 right-5 md:right-20 w-48 h-48 md:w-64 md:h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob delay-500"></div>
        <div className="absolute bottom-10 md:bottom-20 left-1/2 w-48 h-48 md:w-64 md:h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16 relative">
          <div className="lg:w-1/3 z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
                Nuestras{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Lecturas
                </span>
              </h1>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0">
                Explora nuestra colección de libros discutidos en el club. Cada
                semana, una nueva aventura literaria nos espera.
              </p>
              <a
                href={links.whatsapp}
                target="_blank"
                className="group relative inline-block px-6 md:px-8 py-3 md:py-4 font-medium text-white text-sm md:text-base"
              >
                <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-purple-600 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <span className="absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-pink-600 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <span className="relative">Unirse al club</span>
              </a>
            </motion.div>
          </div>

          <TopBooks books={books} />
        </div>
      </div>
    </section>
  );
};

export default BookClubHero;
