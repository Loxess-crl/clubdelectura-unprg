import { defineCollection, z } from "astro:content";

const bookCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      authors: z.array(z.string()),
      pubyear: z.number(),
      bookImage: image(),
      week: z.number(),
      category: z.string(),
      ratings: z
        .object({
          average: z.number().default(0),
          votes: z.record(z.string(), z.number()).optional(),
        })
        .optional(),
    }),
});

export const collections = {
  books: bookCollection,
};
