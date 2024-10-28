import { database } from "@/firebase/client";
import type { CollectionEntry } from "astro:content";
import { get, query, ref, orderByChild, limitToLast } from "firebase/database";

interface FeaturedBook {
  id: number;
  ratings: {
    average: number;
    votes: Record<string, number>;
  };
}
// Función para obtener los 3 libros mejor calificados
export async function getTopRatedBooks() {
  const booksRef = ref(database, "books");
  const topBooksQuery = query(
    booksRef,
    orderByChild("ratings/average"),
    limitToLast(3)
  );

  const snapshot = await get(topBooksQuery);
  if (snapshot.exists()) {
    const topBooks: FeaturedBook[] = [];
    snapshot.forEach((childSnapshot) => {
      topBooks.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    // Ordenar de mayor a menor (porque limitToLast devuelve en orden ascendente)
    return topBooks.reverse();
  } else {
    console.log("No se encontraron libros.");
    return [];
  }
}

export async function getRatedBooks() {
  const booksRef = ref(database, "books");
  const topBooksQuery = query(booksRef, orderByChild("ratings/average"));

  const snapshot = await get(topBooksQuery);
  if (snapshot.exists()) {
    const topBooks: FeaturedBook[] = [];
    snapshot.forEach((childSnapshot) => {
      topBooks.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    // Ordenar de mayor a menor (porque limitToLast devuelve en orden ascendente)
    return topBooks.reverse();
  } else {
    console.log("No se encontraron libros.");
    return [];
  }
}
