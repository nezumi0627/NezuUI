import { useState } from 'react'
import './skill-page.css'

const aiSkillPrompt = `Use NezuUI as the reusable UI skill for this project.

Before editing UI, read NezuUI's AGENTS.md and docs/adoption.md.
Build small React presentation components with props and callbacks only.
Use the nezu- CSS prefix and --nezu-* theme variables.
Keep components portable: do not add product API, store, account, media, network, or protocol dependencies.

When porting from Vyline, preserve the visible behavior and interaction semantics, then record the original source path in NOTICE.md. Never copy tokens, account state, chat logs, or client credentials.

Before finishing, verify a narrow/mobile viewport and reduced-motion behavior, then run:
- npm run check
- npm run build`

export function SkillPage() {
  const [copied, setCopied] = useState(false)

  const copySkill = async () => {
    await navigator.clipboard?.writeText(aiSkillPrompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section className="nu-skill-page">
      <article className="nu-skill-card">
        <div className="nu-skill-head">
          <div>
            <p className="nu-eyebrow">AI / PORTABLE UI WORKFLOW</p>
            <h2>NezuUIをAIのSkillとして使う</h2>
            <p>下の文章をAIへそのまま渡せば、NezuUIの移植ルールと検証手順を共有できます。</p>
          </div>
          <span className="nu-status-tag">skills/nezuui/SKILL.md 準拠</span>
        </div>

        <div className="nu-skill-actions">
          <button type="button" className="nu-button" onClick={() => void copySkill()}>
            {copied ? 'コピーしました' : 'AI向け文章をコピー'}
          </button>
          <a className="nu-button" href="https://github.com/nezumi0627/NezuUI/blob/main/skills/nezuui/SKILL.md" target="_blank" rel="noreferrer">
            SKILL.md を開く ↗
          </a>
        </div>

        <pre className="nu-skill-code"><code>{aiSkillPrompt}</code></pre>
      </article>

      <div className="nu-skill-notes">
        <article><strong>移植しやすく</strong><span>表示propsとcallback中心。アプリ固有のAPIやstoreを持ち込まない。</span></article>
        <article><strong>Vyline由来を記録</strong><span>見た目と操作を保ち、元ソースのパスをNOTICE.mdへ残す。</span></article>
        <article><strong>最後に検証</strong><span>狭い画面・reduced motion・check・buildまで確認する。</span></article>
      </div>
    </section>
  )
}
