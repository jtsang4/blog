import { getImage } from "astro:assets"
import { type CollectionEntry, getCollection } from "astro:content"
import getSortedPosts from "./getSortedPosts"
import slugify, { slugifyStr } from "./slugify"

const HAN = /\p{Script=Han}/gu
const WORD = /[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g

// Chinese reads at roughly 400 characters a minute, English at 230 words.
export const readingStats = (markdown: string) => {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^import .*$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
  const han = text.match(HAN)?.length ?? 0
  const words = text.replace(HAN, " ").match(WORD)?.length ?? 0
  return {
    words: han + words,
    minutes: Math.max(1, Math.round(han / 400 + words / 230)),
  }
}

export const postLang = (data: { title: string; description: string }) =>
  /\p{Script=Han}/u.test(data.title + data.description) ? "zh-CN" : "en"

export type Post = CollectionEntry<"blog"> & {
  slug: string
  href: string
  number: number
  year: number
  lang: string
  words: number
  minutes: number
}

export const getPosts = async (): Promise<Post[]> => {
  const posts = getSortedPosts(await getCollection("blog"))
  return posts.map((post, index) => ({
    ...post,
    slug: slugify(post.data),
    href: `/posts/${slugify(post.data)}/`,
    number: posts.length - index,
    year: post.data.pubDatetime.getUTCFullYear(),
    lang: postLang(post.data),
    ...readingStats(post.body ?? ""),
  }))
}

// Small, colour-intact rendition used by the floating index preview.
export const previewSrc = async (post: CollectionEntry<"blog">) =>
  post.data.cover
    ? (await getImage({ src: post.data.cover, width: 560, format: "webp" })).src
    : post.data.ogImage

export type Topic = { slug: string; name: string; count: number }

export const getTopics = (posts: Post[]): Topic[] => {
  const topics = new Map<string, Topic>()
  for (const tag of posts.flatMap(post => post.data.tags)) {
    const slug = slugifyStr(tag)
    const topic = topics.get(slug) ?? { slug, name: tag, count: 0 }
    topic.count++
    topics.set(slug, topic)
  }
  return [...topics.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  )
}
