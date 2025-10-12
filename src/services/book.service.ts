import { database } from "@/firebase/client";
import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  child,
  query,
  orderByChild,
  limitToLast,
  startAfter,
  limitToFirst,
} from "firebase/database";
import type { Book } from "@/interfaces/book.interface";

const BASE_PATH = "books";

export const createBook = async (data: Book) => {
  const bookRef = ref(database, `${BASE_PATH}/${data.slug}`);
  await set(bookRef, { ...data, createdAt: new Date().getTime() });
};

export const fetchBookById = async (slug: string): Promise<Book | null> => {
  const bookRef = ref(database, `${BASE_PATH}/${slug}`);
  const snapshot = await get(bookRef);
  return snapshot.exists() ? (snapshot.val() as Book) : null;
};

export const updateBook = async (
  slug: string,
  data: Partial<Book>
): Promise<void> => {
  const bookRef = ref(database, `${BASE_PATH}/${slug}`);
  await update(bookRef, data);
};

export const deleteBook = async (slug: string): Promise<void> => {
  const bookRef = ref(database, `${BASE_PATH}/${slug}`);
  await remove(bookRef);
};

export const fetchAllBooks = async (): Promise<Record<string, Book>> => {
  const booksRef = ref(database, BASE_PATH);
  const snapshot = await get(booksRef);
  return snapshot.exists() ? (snapshot.val() as Record<string, Book>) : {};
};

export const fetchLatestBooks = async (
  count: number
): Promise<Record<string, Book>> => {
  const booksRef = ref(database, BASE_PATH);
  const q = query(booksRef, orderByChild("createdAt"), limitToLast(count));
  const snapshot = await get(q);

  return snapshot.exists() ? (snapshot.val() as Record<string, Book>) : {};
};

export const rateBook = async (
  slug: string,
  userId: string,
  rating: number
): Promise<void> => {
  if (rating < 1 || rating > 5) throw new Error("Rating inválido");
  const ratingRef = ref(database, `${BASE_PATH}/${slug}/ratings/${userId}`);
  await set(ratingRef, rating);
};

export const getBookRatingStats = async (slug: string) => {
  const ratingsRef = ref(database, `${BASE_PATH}/${slug}/ratings`);
  const snapshot = await get(ratingsRef);
  if (!snapshot.exists()) return { votes: 0, total: 0, average: 0 };

  const ratings = snapshot.val() as Record<string, number>;
  const values = Object.values(ratings);
  const total = values.reduce((a, b) => a + b, 0);
  const votes = values.length;
  const average = votes ? total / votes : 0;

  return { votes, total, average };
};

interface DownloadResource {
  type: string;
  url: string;
}

export const addDownloadToBook = async (
  slug: string,
  resource: DownloadResource
): Promise<void> => {
  const downloadsRef = ref(database, `${BASE_PATH}/${slug}/downloads`);
  const newRef = push(downloadsRef);
  await set(newRef, resource);
};

export const deleteDownloadFromBook = async (
  slug: string,
  resourceId: string
): Promise<void> => {
  const resourceRef = ref(
    database,
    `${BASE_PATH}/${slug}/downloads/${resourceId}`
  );
  await remove(resourceRef);
};

export async function getBooksPage(lastCreatedAt?: number, page_size = 10) {
  const booksRef = ref(database, "books");

  const booksQuery = lastCreatedAt
    ? query(
        booksRef,
        orderByChild("createdAt"),
        startAfter(lastCreatedAt),
        limitToFirst(page_size)
      )
    : query(booksRef, orderByChild("createdAt"), limitToFirst(page_size));

  const snapshot = await get(booksQuery);
  const books = snapshot.val() as Record<string, Book> | null;

  return books
    ? Object.entries(books).map(([id, data]) => ({ id, ...data }))
    : [];
}
