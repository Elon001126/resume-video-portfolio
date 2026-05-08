import type { Session } from '@supabase/supabase-js'
import { fallbackVideos } from '../data/fallback'
import type { Video, VideoFormState, VideoMetrics } from '../types'
import { isSupabaseConfigured, supabase, videoBucket } from './supabase'

interface VideoRow {
  id: string
  title_zh: string | null
  title_en: string | null
  description_zh: string | null
  description_en: string | null
  video_path: string | null
  poster_path: string | null
  metrics: unknown
  published: boolean | null
  sort_order: number | null
  created_at: string | null
  updated_at: string | null
}

const emptyMetrics: VideoMetrics = {
  views: '',
  likes: '',
  comments: '',
  shares: '',
  completionRate: '',
  engagementRate: '',
  conversionNote: '',
}

function valueFromRecord(record: Record<string, unknown>, key: keyof VideoMetrics) {
  const value = record[key]
  return typeof value === 'string' ? value : ''
}

function normalizeMetrics(metrics: unknown): VideoMetrics {
  if (!metrics || typeof metrics !== 'object' || Array.isArray(metrics)) {
    return emptyMetrics
  }

  const record = metrics as Record<string, unknown>
  return {
    views: valueFromRecord(record, 'views'),
    likes: valueFromRecord(record, 'likes'),
    comments: valueFromRecord(record, 'comments'),
    shares: valueFromRecord(record, 'shares'),
    completionRate: valueFromRecord(record, 'completionRate'),
    engagementRate: valueFromRecord(record, 'engagementRate'),
    conversionNote: valueFromRecord(record, 'conversionNote'),
  }
}

function publicUrl(path: string | null) {
  if (!path || !supabase) {
    return null
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return supabase.storage.from(videoBucket).getPublicUrl(path).data.publicUrl
}

function mapVideo(row: VideoRow): Video {
  return {
    id: row.id,
    title: {
      zh: row.title_zh || '未命名视频',
      en: row.title_en || row.title_zh || 'Untitled video',
    },
    description: {
      zh: row.description_zh || '',
      en: row.description_en || row.description_zh || '',
    },
    videoPath: row.video_path,
    videoUrl: publicUrl(row.video_path),
    posterPath: row.poster_path,
    posterUrl: publicUrl(row.poster_path),
    metrics: normalizeMetrics(row.metrics),
    published: Boolean(row.published),
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || '',
  }
}

function requireClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  return supabase
}

export async function fetchPublicVideos(): Promise<Video[]> {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackVideos
  }

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.warn(error.message)
    return fallbackVideos
  }

  const videos = (data as VideoRow[] | null)?.map(mapVideo) ?? []
  return videos.length > 0 ? videos : []
}

export async function fetchAdminVideos(): Promise<Video[]> {
  const client = requireClient()
  const { data, error } = await client
    .from('videos')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data as VideoRow[] | null)?.map(mapVideo) ?? []
}

export async function signInAdmin(email: string, password: string) {
  const client = requireClient()
  const { data, error } = await client.auth.signInWithPassword({ email, password })

  if (error) {
    throw error
  }

  return data.session
}

export async function signOutAdmin() {
  const client = requireClient()
  await client.auth.signOut()
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) {
    return null
  }

  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function isAdminEmail(email: string | undefined): Promise<boolean> {
  if (!email || !supabase) {
    return false
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    throw error
  }

  return Boolean(data)
}

export async function uploadAsset(file: File, folder: 'videos' | 'posters') {
  const client = requireClient()
  const extension = file.name.split('.').pop() || (folder === 'videos' ? 'mp4' : 'jpg')
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { error } = await client.storage.from(videoBucket).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type || undefined,
    upsert: false,
  })

  if (error) {
    throw error
  }

  return path
}

export async function saveVideo(form: VideoFormState) {
  const client = requireClient()
  const payload = {
    title_zh: form.titleZh,
    title_en: form.titleEn,
    description_zh: form.descriptionZh,
    description_en: form.descriptionEn,
    video_path: form.videoPath,
    poster_path: form.posterPath,
    metrics: {
      views: form.views,
      likes: form.likes,
      comments: form.comments,
      shares: form.shares,
      completionRate: form.completionRate,
      engagementRate: form.engagementRate,
      conversionNote: form.conversionNote,
    },
    published: form.published,
    sort_order: form.sortOrder,
  }

  const request = form.id
    ? client.from('videos').update(payload).eq('id', form.id)
    : client.from('videos').insert(payload)

  const { error } = await request

  if (error) {
    throw error
  }
}

export async function deleteVideo(video: Video) {
  const client = requireClient()
  const storagePaths = [video.videoPath, video.posterPath].filter((path): path is string => Boolean(path))

  if (storagePaths.length > 0) {
    const { error: storageError } = await client.storage.from(videoBucket).remove(storagePaths)
    if (storageError) {
      throw storageError
    }
  }

  const { error } = await client.from('videos').delete().eq('id', video.id)

  if (error) {
    throw error
  }
}
