import type { Book } from "@/interfaces/book.interface";
import { Search, Star, Download, Calendar, User, Filter } from "lucide-react";
import { useEffect, useState } from "react";

export default function AllBooks({ books }: { books: Book[] }) {
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [sortBy, setSortBy] = useState("newest");

  const categories = ["todas", ...new Set(books.map((book) => book.category))];

  const getAverageRating = (book: Book) => {
    if (!book.ratings || Object.keys(book.ratings).length === 0) return 0;
    const ratings = Object.values(book.ratings);
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const getRatingCount = (book: Book) => {
    return book.ratings ? Object.keys(book.ratings).length : 0;
  };

  useEffect(() => {
    let filtered = books;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== "todas") {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    // Ordenar
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return getAverageRating(b) - getAverageRating(a);
        case "title":
          return a.title.localeCompare(b.title);
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory, sortBy]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-bgTheme via-white to-alternativeTheme/20">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primaryTheme/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-accentTheme/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-secondaryTheme/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-brownTheme border border-primaryTheme/20 text-sm font-medium shadow-sm">
                Biblioteca Digital
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-brownTheme leading-tight">
                Descubre Nuevos{" "}
                <span className="bg-gradient-to-r from-primaryTheme to-accentTheme bg-clip-text text-transparent">
                  Mundos
                </span>
              </h1>
              <p className="text-xl text-brownTheme/80 max-w-2xl mx-auto leading-relaxed">
                Explora nuestra colección de libros cuidadosamente seleccionados
                que te inspirarán y desafiarán tu imaginación.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full text-brownTheme border border-primaryTheme/20 text-sm font-medium shadow-sm">
                📚 {books.length} libros disponibles
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full text-brownTheme border border-accentTheme/20 text-sm font-medium shadow-sm">
                ⭐{" "}
                {
                  books.filter(
                    (book) =>
                      book.ratings && Object.keys(book.ratings).length > 0
                  ).length
                }{" "}
                con reseñas
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/80 backdrop-blur-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
                placeholder="Buscar por título, autor o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "todas" ? "Todas las categorías" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="rating">Mejor valorados</option>
                <option value="title">Alfabético</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No se encontraron libros
            </h3>
            <p className="text-gray-600">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <a
                key={book.slug}
                href={`/libros/${book.slug}`}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* Book Cover */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={book.bookImage}
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800">
                      {book.category}
                    </span>
                  </div>

                  {/* Week Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/90 backdrop-blur-sm text-white">
                      <Calendar className="w-3 h-3 mr-1" />
                      Semana {book.week}
                    </span>
                  </div>

                  {/* Downloads Badge */}
                  {book.downloads && book.downloads.length > 0 && (
                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/90 backdrop-blur-sm text-white">
                        <Download className="w-3 h-3 mr-1" />
                        {book.downloads.length}
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Book Info */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                      {book.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-1" />
                      <span className="font-medium">{book.author}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Publicado en {book.pubyear}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(getAverageRating(book))
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {getAverageRating(book) > 0
                          ? getAverageRating(book).toFixed(1)
                          : "Sin valorar"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({getRatingCount(book)} reseñas)
                    </span>
                  </div>

                  {/* Description Preview */}
                  {book.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
