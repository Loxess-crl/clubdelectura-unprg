import { getRatedBooks } from "@/hooks/useRating";
import type { CollectionEntry } from "astro:content";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

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
        const ratedBook = ratedBooks.find(
          (b) => Number(b.id) == Number(book.data.week)
        );
        return ratedBook ? { ...book, ratings: ratedBook.ratings } : book;
      });

      setFilteredBooks(ratedBooksData);
    };

    fetchRatedBooks();
  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="min-h-screen bg-gray-50">
        <div className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-blue-50 opacity-40" />
          <div className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <h1 className="relative">
                <span className="block text-gray-400 text-sm font-medium tracking-widest uppercase mb-3">
                  Biblioteca Digital
                </span>
                <span className="relative block">
                  <span className="block text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 via-pink-600 to-gray-600 leading-tight mb-4">
                    Descubre Nuevos Mundos
                  </span>
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Explora nuestra selección de libros que te inspirarán y
                desafiarán tu imaginación.
              </p>

              <div className="flex justify-center pt-8">
                <div className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-gray-900/5 shadow-lg rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto mb-16">
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                placeholder="Buscar por título o categoría..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFilteredBooks(
                    books.filter(
                      (book) =>
                        book.data.title
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase()) ||
                        book.data.category
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                    )
                  );
                }}
              />
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredBooks.map((book) => (
                <a
                  key={book.id}
                  className="group relative transform transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  href={`/libros/${book.slug}`}
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                    <img
                      src={book.data.bookImage.src}
                      alt={book.data.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white/90 text-gray-800">
                        {book.data.category}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold leading-tight line-clamp-2">
                          {book.data.title}
                        </h3>
                        <p className="text-xs font-medium opacity-90">
                          {book.data.authors}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="opacity-75">
                            {book.data.pubyear}
                          </span>
                          <span className="px-2 py-1 rounded-lg bg-blue-500/80 text-white text-xs">
                            Semana {book.data.week}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
