import type { CollectionEntry } from "astro:content";
import { useState } from "react";

const Carousel = ({ books }: { books: CollectionEntry<"books">[] }) => {
  const [currentbook, setCurrentbook] = useState(0);

  const handleNext = () => {
    setCurrentbook((prevbook) =>
      prevbook === books.length - 1 ? 0 : prevbook + 1
    );
  };

  const handlePrev = () => {
    setCurrentbook((prevbook) =>
      prevbook === 0 ? books.length - 1 : prevbook - 1
    );
  };

  const getTransformStyle = () => {
    return window.innerWidth >= 1024
      ? `translateX(-${(currentbook % (books.length / 3)) * 100}%)`
      : `translateX(-${currentbook * 100}%)`;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform ease-in-out duration-500"
          style={{ transform: getTransformStyle() }}
        >
          {books.map((book) => (
            <a
              key={book.id}
              className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 flex flex-col items-center"
              href={"/libros/" + book.slug + "/"}
              data-astro-prefetch
            >
              <p className="text-center text-sm py-2 text-gray-700">
                Semana {book.data.week}
              </p>
              <img
                src={book.data.bookImage.src}
                alt={book.data.title}
                className="w-1/2 object-contain"
              />
              <h2 className="text-3xl font-bold mt-4">{book.data.title}</h2>
              <p className="text-center mt-2 text-gray-500">
                {book.data.authors}
              </p>
            </a>
          ))}
        </div>
      </div>
      {(books.length > 3 || window.innerWidth < 1024) && (
        <div className="w-full flex justify-between mt-8">
          <button
            onClick={handlePrev}
            className="absolute left-0 z-10 p-2 bg-gray-800 text-white rounded-full"
          >
            PREV
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 p-2 bg-gray-800 text-white rounded-full"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
