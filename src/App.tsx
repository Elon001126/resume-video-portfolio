import type { Session } from '@supabase/supabase-js'
import { AnimatePresence, motion } from 'motion/react'
import type { ChangeEvent, FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Film,
  Globe2,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  LogOut,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { createEmptyVideoForm, resumeSections, videoToForm } from './data/fallback'
import {
  deleteVideo,
  fetchAdminVideos,
  fetchPublicVideos,
  getCurrentSession,
  isAdminEmail,
  saveVideo,
  signInAdmin,
  signOutAdmin,
  uploadAsset,
} from './lib/videoService'
import { isSupabaseConfigured } from './lib/supabase'
import type { Locale, Video, VideoFormState } from './types'
import './App.css'

const copy = {
  zh: {
    navResume: '简历',
    navVideos: '视频作品',
    navContact: '联系',
    navAdmin: '后台',
    heroEyebrow: '个人简历 x 短视频数据作品集',
    heroTitle: '用简历讲清能力，用视频数据证明结果。',
    heroBody:
      '一个面向招聘、客户与个人品牌的沉浸式作品站。保留 Apple 式留白、磨砂玻璃层级和可维护的视频数据后台。',
    primaryCta: '查看视频案例',
    secondaryCta: '浏览简历',
    proofA: '中英双语',
    proofB: '视频一屏一条',
    proofC: '后台可维护',
    resumeLabel: 'Resume',
    videoLabel: 'Video Proof',
    videoSectionTitle: '每个视频都用一整屏讲清楚。',
    videoSectionBody: '左侧展示 9:16 视频，右侧解释这个视频为什么有效，以及它带来了什么数据结果。',
    noVideosTitle: '还没有公开视频',
    noVideosBody: '登录后台上传视频并发布后，这里会自动生成沉浸式视频故事页。',
    metrics: {
      views: '播放量',
      likes: '点赞',
      comments: '评论',
      shares: '分享',
      completionRate: '完播率',
      engagementRate: '互动率',
      conversionNote: '转化/复盘',
    },
    contactTitle: '准备好替换成你的真实简历和视频。',
    contactBody: '下一步可以逐段填入个人信息、真实经历、视频素材和平台数据。',
  },
  en: {
    navResume: 'Resume',
    navVideos: 'Video Work',
    navContact: 'Contact',
    navAdmin: 'Admin',
    heroEyebrow: 'Resume x short-video data portfolio',
    heroTitle: 'Explain your capability with a resume. Prove it with video data.',
    heroBody:
      'An immersive portfolio for hiring, clients, and personal brand. Built with Apple-inspired spacing, glass materials, and a maintainable video data backend.',
    primaryCta: 'View video cases',
    secondaryCta: 'Explore resume',
    proofA: 'Bilingual',
    proofB: 'One video per screen',
    proofC: 'Admin maintained',
    resumeLabel: 'Resume',
    videoLabel: 'Video Proof',
    videoSectionTitle: 'Every video gets an entire screen to make its case.',
    videoSectionBody:
      'The 9:16 video sits on the left while the right side explains why it worked and what it achieved.',
    noVideosTitle: 'No published videos yet',
    noVideosBody: 'Upload and publish videos from the admin panel to generate immersive story sections here.',
    metrics: {
      views: 'Views',
      likes: 'Likes',
      comments: 'Comments',
      shares: 'Shares',
      completionRate: 'Completion',
      engagementRate: 'Engagement',
      conversionNote: 'Conversion / Review',
    },
    contactTitle: 'Ready for your real resume and videos.',
    contactBody: 'Next, replace the placeholders with personal details, real experience, video assets, and platform data.',
  },
}

const motionTransition = { duration: 0.72, ease: 'easeOut' } as const

const motionIn = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.28 },
  transition: motionTransition,
}

function App() {
  const isAdminRoute = window.location.pathname.startsWith('/admin')
  return isAdminRoute ? <AdminApp /> : <PublicPortfolio />
}

