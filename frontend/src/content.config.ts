import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

import fs from "node:fs/promises";
import cp from "node:child_process";
import path from "node:path";

await Promise.all(
  (await fs.readdir("../", { recursive: true }))
    .filter((x) => x.endsWith(".norg"))
    .map(async (x) => {
      const dir = `norg_dist/${path.dirname(x)}`;
      await fs.mkdir(dir, { recursive: true });
      await new Promise((resolve, reject) => {
        const outPath =
          `frontend/norg_dist/${x.replaceAll(".norg", "")}.md`.replaceAll(
            " ",
            "\\ ",
          );
        const command = `$NEORG_NVIM/bin/nvim --headless -c "Neorg export to-file ${outPath} markdown" -c "qall" "${x}"`;
        console.log(command);
        cp.exec(
          command,
          {
            cwd: "..",
          },
          (_a, _b, text) => {
            text = text.trim();
            if (text == "Successfully exported 1 file!" || text.length === 0) {
              resolve(undefined);
            } else {
              reject(text);
            }
          },
        );
      });
    }),
);

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "norg_dist", pattern: "**/*.md" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { blog };
