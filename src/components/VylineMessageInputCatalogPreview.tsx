import { useState } from 'react'
import {
  IconArrowUp,
  IconBellOff,
  IconClose,
  IconPaperclip,
  IconPlus,
  IconSmile,
  IconSpark,
} from './icons'
import './message-composer.css'
import './vyline-message-input-catalog.css'

type Tool = 'none' | 'plus' | 'attach' | 'sticker' | 'ai'
type StickerTab = 'sticker' | 'emoji'

const stickers = [
  ['🐻', 'くま'], ['🐰', 'うさぎ'], ['🐣', 'ひな'], ['🎉', 'おめでとう'],
  ['🙏', 'おねがい'], ['💤', 'おやすみ'], ['🍰', 'ケーキ'], ['☕️', 'ひとやすみ'],
] as const

const lineEmoji = [
  ['✿', 'はな'], ['★', 'ほし'], ['♪', 'おんぷ'], ['❤', 'はーと'],
  ['☺', 'にこ'], ['✔', 'チェック'], ['☂', 'かさ'], ['✈', 'ひこうき'],
  ['☀', 'たいよう'], ['☁', 'くも'], ['✂', 'はさみ'], ['☎', 'でんわ'],
] as const

const menuItems = [
  ['event', 'イベント作成', '日程と場所を決めて共有'],
  ['amidakuji', 'あみだくじ', 'メンバーでくじ引き'],
  ['poll', 'アンケート', '選択肢を作って投票'],
] as const

function MenuGlyph({ kind }: { kind: string }) {
  if (kind === 'event') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M8 3.5v4M16 3.5v4M4 9.5h16M12 12v5M9.5 14.5h5" /></svg>
  if (kind === 'amidakuji') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v16M18 4v16M6 8h6v4h6M6 16h7v-3h5" /></svg>
  if (kind === 'poll') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="m7.5 9 1.5 1.5L11.5 8M13.5 9H17M7.5 15l1.5 1.5 2.5-2.5M13.5 15H17" /></svg>
  return <IconPlus size={18} />
}