function PublicPortfolio() {
  const [locale, setLocale] = useState<Locale>('zh')
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const t = copy[locale]

  useEffect(() => {
    let cancelled = false

    async function loadVideos() {
      const nextVideos = await fetchPublicVideos()
      if (!cancelled) {
        setVideos(nextVideos)
        setLoading(false)
      }
    }

    void loadVideos()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="glass-nav">
        <a className="brand-mark" href="#top" aria-label="Portfolio home">
          <span>EV</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#resume">{t.navResume}</a>
          <a href="#videos">{t.navVideos}</a>
          <a href="#contact">{t.navContact}</a>
          <a href="/admin">{t.navAdmin}</a>
        </nav>
        <button className="locale-toggle" type="button" onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}>
          <Globe2 size={16} />
          {locale === 'zh' ? 'EN' : '中文'}
        </button>
      </header>

      <section id="top" className="hero-stage">
        <motion.div className="hero-copy" {...motionIn}>
          <span className="eyebrow">
            <Sparkles size={16} />
            {t.heroEyebrow}
          </span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroBody}</p>
          <div className="hero-actions">
            <a className="primary-link" href="#videos">
              {t.primaryCta}
              <ArrowUpRight size={18} />
            </a>
            <a className="secondary-link" href="#resume">
              {t.secondaryCta}
            </a>
          </div>
        </motion.div>

        <motion.aside className="hero-console glass-panel" {...motionIn} transition={{ ...motionIn.transition, delay: 0.12 }}>
          <div className="console-orbit" />
          <div className="console-card main">
            <BarChart3 size={28} />
            <strong>{t.videoLabel}</strong>
            <span>{t.proofB}</span>
          </div>
          <div className="console-card mini top">{t.proofA}</div>
          <div className="console-card mini bottom">{t.proofC}</div>
        </motion.aside>
      </section>

      <section id="resume" className="resume-section">
        <div className="section-kicker">{t.resumeLabel}</div>
        <div className="resume-grid">
          {resumeSections.map((section, index) => (
            <motion.article className="resume-card glass-panel" key={section.id} {...motionIn} transition={{ ...motionIn.transition, delay: index * 0.04 }}>
              <span>{section.eyebrow[locale]}</span>
              <h2>{section.title[locale]}</h2>
              <p>{section.body[locale]}</p>
              <ul>
                {section.points.map((point) => (
                  <li key={point[locale]}>
                    <Check size={16} />
                    {point[locale]}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="videos" className="video-intro">
        <motion.div {...motionIn}>
          <span className="section-kicker">{t.videoLabel}</span>
          <h2>{t.videoSectionTitle}</h2>
          <p>{t.videoSectionBody}</p>
        </motion.div>
      </section>

      {loading ? (
        <section className="empty-state glass-panel">
          <Loader2 className="spin" size={30} />
          <p>Loading video stories...</p>
        </section>
      ) : videos.length > 0 ? (
        <section className="video-stories" aria-label="Video stories">
          {videos.map((video, index) => (
            <VideoStory key={video.id} index={index} locale={locale} video={video} />
          ))}
        </section>
      ) : (
        <section className="empty-state glass-panel">
          <Film size={34} />
          <h2>{t.noVideosTitle}</h2>
          <p>{t.noVideosBody}</p>
        </section>
      )}

      <section id="contact" className="contact-section glass-panel">
        <span className="section-kicker">{t.navContact}</span>
        <h2>{t.contactTitle}</h2>
        <p>{t.contactBody}</p>
      </section>
    </main>
  )
}

function VideoStory({ video, locale, index }: { video: Video; locale: Locale; index: number }) {
  const t = copy[locale]
  const metrics = useMemo(
    () => [
      { label: t.metrics.views, value: video.metrics.views },
      { label: t.metrics.likes, value: video.metrics.likes },
      { label: t.metrics.comments, value: video.metrics.comments },
      { label: t.metrics.shares, value: video.metrics.shares },
      { label: t.metrics.completionRate, value: video.metrics.completionRate },
      { label: t.metrics.engagementRate, value: video.metrics.engagementRate },
    ],
    [t, video.metrics],
  )

  return (
    <motion.article className="video-story" {...motionIn}>
      <div className="video-phone glass-panel">
        <div className="phone-speaker" />
        {video.videoUrl ? (
          <video src={video.videoUrl} poster={video.posterUrl || undefined} controls playsInline preload="metadata" />
        ) : (
          <div className="video-placeholder">
            <Film size={46} />
            <span>Video {String(index + 1).padStart(2, '0')}</span>
          </div>
        )}
      </div>

      <div className="video-data glass-panel">
        <span className="story-index">Case {String(index + 1).padStart(2, '0')}</span>
        <h2>{video.title[locale]}</h2>
        <p>{video.description[locale]}</p>
        <div className="metric-grid">
          {metrics.map((metric) => (
            <div className="metric-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value || '-'}</strong>
            </div>
          ))}
        </div>
        <div className="conversion-note">
          <span>{t.metrics.conversionNote}</span>
          <p>{video.metrics.conversionNote || '-'}</p>
        </div>
      </div>
    </motion.article>
  )
}

function AdminApp() {
  const [session, setSession] = useState<Session | null>(null)
  const [authorized, setAuthorized] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [form, setForm] = useState<VideoFormState>(() => createEmptyVideoForm())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const loadAdminVideos = useCallback(async () => {
    const nextVideos = await fetchAdminVideos()
    setVideos(nextVideos)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!isSupabaseConfigured) {
        setAuthChecked(true)
        return
      }

      try {
        const nextSession = await getCurrentSession()
        if (cancelled) {
          return
        }

        setSession(nextSession)
        const canManage = await isAdminEmail(nextSession?.user.email)
        if (cancelled) {
          return
        }

        setAuthorized(canManage)
        if (canManage) {
          await loadAdminVideos()
        }
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : 'Failed to check admin access.')
      } finally {
        if (!cancelled) {
          setAuthChecked(true)
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [loadAdminVideos])

  function updateForm<K extends keyof VideoFormState>(key: K, value: VideoFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setStatus('')

    try {
      const nextSession = await signInAdmin(email, password)
      const canManage = await isAdminEmail(nextSession?.user.email)

      if (!canManage) {
        await signOutAdmin()
        setSession(null)
        setAuthorized(false)
        setError('This account is not listed in admin_users.')
        return
      }

      setSession(nextSession)
      setAuthorized(true)
      setStatus('Signed in. Admin tools are ready.')
      await loadAdminVideos()
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Login failed.')
    } finally {
      setBusy(false)
    }
  }

  async function handleSignOut() {
    setBusy(true)
    await signOutAdmin()
    setSession(null)
    setAuthorized(false)
    setVideos([])
    setBusy(false)
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>, folder: 'videos' | 'posters') {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setBusy(true)
    setError('')
    setStatus(`Uploading ${file.name}...`)

    try {
      const path = await uploadAsset(file, folder)
      updateForm(folder === 'videos' ? 'videoPath' : 'posterPath', path)
      setStatus(`${folder === 'videos' ? 'Video' : 'Poster'} uploaded.`)
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Upload failed.')
    } finally {
      setBusy(false)
      event.target.value = ''
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setStatus('')

    try {
      await saveVideo(form)
      setForm(createEmptyVideoForm())
      setStatus('Video saved.')
      await loadAdminVideos()
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(video: Video) {
    const confirmed = window.confirm(`Delete "${video.title.zh}" and its storage files?`)
    if (!confirmed) {
      return
    }

    setBusy(true)
    setError('')
    setStatus('')

    try {
      await deleteVideo(video)
      setStatus('Video deleted.')
      await loadAdminVideos()
      if (form.id === video.id) {
        setForm(createEmptyVideoForm())
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Delete failed.')
    } finally {
      setBusy(false)
    }
  }

  if (!isSupabaseConfigured) {
    return <AdminConfigNotice />
  }

  if (!authChecked) {
    return (
      <main className="admin-shell center-admin">
        <Loader2 className="spin" size={32} />
        <p>Checking admin session...</p>
      </main>
    )
  }

  if (!session || !authorized) {
    return (
      <main className="admin-shell">
        <section className="admin-login glass-panel">
          <span className="eyebrow">
            <LockKeyhole size={16} />
            Admin Login
          </span>
          <h1>Maintain portfolio videos securely.</h1>
          <p>Sign in with a Supabase Auth account whose email exists in the admin_users table.</p>
          <form onSubmit={handleLogin}>
            <label>
              Email
              <input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label>
              Password
              <input autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            <button className="primary-link" disabled={busy} type="submit">
              {busy ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}
              Sign in
            </button>
          </form>
          <StatusLine error={error} status={status} />
        </section>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <header className="admin-header glass-panel">
        <div>
          <span className="eyebrow">
            <LayoutDashboard size={16} />
            Admin Studio
          </span>
          <h1>Video maintenance</h1>
          <p>Upload, edit, publish, unpublish, and delete portfolio videos.</p>
        </div>
        <button className="ghost-button" disabled={busy} type="button" onClick={handleSignOut}>
          <LogOut size={18} />
          Sign out
        </button>
      </header>

      <section className="admin-grid">
        <form className="video-editor glass-panel" onSubmit={handleSave}>
          <div className="editor-title">
            <h2>{form.id ? 'Edit video' : 'New video'}</h2>
            <button className="ghost-button" type="button" onClick={() => setForm(createEmptyVideoForm())}>
              <Plus size={16} />
              New
            </button>
          </div>

          <div className="form-grid two">
            <label>
              中文标题
              <input value={form.titleZh} onChange={(event) => updateForm('titleZh', event.target.value)} required />
            </label>
            <label>
              English title
              <input value={form.titleEn} onChange={(event) => updateForm('titleEn', event.target.value)} required />
            </label>
          </div>

          <div className="form-grid two">
            <label>
              中文描述
              <textarea value={form.descriptionZh} onChange={(event) => updateForm('descriptionZh', event.target.value)} rows={4} />
            </label>
            <label>
              English description
              <textarea value={form.descriptionEn} onChange={(event) => updateForm('descriptionEn', event.target.value)} rows={4} />
            </label>
          </div>

          <div className="upload-grid">
            <label className="upload-drop">
              <UploadCloud size={22} />
              <span>{form.videoPath ? form.videoPath : 'Upload vertical video'}</span>
              <input accept="video/*" type="file" onChange={(event) => void handleUpload(event, 'videos')} />
            </label>
            <label className="upload-drop">
              <UploadCloud size={22} />
              <span>{form.posterPath ? form.posterPath : 'Optional poster image'}</span>
              <input accept="image/*" type="file" onChange={(event) => void handleUpload(event, 'posters')} />
            </label>
          </div>

          <div className="form-grid three">
            <label>
              Views
              <input value={form.views} onChange={(event) => updateForm('views', event.target.value)} />
            </label>
            <label>
              Likes
              <input value={form.likes} onChange={(event) => updateForm('likes', event.target.value)} />
            </label>
            <label>
              Comments
              <input value={form.comments} onChange={(event) => updateForm('comments', event.target.value)} />
            </label>
            <label>
              Shares
              <input value={form.shares} onChange={(event) => updateForm('shares', event.target.value)} />
            </label>
            <label>
              Completion
              <input value={form.completionRate} onChange={(event) => updateForm('completionRate', event.target.value)} />
            </label>
            <label>
              Engagement
              <input value={form.engagementRate} onChange={(event) => updateForm('engagementRate', event.target.value)} />
            </label>
          </div>

          <label>
            Conversion / review note
            <textarea value={form.conversionNote} onChange={(event) => updateForm('conversionNote', event.target.value)} rows={3} />
          </label>

          <div className="form-row">
            <label className="checkbox-label">
              <input checked={form.published} type="checkbox" onChange={(event) => updateForm('published', event.target.checked)} />
              Published
            </label>
            <label>
              Sort order
              <input min={0} type="number" value={form.sortOrder} onChange={(event) => updateForm('sortOrder', Number(event.target.value))} />
            </label>
          </div>

          <button className="primary-link" disabled={busy} type="submit">
            {busy ? <Loader2 className="spin" size={18} /> : <Check size={18} />}
            Save video
          </button>
          <StatusLine error={error} status={status} />
        </form>

        <aside className="admin-list glass-panel">
          <h2>Videos</h2>
          <AnimatePresence initial={false}>
            {videos.length > 0 ? (
              videos.map((video) => (
                <motion.article className="admin-video-row" key={video.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <button type="button" onClick={() => setForm(videoToForm(video))}>
                    <span>{video.title.zh}</span>
                    <small>{video.published ? 'Published' : 'Draft'} · Order {video.sortOrder}</small>
                  </button>
                  <button className="danger-button" disabled={busy} type="button" onClick={() => void handleDelete(video)}>
                    <Trash2 size={16} />
                  </button>
                </motion.article>
              ))
            ) : (
              <p className="muted-text">No videos yet. Upload your first case.</p>
            )}
          </AnimatePresence>
        </aside>
      </section>
    </main>
  )
}

function AdminConfigNotice() {
  return (
    <main className="admin-shell">
      <section className="admin-login glass-panel">
        <span className="eyebrow">
          <ChevronDown size={16} />
          Configuration required
        </span>
        <h1>Supabase is not configured yet.</h1>
        <p>Create a local `.env.local` file and add the Vercel environment variables before using the admin panel.</p>
        <pre>{`VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key`}</pre>
        <a className="secondary-link" href="/">
          Back to public site
        </a>
      </section>
    </main>
  )
}

function StatusLine({ error, status }: { error: string; status: string }) {
  if (!error && !status) {
    return null
  }

  return <p className={error ? 'status-line error' : 'status-line'}>{error || status}</p>
}

export default App
