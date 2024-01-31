import type { ArtalkConfig } from "artalk"
import type Artalk from "artalk"

export type SocialObjects = {
  name: SocialMedia
  href: string
  active: boolean
  linkTitle: string
}[]

export type SocialIcons = {
  [social in SocialMedia]: string
}

export type SocialMedia =
  | "Github"
  | "Facebook"
  | "Instagram"
  | "LinkedIn"
  | "Mail"
  | "Twitter"
  | "Twitch"
  | "YouTube"
  | "WhatsApp"
  | "Snapchat"
  | "Pinterest"
  | "TikTok"
  | "CodePen"
  | "Discord"
  | "GitLab"
  | "Reddit"
  | "Skype"
  | "Steam"
  | "Telegram"
  | "TelegramChannel"
  | "Mastodon"

// interface Global variables
declare global {
  interface Window {
    artalk: Artalk
    getArtalkSingleton: Promise<(config: Partial<ArtalkConfig>) => Artalk>
  }
}
