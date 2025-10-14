import { database, storage } from "@/firebase/client";
import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  query,
  orderByChild,
  limitToLast,
  startAfter,
  limitToFirst,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import type { Book } from "@/interfaces/book.interface";

const BASE_PATH = "books";
const STORAGE_PATH = "book-covers";
const STORAGE_DOWNLOADS_PATH = "book-downloads";

export const createBook = async (data: Book) => {
  const bookRef = ref(database, `${BASE_PATH}/${data.slug}`);
  await set(bookRef, {
    ...data,
    createdAt: data.createdAt || Date.now(),
  });
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
  const q = query(booksRef, orderByChild("createdAt"));
  const snapshot = await get(q);

  if (!snapshot.exists()) return {};

  const books = snapshot.val() as Record<string, Book>;
  // Convertir a array, ordenar por createdAt descendente, y volver a objeto
  const sortedEntries = Object.entries(books).sort(
    ([, a], [, b]) => (b.createdAt || 0) - (a.createdAt || 0)
  );

  return Object.fromEntries(sortedEntries);
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

/**
 * Uploads a book cover image to Firebase Storage
 * @param file - The image file to upload
 * @param bookSlug - The book slug to use as filename
 * @returns The download URL of the uploaded image
 */
export const uploadBookCover = async (
  file: File,
  bookSlug: string
): Promise<string> => {
  // Generate a unique filename with timestamp to avoid collisions
  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const fileName = `${bookSlug}-${timestamp}.${fileExtension}`;

  // Create storage reference
  const imageRef = storageRef(storage, `${STORAGE_PATH}/${fileName}`);

  // Upload file
  const snapshot = await uploadBytes(imageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

/**
 * Deletes a book cover image from Firebase Storage
 * @param imageUrl - The full URL of the image to delete
 */
export const deleteBookCover = async (imageUrl: string): Promise<void> => {
  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const path = decodeURIComponent(
      url.pathname.split("/o/")[1]?.split("?")[0] || ""
    );

    if (path && path.startsWith(STORAGE_PATH)) {
      const imageRef = storageRef(storage, path);
      await deleteObject(imageRef);
    }
  } catch (error) {
    console.error("Error deleting book cover:", error);
    // Don't throw error if image doesn't exist or can't be deleted
  }
};

/**
 * Uploads a book download resource to Firebase Storage
 * @param file - The file to upload
 * @param bookSlug - The book slug to use as filename
 * @returns The download URL of the uploaded file
 */
export const uploadBookResource = async (
  file: File,
  bookSlug: string
): Promise<string> => {
  // Generate a unique filename with timestamp to avoid collisions
  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const fileName = `${bookSlug}-${timestamp}.${fileExtension}`;

  // Create storage reference
  const fileRef = storageRef(storage, `${STORAGE_DOWNLOADS_PATH}/${fileName}`);

  // Upload file
  const snapshot = await uploadBytes(fileRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

/**
 * Deletes a book download resource from Firebase Storage
 * @param resourceUrl - The full URL of the resource to delete
 */
export const deleteBookResource = async (
  resourceUrl: string
): Promise<void> => {
  try {
    // Extract path from URL
    const url = new URL(resourceUrl);
    const path = decodeURIComponent(
      url.pathname.split("/o/")[1]?.split("?")[0] || ""
    );

    if (path && path.startsWith(STORAGE_DOWNLOADS_PATH)) {
      const fileRef = storageRef(storage, path);
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.error("Error deleting book resource:", error);
    // Don't throw error if file doesn't exist or can't be deleted
  }
};
