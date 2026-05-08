import { ArrowUpRight, BriefcaseBusiness, Film, Sparkles } from 'lucide-react'
import './App.css'

const highlights = [
  'Resume-first personal brand site',
  'Short video performance showcase',
  'Ready for Vercel deployment',
]

const videoCards = [
  { metric: '2.4M+', label: 'Total views', title: 'Data-led short video wins' },
  { metric: '18.7%', label: 'Avg. retention lift', title: 'Hooks and story tests' },
  { metric: '6x', label: 'Creative iteration speed', title: 'Repeatable content system' },
]

function App() {
  return (
    <main className="page-shell">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-backdrop" aria-hidden="true" />
        <nav className="top-nav" aria-label="Primary">
          <a href="#resume">Resume</a>
          <a href="#videos">Videos</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={16} />
              Personal portfolio system
            </span>
            <h1 id="hero-title">Resume, proof, and video impact in one place.</h1>
            <p>
              A fast, cinematic personal website foundation for presenting your
              resume, high-performing short videos, and measurable creative work.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="#videos">
                View video work
                <ArrowUpRight size={18} />
              </a>
              <a className="secondary-link" href="#resume">
                See resume
              </a>
            </div>
          </div>

          <div className="signal-panel" aria-label="Portfolio highlights">
            <div className="orbital-ring" aria-hidden="true" />
            <div className="signal-card">
              <BriefcaseBusiness size={24} />
              <strong>Resume</strong>
              <span>Experience, skills, results</span>
            </div>
            <div className="signal-card accent">
              <Film size={24} />
              <strong>Videos</strong>
              <span>Metrics, thumbnails, links</span>
            </div>
          </div>
        </div>
      </section>

      <section id="resume" className="content-band">
        <div className="section-heading">
          <span>01</span>
          <h2>Resume Foundation</h2>
        </div>
        <div className="highlight-grid">
          {highlights.map((item) => (
            <article key={item}>
              <Sparkles size={18} />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="videos" className="content-band video-band">
        <div className="section-heading">
          <span>02</span>
          <h2>Short Video Results</h2>
        </div>
        <div className="video-grid">
          {videoCards.map((card) => (
            <article className="video-card" key={card.title}>
              <div className="video-frame">
                <Film size={34} />
              </div>
              <h3>{card.title}</h3>
              <strong>{card.metric}</strong>
              <p>{card.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-band">
        <h2>Next step: replace the placeholders with your real resume and videos.</h2>
        <p>
          The stack is ready for animated sections, 3D visuals, Cloudinary or Mux
          video embeds, and Vercel deployment.
        </p>
      </section>
    </main>
  )
}

export default App
