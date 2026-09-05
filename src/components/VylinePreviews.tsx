import { useEffect, useMemo, useState } from 'react'
import { Avatar } from './Avatar'
import { OfficialBadge, PremiumBadge } from './Badges'
import { MessageComposer } from './MessageComposer'
import {
  IconAtSign,
  IconBellOff,
  IconCheck,
  IconChevron,
  IconClose,
  IconCopy,
  IconDownload,
  IconEdit,
  IconHeart,
  IconLogout,
  IconMemo,
  IconMic,
  IconMicOff,
  IconPhone,
  IconPin,
  IconPlus,
  IconReply,
  IconTrash,
  IconVideo,
} from './icons'
import './vyline-previews.css'

const richImage =
  'data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 600 400%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%22 x2=%221%22 y1=%220%22 y2=%221%22%3E%3Cstop stop-color=%22%232aabee%22/%3E%3Cstop offset=%221%22 stop-color=%22%2352769f%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%22600%22 height=%22400%22 rx=%2230%22 fill=%22url(%23g)%22/%3E%3Ccircle cx=%22130%22 cy=%22135%22 r=%2260%22 fill=%22white%22 fill-opacity=%22.18%22/%3E%3Ctext x=%2250%22 y=%22265%22 font-size=%2262%22 font-family=%22sans-serif%22 fill=%22white%22 font-weight=%22700%22%3ENezuUI%3C/text%3E%3Ctext x=%2252%22 y=%22315%22 font-size=%2227%22 font-family=%22sans-serif%22 fill=%22white%22 fill-opacity=%22.82%22%3EVyline Rich Message%3C/text%3E%3C/svg%3E'

export function VylineChatRowPreview() {
  return (
    <div className="nu-vyline-preview vy-chat-row-preview">
      <button type="button" className="vy-chat-row-button">
        <Avatar glyph="ね" color="#52796f" size={48} online />
        <span className="vy-chat-row-body">
          <span className="vy-chat-row-title">
            <IconPin size={12} />
            <IconBellOff size={12} />
            <strong>ねずみさん</strong>
            <OfficialBadge />
            <time>14:35</time>
          </span>
          <span className="vy-chat-row-sub">
            <span>NezuUI、かなり良くなってきた</span>
            <b>3</b>
          </span>
        </span>
      </button>
    </div>
  )
}

export function VylineMessageBubblePreview() {
  return (
    <div className="nu-vyline-preview vy-message-list-preview">
      <div className="vy-message-row incoming">
        <div className="vy-avatar-column"><Avatar glyph="ね" color="#52796f" size={32} /></div>
        <div className="vy-message-content">
          <div className="vy-message-author">ねずみさん</div>
          <div className="vy-message-bubble incoming">細かいUIまで全部まとめたい</div>
          <div className="vy-message-meta"><span>14:34</span></div>
        </div>
      </div>
      <div className="vy-message-row outgoing">
        <div className="vy-message-content">
          <div className="vy-message-bubble outgoing">
            <div className="vy-reply-quote">
              <strong>ねずみさん</strong>
              <span>細かいUIまで全部まとめたい</span>
            </div>
            NezuUIに整理していくよ
          </div>
          <div className="vy-message-meta outgoing"><span>既読 2</span><span>14:35</span></div>
          <div className="vy-reaction-row"><span>👍 2</span><span>❤️ 1</span></div>
        </div>
      </div>
      <div className="vy-system-message"><span>メッセージの送信を取り消しました</span></div>
    </div>
  )
}

