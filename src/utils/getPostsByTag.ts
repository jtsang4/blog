import type { CollectionEntry } from "astro:content"
import { slugifyAll } from "./slugify"

const getPostsByTag = <T extends CollectionEntry<"blog">>(
  posts: T[],
  tag: string
) => posts.filter(post => slugifyAll(post.data.tags).includes(tag))

export default getPostsByTag
