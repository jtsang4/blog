// Pure helpers, safe to import from hydrated components.
export const formatNumber = (n: number) => String(n).padStart(3, "0")

export const formatDate = (date: Date, style: "short" | "long" = "long") => {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return style === "short" ? `${y}.${m}` : `${y}.${m}.${d}`
}
