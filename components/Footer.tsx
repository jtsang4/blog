import * as React from 'react'
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import { IoSunnyOutline, IoMoonSharp } from 'react-icons/io5'
import * as config from 'lib/config'

import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export const Footer: React.FC<{
  isDarkMode: boolean
  toggleDarkMode: () => void
}> = ({ isDarkMode, toggleDarkMode }) => {
  const [hasMounted, setHasMounted] = React.useState(false)
  const toggleDarkModeCb = React.useCallback(
    (e) => {
      e.preventDefault()
      toggleDarkMode()
    },
    [toggleDarkMode]
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.footnote}>
        <div>Copyright 2022 {config.author}</div>
        <span className={styles.delimiter}>|</span>
        <a className={styles.rss} title='RSS' href={config.rss} target='_blank'>
          <svg
            viewBox='0 0 1024 1024'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            width='10'
            height='10'
          >
            <path d='M139.072 974.336a96.448 96.448 0 1 0 0-192.832 96.448 96.448 0 0 0 0 192.832zM926.08 971.264a45.824 45.824 0 0 1-46.592-46.72c0-433.92-353.088-788.544-788.608-788.544a45.824 45.824 0 0 1-46.72-46.72c0-26.368 20.288-46.592 46.72-46.592 486.848 0 881.92 396.608 881.92 881.92 0 26.432-20.224 46.656-46.72 46.656z'></path>
            <path d='M601.024 972.8a45.824 45.824 0 0 1-46.656-46.72c0-255.04-208.384-463.488-463.488-463.488A45.824 45.824 0 0 1 44.16 416c0-26.432 20.288-46.656 46.72-46.656 307.968 0 556.8 250.432 556.8 556.8 0 24.96-21.76 46.72-46.656 46.72z'></path>
          </svg>
          <span className={styles.rssTitle}>RSS</span>
        </a>
      </div>

      {hasMounted ? (
        <div className={styles.settings}>
          <a
            className={styles.toggleDarkMode}
            onClick={toggleDarkModeCb}
            title='Toggle dark mode'
          >
            {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
          </a>
        </div>
      ) : null}

      <div className={styles.social}>
        {config.twitter && (
          <a
            className={styles.twitter}
            href={`https://twitter.com/${config.twitter}`}
            title={`Twitter @${config.twitter}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaTwitter />
          </a>
        )}

        {config.github && (
          <a
            className={styles.github}
            href={`https://github.com/${config.github}`}
            title={`GitHub @${config.github}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaGithub />
          </a>
        )}

        {config.linkedin && (
          <a
            className={styles.linkedin}
            href={`https://www.linkedin.com/in/${config.linkedin}`}
            title={`LinkedIn ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaLinkedin />
          </a>
        )}
      </div>
    </footer>
  )
}
