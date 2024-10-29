import type { CollectionEntry } from "astro:content";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/shadcn/Carousel";
import { Card, CardContent } from "./ui/shadcn/Card";
import { motion } from "framer-motion";

const BooksCarousel = ({ books }: { books: CollectionEntry<"books">[] }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {books.map((book, index) => (
          <CarouselItem
            key={book.id}
            className="pl-2 md:pl-4 md:basis-1/3 pt-8 pb-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative h-full"
            >
              <Card className="relative h-full bg-white border border-gray-200 shadow-lg rounded-lg transition-transform hover:scale-105 duration-300">
                <a href={`libros/${book.slug}`}>
                  <CardContent className="relative flex flex-col items-center p-6 overflow-hidden group">
                    {/* Badge */}
                    <div className="relative z-10 px-3 py-1 bg-accentTheme text-white rounded-full mb-4 text-xs font-semibold">
                      Semana {book.data.week}
                    </div>

                    {/* Imagen del libro */}
                    <div className="relative mb-6 transition-transform duration-500 ease-out group-hover:scale-105">
                      <img
                        src={book.data.bookImage.src}
                        alt={book.data.title}
                        className="w-44 h-60 object-cover rounded-md shadow-md"
                      />
                    </div>

                    {/* Información del libro */}
                    <div className="relative z-10 text-center">
                      <h3 className="text-lg font-semibold text-primaryTheme mb-2 group-hover:text-accentTheme transition-colors duration-300">
                        {book.data.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {book.data.authors}
                      </p>
                    </div>
                  </CardContent>
                </a>
              </Card>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex bg-white text-primaryTheme border border-gray-300 shadow-lg hover:bg-primaryTheme hover:text-white transition-all duration-300" />
      <CarouselNext className="hidden md:flex bg-white text-primaryTheme border border-gray-300 shadow-lg hover:bg-primaryTheme hover:text-white transition-all duration-300" />
    </Carousel>
  );
};

export default BooksCarousel;
