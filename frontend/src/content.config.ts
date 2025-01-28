import { defineCollection, z } from "astro:content";
import { loader } from "norg_astro";

const blog = defineCollection({
  loader: loader("../"),
  schema: z.object({
    metadata: z.object({
      title: z.string(),
      description: z.string(),
      created: z.coerce.date(),
      updated: z.coerce.date(),
    }),
  }),
});

export const collections = { blog };
