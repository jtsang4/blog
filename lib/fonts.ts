// Builds site-specific font subsets at dev/build time.
//
// Fontsource ships each family as unicode-range slices. Served as-is, one
// Chinese article pulls 1–2 MB of CJK glyphs and the Latin faces carry every
// optical size. Instead we scan the sources for the characters that actually
// appear, cut each slice down to those, pin variation axes we never animate,
// and emit @font-face rules for the result.
import { createHash } from "node:crypto"
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import type { AstroIntegration } from "astro"
import subsetFont from "subset-font"

type Axes = Record<
  string,
  number | { min: number; max: number; default: number }
>

type Face = {
  family: string
  pkg: string
  // Fontsource file name for a slice key, e.g. "latin" or "[12]" → "12"
  file: (key: string) => string
  chars: (sets: CharSets) => Set<string>
  style?: "normal" | "italic"
  weight: string
  axes?: Axes
}

type CharSets = { all: Set<string>; display: Set<string> }

const HAN = /[\p{Script=Han}　-〿＀-￯]/u
// Typographic punctuation shared with Latin. Chinese text takes these from
// the CJK face (full-width), via a family listed first in Chinese stacks.
const PUNCT = new Set("‘’“”—…")
const ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i))
const SOURCE_EXT = /\.(md|mdx|astro|tsx?)$/
const DISPLAY_LINE = /^(title:.*|#{1,6} .*)$/gm

const cjk = (set: Set<string>) =>
  new Set([...set].filter(c => HAN.test(c) && !PUNCT.has(c)))
const latin = (set: Set<string>) =>
  new Set([...ASCII, ...[...set].filter(c => !HAN.test(c))])

const noto = (key: string) =>
  `noto-serif-sc-${key.replace(/[[\]]/g, "")}-wght-normal.woff2`

const FACES: Face[] = [
  {
    family: "Newsreader Site",
    pkg: "@fontsource-variable/newsreader",
    file: key => `newsreader-${key}-opsz-normal.woff2`,
    chars: sets => latin(sets.all),
    weight: "300 700",
    axes: { wght: { min: 300, max: 700, default: 400 } },
  },
  {
    // Italic only ever appears as display type; one optical size will do
    family: "Newsreader Site",
    pkg: "@fontsource-variable/newsreader",
    file: key => `newsreader-${key}-opsz-italic.woff2`,
    chars: sets => latin(sets.all),
    style: "italic",
    weight: "400",
    axes: { opsz: 48, wght: 400 },
  },
  {
    family: "JetBrains Mono Site",
    pkg: "@fontsource-variable/jetbrains-mono",
    file: key => `jetbrains-mono-${key}-wght-normal.woff2`,
    chars: sets => latin(sets.all),
    weight: "100 800",
  },
  {
    // Titles, headings and interface strings, as one 500 instance: small
    // enough for every page
    family: "Noto Serif SC Display",
    pkg: "@fontsource-variable/noto-serif-sc",
    file: noto,
    chars: sets => cjk(sets.display),
    weight: "500",
    axes: { wght: 500 },
  },
  {
    // Body fallback for systems without a serif CJK face (mostly Windows)
    family: "Noto Serif SC Text",
    pkg: "@fontsource-variable/noto-serif-sc",
    file: noto,
    chars: sets => cjk(sets.all),
    weight: "200 900",
  },
  {
    family: "Noto Serif SC Punct",
    pkg: "@fontsource-variable/noto-serif-sc",
    file: noto,
    chars: () => PUNCT,
    weight: "200 900",
  },
]

const toRange = (codepoints: number[]) => {
  const sorted = [...codepoints].sort((a, b) => a - b)
  const ranges: string[] = []
  let start = sorted[0]
  let prev = start
  for (const cp of [...sorted.slice(1), Number.NaN]) {
    if (cp === prev + 1) {
      prev = cp
      continue
    }
    const hex = (n: number) => n.toString(16)
    ranges.push(
      start === prev ? `U+${hex(start)}` : `U+${hex(start)}-${hex(prev)}`
    )
    start = cp
    prev = cp
  }
  return ranges.join(",")
}

const parseRange = (range: string) =>
  range.split(",").map(part => {
    const [from, to = from] = part.trim().replace("U+", "").split("-")
    return [Number.parseInt(from, 16), Number.parseInt(to, 16)] as const
  })

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (SOURCE_EXT.test(entry.name)) yield full
  }
}