export function VylineMessageInputPreview() {
  const [draft, setDraft] = useState('NezuUIをもっと正確にする')
  const [reply, setReply] = useState(true)
  const [agentEnabled, setAgentEnabled] = useState(true)
  const [mute, setMute] = useState(false)
  const [groupChat, setGroupChat] = useState(true)
  const [feedback, setFeedback] = useState('')

  return (
    <div className="nu-vyline-preview vy-message-input-demo">
      <div className="vy-preview-toolbar" aria-label="プレビュー状態">
        <button type="button" aria-pressed={reply} onClick={() => setReply((v) => !v)}>返信</button>
        <button type="button" aria-pressed={agentEnabled} onClick={() => setAgentEnabled((v) => !v)}>Agent I</button>
        <button type="button" aria-pressed={groupChat} onClick={() => setGroupChat((v) => !v)}>{groupChat ? 'グループ' : '1:1'}</button>
        <button type="button" onClick={() => setDraft('')}>空入力</button>
        {feedback && <span role="status">{feedback}</span>}
      </div>
      <MessageComposer
        value={draft}
        onValueChange={(value) => { setDraft(value); setFeedback('') }}
        onSend={(payload) => {
          setDraft('')
          setFeedback(payload.muted ? 'ミュート送信しました' : '送信しました')
        }}
        onSendSticker={(glyph, mutedMessage) => setFeedback(`${glyph} を${mutedMessage ? 'ミュートで' : ''}送信しました`)}
        onCreate={(id) => setFeedback(`${id} を選択しました`)}
        isGroupChat={groupChat}
        mute={mute}
        onMuteChange={setMute}
        aiEnabled={agentEnabled}
        reply={reply ? { author: 'ねずみさん', text: '細かいUIまで全部まとめたい' } : undefined}
        onDismissReply={() => setReply(false)}
        menuItems={[
          { id: 'event', label: 'イベント作成', description: '日程と場所を決めて共有', onSelect: () => setFeedback('イベント作成を選択しました') },
          { id: 'amidakuji', label: 'あみだくじ', description: 'メンバーでくじ引き', groupOnly: true, onSelect: () => setFeedback('あみだくじを選択しました') },
          { id: 'poll', label: 'アンケート', description: '選択肢を作って投票', onSelect: () => setFeedback('アンケートを選択しました') },
        ]}
        onRecord={() => setFeedback('')}
        onCancelRecording={() => setFeedback('録音をキャンセルしました')}
        onSendRecording={(seconds) => setFeedback(`音声メッセージ ${seconds}秒 を送信しました`)}
      />
    </div>
  )
}

export function VylineMentionPickerPreview() {
  const [selected, setSelected] = useState(0)
  const options = [
    { name: '@All', all: true },
    { name: 'ねずみさん', all: false },
    { name: 'Vyline Dev', all: false },
  ]
  return (
    <div className="nu-vyline-preview vy-mention-picker">
      <p>@でメンション</p>
      {options.map((option, index) => (
        <button
          type="button"
          className={selected === index ? 'selected' : ''}
          key={option.name}
          onMouseEnter={() => setSelected(index)}
          onClick={() => setSelected(index)}
        >
          <span className={`vy-mention-avatar ${option.all ? 'all' : ''}`}>
            {option.all ? <IconAtSign size={12} /> : option.name.charAt(0).toUpperCase()}
          </span>
          <span className={option.all ? 'strong' : ''}>{option.name}</span>
        </button>
      ))}
    </div>
  )
}

export function VylineRecordingPreview() {
  const [recording, setRecording] = useState(true)
  const [seconds, setSeconds] = useState(12)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!recording) return
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [recording])

  return (
    <div className="nu-vyline-preview vy-message-input-demo">
      {!recording && <div className="vy-preview-toolbar"><button type="button" onClick={() => { setSeconds(0); setStatus(''); setRecording(true) }}>もう一度録音</button>{status && <span role="status">{status}</span>}</div>}
      <MessageComposer
        value=""
        onValueChange={() => {}}
        onSend={() => {}}
        recording={recording}
        recordingSeconds={seconds}
        onCancelRecording={() => { setRecording(false); setStatus('録音をキャンセルしました') }}
        onSendRecording={() => { setRecording(false); setStatus('音声メッセージを送信しました') }}
      />
    </div>
  )
}

type ContextItem = {
  label: string
  icon: React.ReactNode
  danger?: boolean
  children?: ContextItem[]
}

export function VylineContextMenuPreview() {
  const root = useMemo<ContextItem[]>(() => [
    { label: 'リプライ', icon: <IconReply size={16} /> },
    {
      label: 'リアクション',
      icon: <IconHeart size={16} />,
      children: [
        { label: 'リアクションを取り消す', icon: <IconClose size={16} /> },
        { label: 'いいね', icon: <span>👍</span> },
        { label: '愛してる', icon: <span>❤️</span> },
        { label: '面白い', icon: <span>😆</span> },
        { label: 'すごい', icon: <span>🎉</span> },
        { label: '悲しい', icon: <span>😢</span> },
        { label: 'びっくり', icon: <span>😲</span> },
      ],
    },
    { label: 'コピー', icon: <IconCopy size={16} /> },
    {
      label: 'ダウンロード',
      icon: <IconDownload size={16} />,
      children: [
        { label: 'アニメーション画像', icon: <IconDownload size={16} /> },
        { label: '通常画像', icon: <IconDownload size={16} /> },
      ],
    },
    { label: '既読にする', icon: <IconCheck size={16} /> },
    { label: '編集', icon: <IconEdit size={16} /> },
    { label: '編集前のメッセージを表示', icon: <IconEdit size={16} /> },
    { label: '履歴を表示', icon: <IconChevron size={16} /> },
    { label: '復元', icon: <IconCheck size={16} /> },
    { label: '送信を取り消し', icon: <IconTrash size={16} />, danger: true },
    { label: 'アナウンスを追加', icon: <IconPin size={16} /> },
  ], [])
  const [stack, setStack] = useState<ContextItem[][]>([root])
  const current = stack[stack.length - 1] ?? root

  return (
    <div className="nu-vyline-preview vy-context-shell">
      <div className="vy-context-menu" role="menu" aria-label="操作メニュー">
        {stack.length > 1 && (
          <button type="button" className="vy-context-back" onClick={() => setStack((s) => s.slice(0, -1))}>
            <span>←</span>戻る
          </button>
        )}
        {current.map((item) => (
          <button
            type="button"
            role="menuitem"
            key={item.label}
            className={item.danger ? 'danger' : ''}
            onClick={() => item.children?.length && setStack((s) => [...s, item.children!])}
          >
            <span className="vy-context-icon">{item.icon}</span>
            {item.label}
            {item.children?.length ? <span className="vy-context-chevron">›</span> : null}
          </button>
        ))}
      </div>
    </div>
  )
}

