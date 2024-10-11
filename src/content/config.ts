import { defineCollection, z } from "astro:content";

const bookCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      authors: z.array(z.string()),
      pubyear: z.number(),
      bookImage: image(),
      week: z.number(),
    }),
});

export const collections = {
  books: bookCollection,
};
