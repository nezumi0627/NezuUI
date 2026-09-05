import { useEffect, useState } from 'react'
import { Avatar, FloatNotice, PremiumBadge, Toggle, VerifiedBadge } from './components'
import './App.css'

const componentSource = `import { Toggle } from "@nezuui/components";

<Toggle
  checked={enabled}
  onCheckedChange={setEnabled}
  label="通知を受け取る"
/>`

const tokens = [
  ['--nezu-accent', 'Primary actions and focus', '#397f65'],
  ['--nezu-surface', 'Raised surfaces', '#17212b'],
  ['--nezu-text', 'Readable foreground text', '#eef3f8'],
  ['--nezu-border', 'Quiet structure', 'rgba(255, 255, 255, .14)'],
]

const services = [
  {
    name: 'Vyline',
    href: 'https://github.com/nezumi0627/Vyline',
    mark: 'V',
    status: 'Vylineで使用中',
    description: 'LINEクライアント。NezuUIは、Vylineで育てたUIパターンを他のプロジェクトでも使える部品として整理しています。',
    patterns: ['Toggle', 'Avatar', 'Badges', 'Float notice'],
  },
]

function App() {
  const [enabled, setEnabled] = useState(true)
  const [notice, setNotice] = useState(false)
  const [light, setLight] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.nezuTheme = light ? 'light' : 'dark'
  }, [light])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(false), 2400)
    return () => window.clearTimeout(timer)
  }, [notice])

  return (
    <div className="catalog-shell">
      {notice && <FloatNotice>NezuUI の通知サンプルです</FloatNotice>}
      <a className="skip-link" href="#catalog">コンテンツへ移動</a>

      <header className="site-header">
          <a className="brand" href="#top" aria-label="NezuUI トップへ">
          <span className="brand-mark">nu</span>
          <span>NezuUI<small>PORTABLE UI</small></span>
        </a>
        <nav aria-label="主要セクション">
          <a href="#services">Services</a>
          <a href="#components">Components</a>
          <a href="#motion">Motion</a>
          <a href="#tokens">Tokens</a>
          <a href="#adopt">Adopt</a>
        </nav>
        <button type="button" className="theme-control" onClick={() => setLight(!light)}>
          {light ? 'Dark' : 'Light'} <span>テーマ</span>
        </button>
      </header>

      <main id="catalog">
        <section className="hero" id="top">
          <div>
            <p className="eyebrow">NEZUUI / 0.1</p>
            <h1>Small pieces.<br /><em>Better interfaces.</em></h1>
            <p className="hero-copy">
              NezuUIは、別のプロジェクトへそのまま持ち込めるReactの小さなUI部品集です。
              バックエンドやグローバルストアに依存せず、propsとCSS変数だけで動きます。
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="#components">部品を見る <span aria-hidden="true">↓</span></a>
              <a className="quiet-link" href="https://github.com/nezumi0627/NezuUI">GitHub ↗</a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="hero-ring ring-one" />
            <span className="hero-ring ring-two" />
            <span className="hero-card">N<span>e</span>zu<br />UI</span>
            <span className="hero-dot dot-one" />
            <span className="hero-dot dot-two" />
          </div>
        </section>

        <section className="facts" aria-label="ライブラリの概要">
          <div><strong>5</strong><span>portable primitives</span></div>
          <div><strong>{services.length}</strong><span>service using NezuUI</span></div>
          <div><strong>0</strong><span>runtime dependencies</span></div>
          <div><strong>MIT</strong><span>ready to reuse</span></div>
        </section>

        <section className="catalog-section services-section" id="services">
          <div className="section-heading">
            <div><p className="eyebrow">01 / SERVICES</p><h2>どこで使われているか。</h2></div>
            <p>導入状況を公開します。掲載するサービスは、実際にNezuUIのパターンを使っているものだけです。</p>
          </div>
          <ul className="service-grid" aria-label="NezuUIを使用しているサービス">
            {services.map((service) => (
              <li className="service-card" key={service.name}>
                <div className="service-card-top">
                  <span className="service-mark" aria-hidden="true">{service.mark}</span>
                  <div><h3>{service.name}</h3><a href={service.href}>プロジェクトを見る ↗</a></div>
                  <span className="service-status">{service.status}</span>
                </div>
                <p>{service.description}</p>
                <div className="service-patterns" aria-label={`${service.name}で使用中のパターン`}>
                  {service.patterns.map((pattern) => <span key={pattern}>{pattern}</span>)}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="catalog-section" id="components">
          <div className="section-heading">
            <div><p className="eyebrow">02 / COMPONENTS</p><h2>触って確かめる。</h2></div>
            <p>すべて同じ小さな境界で使えます。ネットワーク・ストア・プロダクト固有データは持ちません。</p>
          </div>
          <div className="component-grid">
            <article className="specimen wide">
              <header><h3>Toggle</h3><code>controlled</code></header>
              <div className="specimen-stage toggle-stage">
                <div><span>通知を受け取る</span><small>{enabled ? '有効' : '無効'} — 親のstateで制御</small></div>
                <Toggle checked={enabled} onCheckedChange={setEnabled} label="通知を受け取る" />
              </div>
              <footer><span>native button / role=switch / reduced motion</span><code>Toggle.tsx</code></footer>
            </article>

            <article className="specimen">
              <header><h3>Avatar</h3><code>presentational</code></header>
              <div className="specimen-stage avatar-stage">
                <Avatar glyph="N" color="#43886d" size={38} />
                <Avatar glyph="ゆ" color="#577fb7" size={52} online />
                <Avatar glyph="ね" color="#7864ad" size={66} ring />
              </div>
              <footer><span>glyph / image / online / ring</span><code>Avatar.tsx</code></footer>
            </article>

            <article className="specimen">
              <header><h3>Badges</h3><code>status</code></header>
              <div className="specimen-stage badges-stage">
                <div className="identity-line"><Avatar glyph="N" color="#43886d" size={38} /><span>NezuUI</span><VerifiedBadge /></div>
                <div className="identity-line"><PremiumBadge size={22} /><span>Premium</span><PremiumBadge compact size={16} /></div>
              </div>
              <footer><span>verified / premium</span><code>Badges.tsx</code></footer>
            </article>

            <article className="specimen">
              <header><h3>Float notice</h3><code>status</code></header>
              <div className="specimen-stage notice-stage">
                <button type="button" className="demo-button" onClick={() => setNotice(true)}>通知を表示</button>
                <small>クリックで2.4秒間表示</small>
              </div>
              <footer><span>role=status / no global store</span><code>FloatNotice.tsx</code></footer>
            </article>
          </div>
        </section>

        <section className="catalog-section motion-section" id="motion">
          <div className="section-heading">
            <div><p className="eyebrow">03 / MOTION</p><h2>短く、目的を持って。</h2></div>
            <p>頻繁に見る操作は静かに。動きを減らすOS設定では、全モーションをほぼ瞬時に終えます。</p>
          </div>
          <div className="motion-grid">
            <article><span className="motion-sample nezu-fade-up">Fade up</span><h3>Entry</h3><p>160–220ms / ease-out</p></article>
            <article><span className="motion-sample nezu-pop">Pop</span><h3>Confirmation</h3><p>短い反応にだけ使う</p></article>
            <article><span className="motion-sample nezu-slide">Slide</span><h3>Panel</h3><p>距離を小さく保つ</p></article>
          </div>
        </section>

        <section className="catalog-section" id="tokens">
          <div className="section-heading">
            <div><p className="eyebrow">04 / TOKENS</p><h2>プロジェクトの色で使う。</h2></div>
            <p>部品に色を閉じ込めず、ホストアプリからCSS変数を上書きします。</p>
          </div>
          <div className="token-grid">
            {tokens.map(([name, description, value]) => (
              <article key={name}>
                <span className="token-swatch" style={{ background: `var(${name})` }} />
                <div><code>{name}</code><p>{description}</p></div>
                <small>{value}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="adopt-section" id="adopt">
          <div><p className="eyebrow">05 / ADOPT</p><h2>使うものだけ、持っていく。</h2><p>各部品はnamed exportと単一のスタイルシートで提供します。プロダクトのデータ取得・永続化・ルーティングは導入先に残します。</p><a className="quiet-link" href="https://github.com/nezumi0627/NezuUI/blob/main/docs/adoption.md">導入ガイドを読む ↗</a></div>
          <pre aria-label="Toggleの使用例"><code>{componentSource}</code></pre>
        </section>
      </main>

      <footer className="site-footer">
        <span><strong>nu</strong> NezuUI</span>
        <span>Built from reusable ideas, including research from <a href="https://github.com/nezumi0627/Vyline">Vyline</a>.</span>
        <a href="https://github.com/nezumi0627/NezuUI">GitHub ↗</a>
      </footer>
    </div>
  )
}

export default App
