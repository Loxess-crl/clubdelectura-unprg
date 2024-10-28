import type { CollectionEntry } from "astro:content";
import { Image } from "astro:assets";
import { motion } from "framer-motion";
import qr_group from "@assets/images/qr_group.jpg";
import BookBentoCard from "./ui/BookBentoCard.astro";
import { links } from "@/data/constants";

const ClubInfoBentoGrid = ({ book }: { book: CollectionEntry<"books"> }) => {
  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-[#f6f1ea] p-6">
      <div className="grid min-h-screen w-full gap-4 sm:gap-6 p-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid-rows-[repeat(6,1fr)] sm:grid-rows-4 md:grid-rows-3 shadow-lg bg-[#f6f1ea] rounded-3xl overflow-hidden">
        {/* Libro de la Semana */}
        <motion.div
          className="col-span-2 row-span-1 sm:row-span-2 bg-white rounded-2xl shadow-lg p-6 flex flex-col"
          whileHover={{ scale: 1.03, rotate: [0, 2, -2, 0] }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-2xl text-[#4686c8] font-bold mb-4">
            Libro de la Semana
          </p>
          <div className="flex items-center">
            <Image
              src={book.data.bookImage}
              alt="El coco - Stephen King"
              class="w-32 h-48 object-cover rounded-lg shadow-lg"
            />
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-[#ea9a12]">
                {book.data.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {book.data.description}
              </p>
              <p className="text-sm text-gray-400 mt-4">
                Autor: {book.data.authors[0]}
              </p>
              <p className="text-sm text-gray-400">
                Publicado en {book.data.pubyear}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Próxima reunión */}
        <motion.div
          className="col-span-2 sm:col-span-1 row-span-1 bg-[#75b3a6] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-white"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <lord-icon
            src="https://cdn.lordicon.com/warimioc.json"
            trigger="hover"
            className="w-12 h-12 mb-2"
          />
          <div className="text-lg font-semibold">Próxima reunión</div>
          <div className="text-base">Viernes, 12:30 p.m.</div>
        </motion.div>

        {/* Frase del día */}
        <motion.div
          className="col-span-2 row-span-1 bg-white rounded-2xl shadow-lg p-6 flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-lg font-semibold text-gray-700">"phrase"</p>
            <p className="text-sm text-gray-500 mt-2">- author</p>
          </div>
        </motion.div>

        {/* Únete al club */}
        <motion.div
          className="col-span-2 sm:col-span-1 row-span-1 bg-[#4686c8] text-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <a
            href={links.whatsapp}
            target="_blank"
            className="flex flex-col justify-center items-center"
          >
            <p className="text-xl font-bold mb-4">Únete al club</p>
            <Image
              src={qr_group}
              alt="QR para unirse al grupo de WhatsApp"
              class="w-24 h-24 rounded-lg"
            />
          </a>
        </motion.div>

        {/* Últimos libros */}
        <motion.div
          className="col-span-2 row-span-2 md:row-span-3 bg-[#ea9a12] rounded-2xl shadow-lg p-6 text-white"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <lord-icon
              src="https://cdn.lordicon.com/jectmwqf.json"
              trigger="hover"
              colors="primary:#ffffff,secondary:#ffffff"
              className="w-8 h-8"
            />
            <p className="text-2xl font-semibold">Últimos libros</p>
          </div>
          {/* Aquí puedes agregar los libros recientes */}
        </motion.div>

        {/* Cita del día */}
        <motion.div
          className="col-span-2 sm:col-span-3 row-span-1 sm:row-span-2 bg-[#75b3a6] text-white rounded-2xl shadow-lg p-6 flex items-center justify-center text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl font-semibold">
            "Nunca dejes de leer, porque un libro es una puerta a mil mundos."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ClubInfoBentoGrid;
