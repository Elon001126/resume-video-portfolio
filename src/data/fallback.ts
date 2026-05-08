import type { ResumeSection, Video, VideoFormState, VideoMetrics } from '../types'

export const defaultMetrics: VideoMetrics = {
  views: '2.4M',
  likes: '186K',
  comments: '12.8K',
  shares: '38K',
  completionRate: '74%',
  engagementRate: '11.6%',
  conversionNote: 'Hook test outperformed baseline by 3.2x',
}

export const resumeSections: ResumeSection[] = [
  {
    id: 'profile',
    eyebrow: { zh: '个人简介', en: 'Profile' },
    title: { zh: '把复杂数据转化为可传播的短视频叙事。', en: 'Turning complex data into video stories that travel.' },
    body: {
      zh: '这里将替换为你的真实简历简介。第一版先用高级占位文案承载版式、节奏和视觉层级。',
      en: 'This area is ready for your real bio. The first version uses polished placeholder copy to lock the visual rhythm.',
    },
    points: [
      { zh: '数据驱动选题、脚本、复盘', en: 'Data-led topic selection, scripting, and review' },
      { zh: '短视频增长实验与创意迭代', en: 'Short-form growth experiments and creative iteration' },
      { zh: '适合展示招聘、客户案例和个人品牌', en: 'Built for hiring, client proof, and personal brand' },
    ],
  },
  {
    id: 'capabilities',
    eyebrow: { zh: '核心能力', en: 'Capabilities' },
    title: { zh: '内容策略、数据分析和视觉表达的交叉能力。', en: 'A hybrid system for strategy, analytics, and visual craft.' },
    body: {
      zh: '用清晰的数据指标解释作品价值，而不是只展示视频本身。',
      en: 'Each project is framed by measurable impact, not just the media asset.',
    },
    points: [
      { zh: '视频数据看板与指标归因', en: 'Video dashboards and metric attribution' },
      { zh: '爆款结构拆解与脚本优化', en: 'Viral structure breakdown and script optimization' },
      { zh: '跨平台内容资产沉淀', en: 'Cross-platform content asset systems' },
    ],
  },
  {
    id: 'experience',
    eyebrow: { zh: '工作经历', en: 'Experience' },
    title: { zh: '用结果组织经历，用作品证明能力。', en: 'Experience organized by outcomes and proved by work.' },
    body: {
      zh: '后续可替换为公司、岗位、时间线和关键成果。',
      en: 'Replace this with companies, roles, timeline, and quantified achievements.',
    },
    points: [
      { zh: '增长项目负责人 / 2024 - 至今', en: 'Growth project lead / 2024 - Present' },
      { zh: '内容数据分析 / 2022 - 2024', en: 'Content analytics / 2022 - 2024' },
      { zh: '短视频创意策划 / 2020 - 2022', en: 'Short-video creative strategy / 2020 - 2022' },
    ],
  },
  {
    id: 'projects',
    eyebrow: { zh: '项目成果', en: 'Projects' },
    title: { zh: '每个项目都应有背景、动作和可量化结果。', en: 'Every project gets context, action, and measurable proof.' },
    body: {
      zh: '这一块会和下面的视频成果区形成呼应。',
      en: 'This section pairs with the full-screen video proof below.',
    },
    points: [
      { zh: '系列内容播放突破 200 万', en: 'Series exceeded 2M views' },
      { zh: '重构开头 3 秒后完播率提升', en: 'Opening 3 seconds improved completion' },
      { zh: '建立可复用选题和复盘流程', en: 'Built reusable ideation and review workflow' },
    ],
  },
  {
    id: 'skills',
    eyebrow: { zh: '技能栈', en: 'Skills' },
    title: { zh: '内容、数据、工具和审美共同构成竞争力。', en: 'Content, data, tools, and taste as one operating system.' },
    body: {
      zh: '可替换为剪辑、数据平台、AI 工具、投放平台等真实技能。',
      en: 'Replace with editing tools, analytics platforms, AI workflow, and media channels.',
    },
    points: [
      { zh: '数据分析 / 内容策略 / 视觉叙事', en: 'Analytics / Content strategy / Visual storytelling' },
      { zh: '剪辑复盘 / A/B 测试 / 素材管理', en: 'Editing review / A/B testing / Asset management' },
      { zh: 'AI 辅助脚本 / 自动化工作流', en: 'AI-assisted scripts / Automation workflows' },
    ],
  },
  {
    id: 'contact',
    eyebrow: { zh: '联系', en: 'Contact' },
    title: { zh: '把你的下一段机会导向一个清晰入口。', en: 'Give the next opportunity a clear path to reach you.' },
    body: {
      zh: '这里放邮箱、社交账号、作品集链接或预约入口。',
      en: 'Place email, social profiles, portfolio links, or booking links here.',
    },
    points: [
      { zh: 'Email: hello@example.com', en: 'Email: hello@example.com' },
      { zh: 'GitHub: Elon001126', en: 'GitHub: Elon001126' },
      { zh: '可加入 LinkedIn / 小红书 / 抖音', en: 'Add LinkedIn / Xiaohongshu / Douyin' },
    ],
  },
]

export const fallbackVideos: Video[] = [
  {
    id: 'fallback-video-01',
    title: { zh: '数据驱动的短视频增长案例', en: 'Data-led Short Video Growth Case' },
    description: {
      zh: '用占位视频卡展示一屏一条的叙事方式。上传真实视频后，这里会自动替换为你的内容。',
      en: 'A placeholder for the one-screen-per-video storytelling flow. Real uploads will replace it automatically.',
    },
    videoPath: null,
    videoUrl: null,
    posterPath: null,
    posterUrl: null,
    metrics: defaultMetrics,
    published: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fallback-video-02',
    title: { zh: '开头三秒 Hook 优化实验', en: 'First Three Seconds Hook Experiment' },
    description: {
      zh: '用指标解释创意动作，让观众快速理解视频价值和增长逻辑。',
      en: 'Metrics explain the creative move, making the value and growth logic visible.',
    },
    videoPath: null,
    videoUrl: null,
    posterPath: null,
    posterUrl: null,
    metrics: {
      views: '860K',
      likes: '61K',
      comments: '4.9K',
      shares: '18K',
      completionRate: '81%',
      engagementRate: '9.8%',
      conversionNote: 'Retention lifted after restructuring the opening beat',
    },
    published: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function createEmptyVideoForm(): VideoFormState {
  return {
    titleZh: '',
    titleEn: '',
    descriptionZh: '',
    descriptionEn: '',
    videoPath: null,
    posterPath: null,
    views: '',
    likes: '',
    comments: '',
    shares: '',
    completionRate: '',
    engagementRate: '',
    conversionNote: '',
    published: true,
    sortOrder: 1,
  }
}

export function videoToForm(video: Video): VideoFormState {
  return {
    id: video.id,
    titleZh: video.title.zh,
    titleEn: video.title.en,
    descriptionZh: video.description.zh,
    descriptionEn: video.description.en,
    videoPath: video.videoPath,
    posterPath: video.posterPath,
    views: video.metrics.views,
    likes: video.metrics.likes,
    comments: video.metrics.comments,
    shares: video.metrics.shares,
    completionRate: video.metrics.completionRate,
    engagementRate: video.metrics.engagementRate,
    conversionNote: video.metrics.conversionNote,
    published: video.published,
    sortOrder: video.sortOrder,
  }
}
