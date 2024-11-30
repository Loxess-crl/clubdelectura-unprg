import { getTopRatedBooks } from "@/hooks/useRating";
import type { CollectionEntry } from "astro:content";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TopBooks({
  books,
}: {
  books: CollectionEntry<"books">[];
}) {
  const [topBooks, setTopBooks] = useState<CollectionEntry<"books">[]>(
    books.slice(0, 3)
  );

  // useEffect(() => {
  //   const fetchTopBooks = async () => {
  //     const featuredBooks = await getTopRatedBooks();

  //     const topBooks = books.filter((book) =>
  //       featuredBooks.some((b) => b.id == book.data.week)
  //     );

  //     setTopBooks(topBooks);
  //   };

  //   fetchTopBooks();
  // }, []);
  return (
    <div className="lg:w-2/3">
      <div className="flex gap-6 justify-end">
        {topBooks.map((book, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`relative group w-[240px] ${
              index === 1 ? "mt-12" : index === 2 ? "mt-24" : ""
            }`}
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <img
                src={book.data.bookImage.src}
                alt={book.data.title}
                className="w-full h-[360px] object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute bottom-0 left-0 right-0 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 pb-4 px-6">
                  <div className="relative z-10">
                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-2">
                      Semana {book.data.week}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-1 drop-shadow-sm">
                      {book.data.title}
                    </h3>
                    <p className="text-white/90 text-sm font-medium drop-shadow-sm">
                      {book.data.authors}
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
