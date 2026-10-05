import Card from "@components/Card"
import Fuse from "fuse.js"
import { useEffect, useMemo, useRef, useState } from "react"

export type SearchItem = {
  title: string
  description: string
  tags: string[]
  href: string
  number: number
  date: string
  lang: string
  cover?: string
}

interface Props {
  searchList: SearchItem[]
  suggestions: string[]
}

export default function SearchBar({ searchList, suggestions }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputVal, setInputVal] = useState("")

  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: [
          { name: "title", weight: 2 },
          { name: "description", weight: 1 },
          { name: "tags", weight: 1.5 },
        ],
        minMatchCharLength: 1,
        ignoreLocation: true,
        threshold: 0.4,
      }),
    [searchList]
  )

  const query = inputVal.trim()
  const results = useMemo(
    () => (query.length > 0 ? fuse.search(query) : []),
    [fuse, query]
  )

  useEffect(() => {
    // Restore a query from the URL and park the caret at its end
    const searchStr = new URLSearchParams(window.location.search).get("q")
    if (searchStr) setInputVal(searchStr)
    const input = inputRef.current
    if (!input) return
    input.focus()
    requestAnimationFrame(() => {
      input.selectionStart = input.selectionEnd = searchStr?.length ?? 0
    })
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (query) url.searchParams.set("q", query)
    else url.searchParams.delete("q")
    history.replaceState(history.state, "", url)
  }, [query])

  return (
    <div className="search">
      <label className="search-field">
        <span className="visually-hidden">Search posts 搜索文章</span>
        <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" />
        </svg>
        <input
          id="search-input"
          className="search-input"
          placeholder="输入关键词…  Type to search"
          type="search"
          name="search"
          value={inputVal}
          onChange={e => setInputVal(e.currentTarget.value)}
          autoComplete="off"
          spellCheck={false}
          ref={inputRef}
        />
        <kbd className="search-kbd caps">⌘K</kbd>
      </label>

      <div className="search-status caps" aria-live="polite">
        {query ? (
          <>
            {String(results.length).padStart(2, "0")}{" "}
            {results.length === 1 ? "result" : "results"} for “{query}”
          </>
        ) : (
          <span className="search-suggest">
            <span>Try 试试</span>
            {suggestions.map(tag => (
              <button
                type="button"
                key={tag}
                className="search-chip"
                onClick={() => setInputVal(tag)}
              >
                {tag}
              </button>
            ))}
          </span>
        )}
      </div>

      {results.length > 0 && (
        <ul className="entries search-results">
          {results.map(({ item }) => (
            <Card
              key={item.href}
              href={item.href}
              title={item.title}
              description={item.description}
              number={item.number}
              date={new Date(item.date)}
              tags={item.tags}
              lang={item.lang}
              cover={item.cover}
            />
          ))}
        </ul>
      )}

      {query && results.length === 0 && (
        <p className="search-empty">
          没有找到相关的文章。
          <span lang="en">Nothing here yet — try another word.</span>
        </p>
      )}
    </div>
  )
}