function DemoToolButton({ label, active, children, onClick }: { label: string; active?: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" className={`nezu-message-composer-icon ${active ? 'is-active' : ''}`} aria-label={label} aria-pressed={active} title={label} onClick={onClick}>{children}</button>
}

export function VylineMessageInputCatalogPreview() {
  const [draft, setDraft] = useState('NezuUIをもっと正確にする')
  const [reply, setReply] = useState(true)
  const [agentEnabled, setAgentEnabled] = useState(true)
  const [groupChat, setGroupChat] = useState(true)
  const [muted, setMuted] = useState(false)
  const [tool, setTool] = useState<Tool>('none')
  const [stickerTab, setStickerTab] = useState<StickerTab>('sticker')
  const [feedback, setFeedback] = useState('')

  const toggleTool = (next: Tool) => {
    setTool((current) => current === next ? 'none' : next)
    setFeedback('')
  }

  const send = () => {
    if (!draft.trim()) return
    setFeedback(muted ? 'ミュート送信のデモ' : '送信のデモ')
  }

  return (
    <div className="nu-vyline-preview vy-catalog-message-input">
      <div className="vy-preview-toolbar" aria-label="プレビュー状態">
        <button type="button" aria-pressed={reply} onClick={() => setReply((value) => !value)}>返信</button>
        <button type="button" aria-pressed={agentEnabled} onClick={() => setAgentEnabled((value) => !value)}>Agent I</button>
        <button type="button" aria-pressed={groupChat} onClick={() => setGroupChat((value) => !value)}>{groupChat ? 'グループ' : '1:1'}</button>
        <button type="button" aria-pressed={!draft} onClick={() => setDraft('')}>空入力</button>
      </div>

      <div className="vy-catalog-composer-frame">
        <div className="nezu-message-composer-root vy-catalog-composer">
          {reply && <div className="nezu-message-composer-reply"><div><strong>ねずみさん への返信</strong><span>細かいUIまで全部まとめたい</span></div><button type="button" aria-label="返信をキャンセル" onClick={() => setReply(false)}><IconClose size={16} /></button></div>}

          <div className="nezu-message-composer-surface">
            <div className="nezu-message-composer-row">
              <div className="nezu-message-composer-left">
                <DemoToolButton label="作成メニュー" active={tool === 'plus'} onClick={() => toggleTool('plus')}><span className={`nezu-message-composer-plus ${tool === 'plus' ? 'is-open' : ''}`}><IconPlus size={20} /></span></DemoToolButton>
                <DemoToolButton label="画像・動画を添付" active={tool === 'attach'} onClick={() => { toggleTool('attach'); setFeedback('添付ボタンのデモ') }}><IconPaperclip size={18} /></DemoToolButton>
                <DemoToolButton label="スタンプ・LINE絵文字" active={tool === 'sticker'} onClick={() => toggleTool('sticker')}><IconSmile size={18} /></DemoToolButton>
                <DemoToolButton label="ミュートメッセージ" active={muted} onClick={() => { setMuted((value) => !value); setFeedback('') }}><IconBellOff size={18} /></DemoToolButton>
              </div>

              <label className="nezu-message-composer-editor"><span className="sr-only">メッセージ</span><textarea rows={1} value={draft} placeholder="メッセージを入力" onChange={(event) => { setDraft(event.target.value); setFeedback('') }} /></label>

              <div className="nezu-message-composer-right">
                {agentEnabled && draft.trim() && <DemoToolButton label="AIで文章を整える" active={tool === 'ai'} onClick={() => toggleTool('ai')}><IconSpark size={18} /></DemoToolButton>}
                <button type="button" className="nezu-message-composer-send" aria-label="送信" onClick={send}><IconArrowUp size={18} /></button>
              </div>
            </div>
          </div>
          <div className="nezu-message-composer-hint" aria-live="polite"><span>{feedback || (muted ? 'ミュートメッセージ：相手に通知されません' : 'ボタンはカタログ用デモです。押すと状態色が変わります。')}</span></div>
        </div>
      </div>

      <div className="vy-catalog-detached-grid">
        <section className={`vy-catalog-panel-card ${tool === 'sticker' ? 'is-active' : ''}`}>
          <div className="vy-catalog-panel-label"><strong>スタンプ / LINE絵文字</strong><span>入力欄と分離して常時プレビュー</span></div>
          <div className="nezu-message-composer-sticker-panel vy-catalog-detached-panel">
            <div className="nezu-message-composer-tabs" role="tablist" aria-label="スタンプ・絵文字">
              <button type="button" role="tab" aria-selected={stickerTab === 'sticker'} onClick={() => setStickerTab('sticker')}>スタンプ</button>
              <button type="button" role="tab" aria-selected={stickerTab === 'emoji'} onClick={() => setStickerTab('emoji')}>LINE絵文字</button>
            </div>
            {stickerTab === 'sticker' ? <div className="nezu-message-composer-sticker-body"><div className="nezu-message-composer-sticker-grid">{stickers.map(([glyph, label]) => <button type="button" key={label} aria-label={`スタンプ ${label}`} onClick={() => { setFeedback(`${glyph} スタンプを選択`); setTool('sticker') }}><span aria-hidden="true">{glyph}</span></button>)}</div><p>続けて送るとコンビネーションスタンプになります</p></div>
              : <div className="nezu-message-composer-sticker-body"><div className="nezu-message-composer-emoji-grid">{lineEmoji.map(([glyph, label]) => <button type="button" key={label} aria-label={`絵文字 ${label}`} onClick={() => { setDraft((value) => `${value}${glyph}`); setFeedback(`${glyph} を入力欄へ追加`); setTool('sticker') }}><span aria-hidden="true">{glyph}</span></button>)}</div><p>文章のカーソル位置に挿入されます</p></div>}
          </div>
        </section>

        <section className={`vy-catalog-panel-card ${tool === 'plus' ? 'is-active' : ''}`}>
          <div className="vy-catalog-panel-label"><strong>作成メニュー</strong><span>PlusMenuを独立して確認</span></div>
          <div className="nezu-message-composer-menu vy-catalog-detached-panel" role="menu" aria-label="作成メニュー">
            {menuItems.map(([id, label, description]) => <button type="button" role="menuitem" key={id} onClick={() => { setTool('plus'); setFeedback(`${label} を選択`) }}><span className="nezu-message-composer-menu-icon"><MenuGlyph kind={id} /></span><span><strong>{label}</strong><small>{description}</small></span></button>)}
          </div>
        </section>
      </div>
    </div>
  )
}
