import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { SITE } from "@config"
import slugify from "@utils/slugify"

export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: posts
      .sort((prev, next) => {
        const prevDate = new Date(prev.data.pubDatetime)
        const nextDate = new Date(next.data.pubDatetime)
        return nextDate.getTime() - prevDate.getTime()
      })
      .map(({ data }) => ({
        link: `posts/${slugify(data)}`,
        title: data.title,
        description: data.description,
        pubDate: new Date(data.pubDatetime),
      })),
  })
}