async function collect(srcDir: string): Promise<CharSets> {
  const all = new Set<string>()
  const display = new Set<string>()
  for await (const file of walk(srcDir)) {
    const text = await readFile(file, "utf8")
    for (const char of text) all.add(char)
    // Markdown contributes its titles and headings; components contribute
    // every string, since interface copy is set in the display face
    const shown = /\.mdx?$/.test(file)
      ? (text.match(DISPLAY_LINE) ?? []).join("")
      : text
    for (const char of shown) display.add(char)
  }
  return { all, display }
}

async function buildFace(
  face: Face,
  sets: CharSets,
  root: string,
  outDir: string,
  prefix: string
) {
  const require = createRequire(path.join(root, "package.json"))
  const dir = path.dirname(require.resolve(`${face.pkg}/package.json`))
  const unicode: Record<string, string> = JSON.parse(
    await readFile(path.join(dir, "unicode.json"), "utf8")
  )
  const wanted = [...face.chars(sets)].map(c => c.codePointAt(0) as number)

  const rules: string[] = []
  let bytes = 0
  for (const [key, range] of Object.entries(unicode)) {
    const ranges = parseRange(range)
    const codepoints = wanted.filter(cp =>
      ranges.some(([a, b]) => cp >= a && cp <= b)
    )
    if (codepoints.length === 0) continue

    const font = await subsetFont(
      await readFile(path.join(dir, "files", face.file(key))),
      String.fromCodePoint(...codepoints),
      { targetFormat: "woff2", variationAxes: face.axes }
    )
    const name = `${prefix}-${key.replace(/[[\]]/g, "")}.woff2`
    await writeFile(path.join(outDir, name), font)
    bytes += font.length
    rules.push(
      `@font-face{font-family:"${face.family}";font-style:${face.style ?? "normal"};font-weight:${face.weight};font-display:swap;src:url("./${name}") format("woff2");unicode-range:${toRange(codepoints)}}`
    )
  }
  return { rules, bytes }
}

async function generate(root: string, outDir: string) {
  const sets = await collect(path.join(root, "src"))
  const lock = await readFile(path.join(root, "pnpm-lock.yaml"), "utf8").catch(
    () => ""
  )
  const key = createHash("sha1")
    .update(JSON.stringify(FACES.map(f => [f.family, f.style, f.axes])))
    .update(lock.match(/@fontsource-variable\/[^:\n]+/g)?.join() ?? "")
    .update([...sets.all].sort().join(""))
    .update([...sets.display].sort().join(""))
    .digest("hex")
    .slice(0, 10)

  const manifest = path.join(outDir, "manifest.json")
  const previous = await readFile(manifest, "utf8").catch(() => "")
  if (previous.includes(key)) return { cached: true, bytes: 0 }

  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const css: string[] = []
  let bytes = 0
  for (const [index, face] of FACES.entries()) {
    const result = await buildFace(face, sets, root, outDir, `${key}-${index}`)
    css.push(...result.rules)
    bytes += result.bytes
  }

  await writeFile(
    path.join(outDir, "fonts.css"),
    `/* Generated by lib/fonts.ts — do not edit. */\n${css.join("\n")}\n`
  )
  await writeFile(manifest, JSON.stringify({ key, bytes }))
  return { cached: false, bytes }
}

export function siteFonts({
  outDir = "src/styles/fonts",
} = {}): AstroIntegration {
  return {
    name: "site-fonts",
    hooks: {
      "astro:config:setup": async ({ command, config, logger }) => {
        if (command === "preview") return
        const root = new URL(".", config.root).pathname
        const out = path.join(root, outDir)
        try {
          const result = await generate(root, out)
          logger.info(
            result.cached
              ? "subsets up to date"
              : `subsets written, ${Math.round(result.bytes / 1024)} KB total`
          )
        } catch (error) {
          // Never block the build on fonts; every stack ends in system faces
          logger.warn(`subsetting failed, using system fonts: ${error}`)
          await mkdir(out, { recursive: true })
          await writeFile(path.join(out, "fonts.css"), "")
        }
      },
    },
  }
}