function CallEvent({
  video = false,
  group = false,
  outcome = 'ended',
  durationSec = 125,
  isMe = false,
}: {
  video?: boolean
  group?: boolean
  outcome?: 'ended' | 'missed' | 'declined' | 'busy'
  durationSec?: number
  isMe?: boolean
}) {
  const kind = group ? (video ? 'グループビデオ通話' : 'グループ通話') : video ? 'ビデオ通話' : '音声通話'
  const missed = outcome === 'missed' || outcome === 'declined'
  const title = outcome === 'missed' ? `不在着信 · ${kind}` : outcome === 'declined' ? `拒否 · ${kind}` : outcome === 'busy' ? `話中 · ${kind}` : kind
  const minutes = Math.floor(durationSec / 60)
  const seconds = durationSec % 60
  const detail = outcome === 'ended'
    ? durationSec > 0
      ? `通話時間 ${minutes ? `${minutes}分${seconds.toString().padStart(2, '0')}秒` : `${seconds}秒`}`
      : '通話が終了しました'
    : undefined

  return (
    <div className="vy-call-event-wrap">
      <div className={`vy-call-event ${missed ? 'missed' : ''}`} role="status" aria-label={title}>
        <span className="vy-call-event-icon">{video ? <IconVideo size={18} /> : <IconPhone size={18} />}</span>
        <div>
          <strong>{title}</strong>
          {detail && <small>{isMe ? `あなた · ${detail}` : detail}</small>}
        </div>
      </div>
    </div>
  )
}

export function VylineCallEventPreview() {
  return (
    <div className="nu-vyline-preview vy-call-events">
      <CallEvent isMe />
      <CallEvent video outcome="missed" />
      <CallEvent group video outcome="busy" />
    </div>
  )
}

type CallState = 'starting' | 'acquiring' | 'connecting' | 'ringing' | 'in-call' | 'ending' | 'failed' | 'ended'

export function VylineCallOverlayPreview() {
  const [muted, setMuted] = useState(false)
  const [kind, setKind] = useState<'voice' | 'video'>('voice')
  const [state, setState] = useState<CallState>('in-call')
  const labels: Record<CallState, string> = {
    starting: '発信準備中…',
    acquiring: 'ルート取得中…',
    connecting: '接続中…',
    ringing: '呼び出し中…（相手の応答を待っています）',
    'in-call': kind === 'video' ? 'ビデオ通話中' : '通話中',
    ending: '終了中…',
    failed: '接続失敗',
    ended: '通話終了',
  }
  const connected = state === 'in-call'
  const pulse = !connected && state !== 'failed'

  return (
    <div className="nu-vyline-preview vy-call-demo">
      <div className="vy-preview-toolbar">
        <button type="button" aria-pressed={kind === 'voice'} onClick={() => setKind('voice')}>voice</button>
        <button type="button" aria-pressed={kind === 'video'} onClick={() => setKind('video')}>video</button>
        <select value={state} aria-label="通話状態" onChange={(e) => setState(e.target.value as CallState)}>
          {(['starting', 'acquiring', 'connecting', 'ringing', 'in-call', 'ending', 'failed', 'ended'] as CallState[]).map((value) => <option key={value}>{value}</option>)}
        </select>
      </div>
      <div className="vy-call-overlay-preview">
        <div className="vy-call-person">
          <div className={`vy-call-avatar-wrap ${pulse ? 'is-pulsing' : ''}`}><Avatar glyph="ね" color="#52796f" size={128} /></div>
          <div>
            <h4>ねずみさん</h4>
            <p>{labels[state]}</p>
            {connected && <strong>2:05</strong>}
          </div>
        </div>
        <div className="vy-call-controls">
          <button type="button" onClick={() => setMuted((v) => !v)} aria-label={muted ? 'ミュート解除' : 'ミュート'}>{muted ? <IconMicOff size={22} /> : <IconMic size={22} />}</button>
          {kind === 'video' && <button type="button" aria-label="カメラ切替"><IconVideo size={22} /></button>}
          <button type="button" className="hangup" aria-label="通話を終了"><IconPhone size={26} /></button>
        </div>
      </div>
    </div>
  )
}

