import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/shadcn/Carousel";
import { Card, CardContent } from "./ui/shadcn/card";
import { motion } from "framer-motion";
import { Star, Calendar, User, BookOpen } from "lucide-react";
import type { Book } from "@/interfaces/book.interface";

const BooksCarousel = ({ books }: { books: Book[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const calculateAverageRating = (ratings?: { [userId: string]: number }) => {
    if (!ratings || Object.keys(ratings).length === 0) return 0;
    const values = Object.values(ratings);
    return values.reduce((sum, rating) => sum + rating, 0) / values.length;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-yellow-500";
    if (rating >= 2.5) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <section>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {books.map((book, index) => {
            const avgRating = calculateAverageRating(book.ratings);
            const ratingCount = book.ratings
              ? Object.keys(book.ratings).length
              : 0;

            return (
              <CarouselItem
                key={book.slug}
                className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4 pt-8 pb-12"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative h-full"
                >
                  <Card className="relative h-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg rounded-xl overflow-hidden transition-all duration-500 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-accentTheme/5 to-primaryTheme/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <a href={`libros/${book.slug}`} className="block h-full">
                      <CardContent className="relative flex flex-col h-full p-0 overflow-hidden">
                        {/* Header with Week Badge */}
                        <div className="relative p-6 pb-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-accentTheme to-primaryTheme text-white rounded-full text-xs font-semibold shadow-md">
                              <Calendar className="w-3 h-3" />
                              Lectura {book.week}
                            </div>
                          </div>

                          {/* Book Image */}
                          <div className="relative mb-6 mx-auto w-fit">
                            <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-500 ease-out group-hover:scale-105">
                              <img
                                src={book.bookImage}
                                alt={book.title}
                                className="w-40 h-56 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 px-4 pb-2">
                          <div className="text-center mb-4">
                            <h3 className="text-lg font-bold text-primaryTheme mb-2 group-hover:text-accentTheme transition-colors duration-300 line-clamp-2">
                              {book.title}
                            </h3>

                            <div className="flex items-center justify-center gap-1 text-gray-600 text-sm mb-3">
                              <User className="w-3 h-3" />
                              <span className="line-clamp-1">
                                {book.author}
                              </span>
                            </div>

                            <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-3">
                              <BookOpen className="w-3 h-3" />
                              <span>{book.pubyear}</span>
                            </div>
                          </div>

                          {/* Rating */}
                          {avgRating > 0 && (
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <div className="flex items-center gap-1">
                                <Star
                                  className={`w-4 h-4 fill-current ${getRatingColor(avgRating)}`}
                                />
                                <span
                                  className={`text-sm font-semibold ${getRatingColor(avgRating)}`}
                                >
                                  {avgRating.toFixed(1)}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                ({ratingCount}{" "}
                                {ratingCount === 1 ? "reseña" : "reseñas"})
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </a>
                  </Card>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex bg-white/90 backdrop-blur-sm text-primaryTheme border border-gray-300 shadow-lg hover:bg-primaryTheme hover:text-white transition-all duration-300 -left-6" />
        <CarouselNext className="hidden md:flex bg-white/90 backdrop-blur-sm text-primaryTheme border border-gray-300 shadow-lg hover:bg-primaryTheme hover:text-white transition-all duration-300 -right-6" />
      </Carousel>
      <div className="flex py-8 text-center mx-auto justify-center">
        {books.map((_, index) => (
          <span
            key={index}
            className={`block w-3 h-3 rounded-full mx-1 cursor-pointer ${
              index === current - 1
                ? "bg-primaryTheme"
                : "rounded-full border-gray-300 w-3 h-3 border"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default BooksCarousel;
