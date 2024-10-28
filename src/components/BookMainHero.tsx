import React from "react";
import { motion } from "framer-motion";
import type { CollectionEntry } from "astro:content";
import TopBooks from "./TopBooks";
import { links } from "@/data/constants";

const BookClubHero = ({ books }: { books: CollectionEntry<"books">[] }) => {
  return (
    <section className="relative min-h-screen py-24 px-6 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 relative">
          {/* Text Content */}
          <div className="lg:w-1/3 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl font-bold mb-6 tracking-tight">
                Nuestras{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Lecturas
                </span>
              </h1>
              <p className="text-gray-600 text-xl leading-relaxed mb-8">
                Explora nuestra colección de libros discutidos en el club. Cada
                semana, una nueva aventura literaria nos espera.
              </p>
              <a
                href={links.whatsapp}
                target="_blank"
                className="group relative px-8 py-4 font-medium text-white"
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
