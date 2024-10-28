import { getRatedBooks } from "@/hooks/useRating";
import type { CollectionEntry, ContentCollectionKey } from "astro:content";
import { ArrowRight, Search, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AllBooks({
  books,
}: {
  books: CollectionEntry<"books">[];
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const [filteredBooks, setFilteredBooks] = useState(books);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRatedBooks = async () => {
      const ratedBooks = await getRatedBooks();

      const ratedBooksData = books.map((book) => {
        const ratedBook = ratedBooks.find((b) => b.id == book.data.week);
        return ratedBook ? { ...book, ratings: ratedBook.ratings } : book;
      });

      setFilteredBooks(ratedBooksData);
    };

    fetchRatedBooks();
  }, []);
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search */}
        <div className="mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Biblioteca del Club
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explora nuestra colección curada de obras literarias, calificadas
              y recomendadas por nuestra comunidad.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Buscar por título o autor..."
                className="w-full p-6 pl-14 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none shadow-sm transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFilteredBooks(
                    books.filter((book) =>
                      book.data.title
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    )
                  );
                }}
              />
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-purple-500"
                size={24}
              />
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 blur-xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
            </div>
          </motion.div>
        </div>

        {/* Books Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              variants={item}
              className="group relative"
            >
              <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4">
                <img
                  src={book.data.bookImage.src}
                  alt={book.data.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <a
                    href={`libros/${book.slug}`}
                    className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    Ver detalles
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                    Semana {book.data.week}
                  </span>
                  {book.data.ratings && (
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-yellow-400 fill-current"
                      />
                      <span className="text-sm font-medium">
                        {book.data.ratings.average.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({Object.keys(book.data.ratings.votes ?? 0).length})
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-xl leading-tight">
                  {book.data.title}
                </h3>
                <p className="text-gray-600">{book.data.authors}</p>

                {book.data.ratings && (
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(book.data.ratings?.average || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
