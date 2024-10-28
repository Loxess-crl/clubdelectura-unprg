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

const BooksCarousel = ({ books }: { books: CollectionEntry<"books">[] }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {books.map((book) => (
          <CarouselItem key={book.id} className="pl-2 md:pl-4 md:basis-1/3">
            <div className="p-1">
              <Card>
                <a href={"libros/" + book.slug}>
                  <CardContent className="flex flex-col items-center p-6 hover:scale-105 transition-transform duration-300">
                    <p className="text-sm text-muted-foreground text-center mb-2">
                      Semana {book.data.week}
                    </p>
                    <img
                      src={book.data.bookImage.src}
                      alt={book.data.title}
                      className="w-1/2 object-contain"
                    />
                    <h3 className="text-lg font-semibold text-center mb-1">
                      {book.data.title}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-1">
                      {book.data.authors}
                    </p>
                  </CardContent>
                </a>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default BooksCarousel;
