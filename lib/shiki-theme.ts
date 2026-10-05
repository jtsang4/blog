// Code colouring drawn from the site palette — ink, paper, one vermilion and
// a few muted pigments. Every foreground clears WCAG AA (4.5:1) on its panel.
import type { ThemeRegistration } from "shiki"

type Palette = {
  bg: string
  fg: string
  comment: string
  keyword: string
  string: string
  number: string
  func: string
  type: string
  punct: string
}

const theme = (name: string, type: "light" | "dark", p: Palette) =>
  ({
    name,
    type,
    colors: { "editor.background": p.bg, "editor.foreground": p.fg },
    tokenColors: [
      { settings: { foreground: p.fg } },
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: p.comment, fontStyle: "italic" },
      },
      {
        scope: [
          "keyword",
          "storage",
          "storage.type",
          "keyword.control",
          "keyword.operator.new",
          "variable.language",
        ],
        settings: { foreground: p.keyword },
      },
      {
        scope: ["string", "string.quoted", "markup.inline.raw"],
        settings: { foreground: p.string },
      },
      {
        scope: [
          "constant.numeric",
          "constant.language",
          "constant.character",
          "support.constant",
          "variable.other.constant",
        ],
        settings: { foreground: p.number },
      },
      {
        scope: [
          "entity.name.function",
          "support.function",
          "meta.function-call",
          "entity.name.command",
        ],
        settings: { foreground: p.func },
      },
      {
        scope: [
          "entity.name.type",
          "entity.name.class",
          "support.type",
          "support.class",
          "entity.name.tag",
          "entity.other.attribute-name",
        ],
        settings: { foreground: p.type },
      },
      {
        scope: ["punctuation", "keyword.operator", "meta.brace"],
        settings: { foreground: p.punct },
      },
      { scope: ["markup.heading"], settings: { foreground: p.keyword } },
      { scope: ["markup.bold"], settings: { fontStyle: "bold" } },
      { scope: ["markup.italic"], settings: { fontStyle: "italic" } },
      { scope: ["markup.inserted"], settings: { foreground: p.string } },
      { scope: ["markup.deleted"], settings: { foreground: p.keyword } },
    ],
  }) satisfies ThemeRegistration

export const inkTheme = theme("marginalia-ink", "light", {
  bg: "#f6f4ef",
  fg: "#1f1d1a",
  comment: "#6b665c",
  keyword: "#b02f17",
  string: "#3c6633",
  number: "#8a4a06",
  func: "#1f4f86",
  type: "#6a3b88",
  punct: "#5a554c",
})

export const lampTheme = theme("marginalia-lamp", "dark", {
  bg: "#1c1b18",
  fg: "#e6e1d6",
  comment: "#958f84",
  keyword: "#f47a5c",
  string: "#a8c489",
  number: "#e2b46b",
  func: "#8fb6e6",
  type: "#c7a6e2",
  punct: "#b3ada1",
})
