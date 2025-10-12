import { useState } from "react";
import { motion } from "framer-motion";
import type { Book } from "@/interfaces/book.interface";

export default function TopBooks({ books }: { books: Book[] }) {
  const [topBooks, setTopBooks] = useState<Book[]>(books.slice(0, 3));

  return (
    <div className="lg:w-2/3 w-full">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center sm:justify-end items-center">
        {topBooks.map((book, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`relative group w-full max-w-[280px] sm:w-[200px] md:w-[220px] lg:w-[240px] ${
              index === 1
                ? "sm:mt-8 md:mt-12"
                : index === 2
                  ? "sm:mt-16 md:mt-24"
                  : ""
            }`}
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <img
                src={book.bookImage}
                alt={book.title}
                className="w-full h-[320px] sm:h-[300px] md:h-[340px] lg:h-[360px] object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute bottom-0 left-0 right-0 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-6 sm:pt-8 pb-3 sm:pb-4 px-4 sm:px-6">
                  <div className="relative z-10">
                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-2">
                      Semana {book.week}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 drop-shadow-sm leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-white/90 text-sm font-medium drop-shadow-sm">
                      {book.author}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
