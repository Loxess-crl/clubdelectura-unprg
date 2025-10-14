export interface Book {
  author: string;
  slug: string;
  bookImage?: string;
  category: string;
  description: string;
  pubyear: string;
  title: string;
  week: string; // semana de lectura
  createdAt: number;
  comments?: Comment[];

  // 📥 Recursos descargables
  downloads?: {
    type: "pdf" | "epub" | "mobi" | "audiobook" | string;
    url: string;
  }[];

  // 🐾 Calificaciones por usuario (1 a 5 patitas)
  ratings?: {
    [userId: string]: number;
  };
}
