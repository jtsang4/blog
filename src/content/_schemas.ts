import type { SchemaContext } from "astro:content"
import { z } from "astro/zod"

export const blogSchema = ({ image }: SchemaContext) =>
  z
    .object({
      author: z.string().optional(),
      pubDatetime: z.date(),
      title: z.string(),
      postSlug: z.string().optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: z.string().optional(),
      cover: image().optional(),
      description: z.string(),
    })
    .strict()

export type BlogFrontmatter = z.infer<ReturnType<typeof blogSchema>>