export function VylineEditMessageDialogPreview() {
  const initial = 'NezuUIの表示をVylineと同じにする'
  const [text, setText] = useState(`${initial}。`)
  const changed = text.trim().length > 0 && text.trim() !== initial.trim()
  return (
    <div className="nu-vyline-preview vy-local-modal-stage">
      <div className="vy-local-backdrop" />
      <div className="vy-edit-dialog" role="dialog" aria-modal="true" aria-label="メッセージを編集">
        <div className="vy-edit-head">
          <div><span><IconEdit size={16} /></span><strong>メッセージを編集</strong></div>
          <button type="button" aria-label="閉じる"><IconClose size={16} /></button>
        </div>
        <div className="vy-edit-body">
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
          <div><span>Enter / Ctrl+Enter で保存 · Esc でキャンセル</span><span>{text.length} 文字</span></div>
        </div>
        <div className="vy-edit-footer">
          <button type="button">キャンセル</button>
          <button type="button" className="save" disabled={!changed}>保存する</button>
        </div>
      </div>
    </div>
  )
}

export function VylineMediaLightboxPreview() {
  const [video, setVideo] = useState(false)
  return (
    <div className="nu-vyline-preview vy-media-demo">
      <div className="vy-preview-toolbar">
        <button type="button" aria-pressed={!video} onClick={() => setVideo(false)}>image</button>
        <button type="button" aria-pressed={video} onClick={() => setVideo(true)}>video</button>
      </div>
      <div className="vy-lightbox-local" role="dialog" aria-modal="true" aria-label="メディア">
        <button type="button" className="vy-lightbox-close" aria-label="閉じる"><IconClose size={20} /></button>
        {video ? (
          <div className="vy-video-placeholder"><IconVideo size={40} /><span>video controls</span></div>
        ) : (
          <img src={richImage} alt="メディア" />
        )}
      </div>
    </div>
  )
}

export function VylineRichMessagePreview() {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className="nu-vyline-preview vy-rich-fallback">リッチメッセージ</div>
  return (
    <div className="nu-vyline-preview vy-rich-stage">
      <div className="vy-rich-message" style={{ aspectRatio: '1.5' }}>
        <img src={richImage} alt="NezuUI Rich Message" onError={() => setFailed(true)} draggable={false} />
        <button type="button" aria-label="リンクを開く" className="vy-rich-hotspot hotspot-a" />
        <button type="button" aria-label="リンクを開く" className="vy-rich-hotspot hotspot-b" />
      </div>
    </div>
  )
}

export function VylineAccountSwitcherPreview() {
  const [open, setOpen] = useState(false)
  return (
    <div className="nu-vyline-preview vy-account-switcher-preview">
      <button type="button" onClick={() => setOpen((value) => !value)}>
        <Avatar glyph="ね" color="var(--vy-accent)" size={36} />
        <span className="vy-account-copy">
          <span className="vy-account-name"><strong>ねずみ</strong><PremiumBadge size={14} compact /></span>
          <small>u1234567890abcdef</small>
        </span>
        <IconChevron size={16} className={open ? 'is-open' : ''} />
      </button>
      {open && (
        <div className="vy-account-menu">
          <button type="button">
            <Avatar glyph="S" color="var(--vy-accent)" size={28} />
            <span className="vy-account-copy">
              <span className="vy-account-name"><strong>Sub Account</strong><PremiumBadge size={12} compact /></span>
              <small>uabcdef1234567890</small>
            </span>
          </button>
          <button type="button" className="vy-account-action">
            <span className="vy-account-action-icon"><IconPlus size={14} /></span>
            アカウントを追加
          </button>
          <button type="button" className="vy-account-action is-danger">
            <span className="vy-account-action-icon"><IconLogout size={14} /></span>
            ログアウト
          </button>
        </div>
      )}
    </div>
  )
}

export function VylineSourceOnlyPreview({ title, details }: { title: string; details: string }) {
  return (
    <div className="nu-vyline-preview vy-source-only">
      <IconMemo size={22} />
      <div>
        <strong>{title}</strong>
        <span>{details}</span>
        <small>Vylineソースは棚卸し済み。実表示の移植が完了するまで推測プレビューは表示しません。</small>
      </div>
    </div>
  )
}
