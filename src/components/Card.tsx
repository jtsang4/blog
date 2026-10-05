import { formatDate, formatNumber } from "@utils/format"

export interface Props {
  href: string
  title: string
  description: string
  number: number
  date: Date
  tags: string[]
  lang?: string
  cover?: string
  // Morph target for the article title; must be unique on the page
  transitionName?: string
}

export default function Card({
  href,
  title,
  description,
  number,
  date,
  tags,
  lang,
  cover,
  transitionName,
}: Props) {
  return (
    <li className="entry">
      <a href={href} className="entry-link" data-cover={cover}>
        <span className="entry-no caps">{formatNumber(number)}</span>
        <span className="entry-main">
          <span
            className="entry-title"
            lang={lang}
            style={
              transitionName
                ? { viewTransitionName: transitionName }
                : undefined
            }
          >
            {title}
          </span>
          <span className="entry-desc" lang={lang}>
            {description}
          </span>
        </span>
        <span className="entry-tags caps">{tags.join(" / ")}</span>
        <time className="entry-date caps" dateTime={date.toISOString()}>
          {formatDate(date, "short")}
        </time>
        <span className="entry-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    </li>
  )
}
