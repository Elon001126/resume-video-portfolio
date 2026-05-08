export type Locale = 'zh' | 'en'

export type LocalizedText = Record<Locale, string>

export interface VideoMetrics {
  views: string
  likes: string
  comments: string
  shares: string
  completionRate: string
  engagementRate: string
  conversionNote: string
}

export interface Video {
  id: string
  title: LocalizedText
  description: LocalizedText
  videoPath: string | null
  videoUrl: string | null
  posterPath: string | null
  posterUrl: string | null
  metrics: VideoMetrics
  published: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ResumeSection {
  id: string
  eyebrow: LocalizedText
  title: LocalizedText
  body: LocalizedText
  points: LocalizedText[]
}

export interface VideoFormState {
  id?: string
  titleZh: string
  titleEn: string
  descriptionZh: string
  descriptionEn: string
  videoPath: string | null
  posterPath: string | null
  views: string
  likes: string
  comments: string
  shares: string
  completionRate: string
  engagementRate: string
  conversionNote: string
  published: boolean
  sortOrder: number
}
