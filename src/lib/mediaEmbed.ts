export type EmbedKind = 'youtube' | 'drive' | 'vimeo' | 'image' | 'video-file' | 'external'

export interface ResolvedEmbed {
  kind: EmbedKind
  embedUrl?: string
  sourceUrl: string
}

function driveFileId(url: string): string | null {
  const fileMatch = url.match(/\/file\/d\/([^/]+)/i)
  if (fileMatch?.[1]) return fileMatch[1]
  const openMatch = url.match(/[?&]id=([^&]+)/i)
  return openMatch?.[1] ?? null
}

export function youtubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?[^#]*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/live\/([A-Za-z0-9_-]{6,})/i,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

function vimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  return match?.[1] ?? null
}

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i
const VIDEO_EXT = /\.(mp4|webm|ogg|mov)(\?.*)?$/i

export function resolveMediaEmbed(url: string, preferredType?: 'image' | 'video'): ResolvedEmbed {
  const sourceUrl = url.trim()
  if (!sourceUrl) return { kind: 'external', sourceUrl }

  const yt = youtubeId(sourceUrl)
  if (yt) {
    return {
      kind: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${yt}?rel=0`,
      sourceUrl,
    }
  }

  const vim = vimeoId(sourceUrl)
  if (vim) {
    return {
      kind: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vim}`,
      sourceUrl,
    }
  }

  const driveId = driveFileId(sourceUrl)
  if (driveId) {
    return {
      kind: 'drive',
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      sourceUrl,
    }
  }

  if (preferredType === 'image' || IMAGE_EXT.test(sourceUrl)) {
    return { kind: 'image', embedUrl: sourceUrl, sourceUrl }
  }

  if (preferredType === 'video' || VIDEO_EXT.test(sourceUrl)) {
    return { kind: 'video-file', embedUrl: sourceUrl, sourceUrl }
  }

  // Unknown URL marked as video → try iframe; image → treat as image
  if (preferredType === 'video') {
    return { kind: 'external', embedUrl: sourceUrl, sourceUrl }
  }

  return { kind: 'image', embedUrl: sourceUrl, sourceUrl }
}
