import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  IconArrowUp,
  IconBellOff,
  IconCheck,
  IconClose,
  IconMic,
  IconPaperclip,
  IconPlay,
  IconPlus,
  IconSmile,
  IconSpark,
} from './icons'
import './message-composer.css'

const MAX_TEXTAREA_HEIGHT = 132
const MAX_ATTACHMENTS = 8

type ComposerStatus = 'idle' | 'sending' | 'sent'
type ComposerPanel = 'none' | 'plus' | 'sticker'
type StickerTab = 'sticker' | 'emoji'

export type MessageComposerAttachment = {
  id: string
  src: string
  kind?: 'image' | 'video'
  name?: string
  alt?: string
}

export type MessageComposerMenuItem = {
  id: string
  label: string
  description: string
  disabled?: boolean
  groupOnly?: boolean
  onSelect?: () => void
}

export type MessageComposerReply = {
  author: string
  text: string
}

export type MessageComposerSendPayload = {
  text: string
  attachments: MessageComposerAttachment[]
  muted: boolean
}

export type MessageComposerProps = {
  value: string
  onValueChange: (value: string) => void
  onSend: (payload: MessageComposerSendPayload) => void
  placeholder?: string
  attachments?: MessageComposerAttachment[]
  onAttachmentsChange?: (attachments: MessageComposerAttachment[]) => void
  onAttachClick?: () => void
  onSendSticker?: (glyph: string, muted: boolean) => void
  onCreate?: (id: string, muted: boolean) => void
  isGroupChat?: boolean
  mute?: boolean
  onMuteChange?: (value: boolean) => void
  aiEnabled?: boolean
  onPolish?: (value: string) => string
  reply?: MessageComposerReply
  onDismissReply?: () => void
  menuItems?: MessageComposerMenuItem[]
  enterToSend?: boolean
  recording?: boolean
  recordingSeconds?: number
  onRecord?: () => void
  onCancelRecording?: () => void
  onSendRecording?: (seconds: number, muted: boolean) => void
  disabled?: boolean
}

const defaultMenuItems: MessageComposerMenuItem[] = [
  { id: 'event', label: 'イベント作成', description: '日程と場所を決めて共有' },
  { id: 'amidakuji', label: 'あみだくじ', description: 'メンバーでくじ引き', groupOnly: true },
  { id: 'poll', label: 'アンケート', description: '選択肢を作って投票' },
]

const stickers = [
  ['🐻', 'くま'], ['🐰', 'うさぎ'], ['🐣', 'ひな'], ['🎉', 'おめでとう'],
  ['🙏', 'おねがい'], ['💤', 'おやすみ'], ['🍰', 'ケーキ'], ['☕️', 'ひとやすみ'],
] as const

const lineEmoji = [
  ['✿', 'はな'], ['★', 'ほし'], ['♪', 'おんぷ'], ['❤', 'はーと'],
  ['☺', 'にこ'], ['✔', 'チェック'], ['☂', 'かさ'], ['✈', 'ひこうき'],
  ['☀', 'たいよう'], ['☁', 'くも'], ['✂', 'はさみ'], ['☎', 'でんわ'],
] as const

function polishText(input: string) {
  const tidied = input
    .replace(/\s+/g, ' ')
    .replace(/\s*([、。！？])\s*/g, '$1')
    .replace(/[!]{2,}/g, '！')
    .replace(/[?]{2,}/g, '？')
    .replace(/!/g, '！')
    .replace(/\?/g, '？')
    .trim()
  if (!tidied) return ''
  return /[。！？…]$/.test(tidied) ? tidied : `${tidied}。`
}

function ToolButton({ label, active, pressed, disabled, children, onClick }: {
  label: string
  active?: boolean
  pressed?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return <button type="button" className={`nezu-message-composer-icon ${active ? 'is-active' : ''}`} aria-label={label} title={label} aria-pressed={pressed} disabled={disabled} onClick={onClick}>{children}</button>
}

function MenuGlyph({ kind }: { kind: string }) {
  if (kind === 'event') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M8 3.5v4M16 3.5v4M4 9.5h16M12 12v5M9.5 14.5h5" /></svg>
  if (kind === 'amidakuji') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v16M18 4v16M6 8h6v4h6M6 16h7v-3h5" /></svg>
  if (kind === 'poll') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="m7.5 9 1.5 1.5L11.5 8M13.5 9H17M7.5 15l1.5 1.5 2.5-2.5M13.5 15H17" /></svg>
  return <IconPlus size={18} />
}

export function MessageComposer({
  value,
  onValueChange,
  onSend,
  placeholder = 'メッセージを入力',
  attachments,
  onAttachmentsChange,
  onAttachClick,
  onSendSticker,
  onCreate,
  isGroupChat = true,
  mute,
  onMuteChange,
  aiEnabled = false,
  onPolish,
  reply,
  onDismissReply,
  menuItems = defaultMenuItems,
  enterToSend = true,
  recording,
  recordingSeconds,
  onRecord,
  onCancelRecording,
  onSendRecording,
  disabled = false,
}: MessageComposerProps) {
  const [focused, setFocused] = useState(false)
  const [panel, setPanel] = useState<ComposerPanel>('none')
  const [stickerTab, setStickerTab] = useState<StickerTab>('sticker')
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<ComposerStatus>('idle')
  const [polishing, setPolishing] = useState(false)
  const [undoValue, setUndoValue] = useState<string | null>(null)
  const [localAttachments, setLocalAttachments] = useState<MessageComposerAttachment[]>([])
  const [localMute, setLocalMute] = useState(false)
  const [localRecording, setLocalRecording] = useState(false)
  const [localRecordingSeconds, setLocalRecordingSeconds] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef(0)
  const composingRef = useRef(false)

  const visibleAttachments = attachments ?? localAttachments
  const muted = mute ?? localMute
  const activeRecording = recording ?? localRecording
  const seconds = recordingSeconds ?? localRecordingSeconds
  const hasContent = value.trim().length > 0 || visibleAttachments.length > 0
  const canSubmit = hasContent && status === 'idle' && !polishing && !disabled

  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.style.height = 'auto'
    input.style.height = `${Math.min(input.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`
  }, [value, activeRecording])

  useEffect(() => {
    if (panel === 'none') return
    const closeOutside = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setPanel('none')
    }
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel('none')
    }
    document.addEventListener('mousedown', closeOutside)
    document.addEventListener('keydown', closeWithEscape)
    return () => {
      document.removeEventListener('mousedown', closeOutside)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [panel])

  useEffect(() => {
    if (!undoValue) return
    const timer = window.setTimeout(() => setUndoValue(null), 6000)
    return () => window.clearTimeout(timer)
  }, [undoValue])

  useEffect(() => {
    if (!activeRecording || recordingSeconds !== undefined) return
    const timer = window.setInterval(() => setLocalRecordingSeconds((current) => current + 1), 1000)
    return () => window.clearInterval(timer)
  }, [activeRecording, recordingSeconds])

  const setAttachmentList = (next: MessageComposerAttachment[]) => {
    if (attachments === undefined) setLocalAttachments(next)
    onAttachmentsChange?.(next)
  }

  const setMuted = (next: boolean) => {
    if (mute === undefined) setLocalMute(next)
    onMuteChange?.(next)
  }

  const addFiles = (files: FileList | File[]) => {
    const available = MAX_ATTACHMENTS - visibleAttachments.length
    if (available <= 0) return
    const next = Array.from(files)
      .filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))
      .slice(0, available)
      .map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
        src: URL.createObjectURL(file),
        name: file.name || '添付ファイル',
        alt: file.name || '添付ファイル',
        kind: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
      }))
    if (next.length) setAttachmentList([...visibleAttachments, ...next].slice(0, MAX_ATTACHMENTS))
  }

  const removeAttachment = (id: string) => {
    const removed = visibleAttachments.find((item) => item.id === id)
    if (removed?.src.startsWith('blob:')) URL.revokeObjectURL(removed.src)
    setAttachmentList(visibleAttachments.filter((item) => item.id !== id))
  }

  const clearOwnedAttachments = () => {
    if (attachments !== undefined) return
    visibleAttachments.forEach((item) => {
      if (item.src.startsWith('blob:')) URL.revokeObjectURL(item.src)
    })
    setLocalAttachments([])
    onAttachmentsChange?.([])
  }

  const insertEmoji = (glyph: string) => {
    const caret = Math.min(caretRef.current, value.length)
    const next = `${value.slice(0, caret)}${glyph}${value.slice(caret)}`
    const nextCaret = caret + glyph.length
    caretRef.current = nextCaret
    onValueChange(next)
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(nextCaret, nextCaret)
    })
  }

  const runPolish = () => {
    const before = value
    setPolishing(true)
    window.setTimeout(() => {
      const after = (onPolish ?? polishText)(before)
      onValueChange(after)
      setPolishing(false)
      setUndoValue(after === before ? null : before)
      inputRef.current?.focus()
    }, 550)
  }

  const flashSent = (send: () => void) => {
    setStatus('sending')
    setPanel('none')
    setUndoValue(null)
    window.setTimeout(() => {
      send()
      setStatus('sent')
      window.setTimeout(() => setStatus('idle'), 800)
    }, 420)
  }

  const submit = () => {
    if (!canSubmit) return
    const payload = { text: value.trim(), attachments: visibleAttachments, muted }
    flashSent(() => {
      onSend(payload)
      clearOwnedAttachments()
    })
  }

  const startRecording = () => {
    setPanel('none')
    setLocalRecordingSeconds(0)
    if (recording === undefined) setLocalRecording(true)
    onRecord?.()
  }

  const cancelRecording = () => {
    if (recording === undefined) setLocalRecording(false)
    setLocalRecordingSeconds(0)
    onCancelRecording?.()
  }

  const sendRecording = () => {
    const duration = Math.max(1, seconds)
    if (recording === undefined) setLocalRecording(false)
    setLocalRecordingSeconds(0)
    flashSent(() => onSendRecording?.(duration, muted))
  }

  const hint = polishing ? 'Agent I が文章を整えています…'
    : status === 'sending' ? '送信中…'
      : status === 'sent' ? (muted ? '通知なしで送信しました' : '送信しました')
        : activeRecording ? '録音中 — 送信するか取り消してください'
          : muted ? 'ミュートメッセージ：相手に通知されません'
            : canSubmit ? (enterToSend ? 'Enter で送信 / Shift + Enter で改行' : '送信ボタンで送信')
              : ''

  return <div ref={wrapRef} className="nezu-message-composer-root">
    {reply && <div className="nezu-message-composer-reply"><div><strong>{reply.author} への返信</strong><span>{reply.text}</span></div><button type="button" aria-label="返信をキャンセル" onClick={onDismissReply}><IconClose size={16} /></button></div>}

    {panel === 'plus' && <div className="nezu-message-composer-menu" role="menu" aria-label="作成メニュー">
      {menuItems.map((item) => {
        const locked = Boolean(item.groupOnly) && !isGroupChat
        return <button type="button" role="menuitem" key={item.id} disabled={item.disabled || locked} onClick={() => {
          if (item.disabled || locked) return
          setPanel('none')
          flashSent(() => {
            item.onSelect?.()
            onCreate?.(item.id, muted)
          })
        }}><span className="nezu-message-composer-menu-icon"><MenuGlyph kind={item.id} /></span><span><strong>{item.label}{locked && <small aria-label="グループ限定"> 🔒</small>}</strong><small>{locked ? 'グループ限定' : item.description}</small></span></button>
      })}
    </div>}

    {panel === 'sticker' && <div className="nezu-message-composer-sticker-panel">
      <div className="nezu-message-composer-tabs" role="tablist" aria-label="スタンプ・絵文字">
        <button type="button" role="tab" aria-selected={stickerTab === 'sticker'} onClick={() => setStickerTab('sticker')}>スタンプ</button>
        <button type="button" role="tab" aria-selected={stickerTab === 'emoji'} onClick={() => setStickerTab('emoji')}>LINE絵文字</button>
      </div>
      {stickerTab === 'sticker' ? <div className="nezu-message-composer-sticker-body"><div className="nezu-message-composer-sticker-grid">{stickers.map(([glyph, label]) => <button type="button" key={label} aria-label={`スタンプ ${label}`} onClick={() => { setPanel('none'); flashSent(() => onSendSticker?.(glyph, muted)) }}><span aria-hidden="true">{glyph}</span></button>)}</div><p>続けて送るとコンビネーションスタンプになります</p></div>
        : <div className="nezu-message-composer-sticker-body"><div className="nezu-message-composer-emoji-grid">{lineEmoji.map(([glyph, label]) => <button type="button" key={label} aria-label={`絵文字 ${label}`} onClick={() => insertEmoji(glyph)}><span aria-hidden="true">{glyph}</span></button>)}</div><p>文章のカーソル位置に挿入されます</p></div>}
    </div>}

    <form onSubmit={(event) => { event.preventDefault(); submit() }}>
      <div className={`nezu-message-composer-surface ${focused || panel !== 'none' ? 'is-focused' : ''} ${dragging ? 'is-dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false) }} onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files) }}>
        {dragging && <div className="nezu-message-composer-drop">ここにドロップして添付</div>}

        {visibleAttachments.length > 0 && <ul className="nezu-message-composer-attachments">{visibleAttachments.map((attachment) => <li className="nezu-message-composer-attachment" key={attachment.id}>{attachment.kind === 'video' ? <><video src={attachment.src} muted /><span className="nezu-message-composer-video-play"><IconPlay size={14} /></span></> : <img src={attachment.src} alt={attachment.alt ?? attachment.name ?? ''} />}<button type="button" aria-label={`${attachment.name ?? '添付'} を削除`} onClick={() => removeAttachment(attachment.id)}><IconClose size={12} /></button></li>)}</ul>}

        {activeRecording ? <div className="nezu-message-composer-recording-row"><ToolButton label="録音を取り消す" onClick={cancelRecording}><IconClose size={18} /></ToolButton><span className="nezu-message-composer-recording-time"><i aria-hidden="true" />{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span><span className="nezu-message-composer-wave" aria-hidden="true">{[35, 70, 45, 90, 60, 80, 40, 65, 50, 85, 55, 75].map((height, index) => <i key={index} style={{ height: `${height}%`, animationDelay: `${index * 60}ms` }} />)}</span><button type="button" className="nezu-message-composer-send" aria-label="音声メッセージを送信" onClick={sendRecording}><IconArrowUp size={18} /></button></div>
          : <div className="nezu-message-composer-row">
            <div className="nezu-message-composer-left">
              <ToolButton label="作成メニュー" active={panel === 'plus'} disabled={disabled} onClick={() => setPanel((current) => current === 'plus' ? 'none' : 'plus')}><span className={`nezu-message-composer-plus ${panel === 'plus' ? 'is-open' : ''}`}><IconPlus size={20} /></span></ToolButton>
              <ToolButton label="画像・動画を添付" disabled={disabled} onClick={() => onAttachClick ? onAttachClick() : fileRef.current?.click()}><IconPaperclip size={18} /></ToolButton>
              <ToolButton label="スタンプ・LINE絵文字" active={panel === 'sticker'} disabled={disabled} onClick={() => setPanel((current) => current === 'sticker' ? 'none' : 'sticker')}><IconSmile size={18} /></ToolButton>
              <ToolButton label="ミュートメッセージ" pressed={muted} active={muted} disabled={disabled} onClick={() => setMuted(!muted)}><IconBellOff size={18} /></ToolButton>
            </div>

            <label className="nezu-message-composer-editor"><span className="sr-only">メッセージ</span><textarea ref={inputRef} rows={1} value={value} disabled={disabled || status !== 'idle' || polishing} placeholder={placeholder} onChange={(event) => { onValueChange(event.target.value); caretRef.current = event.target.selectionStart ?? event.target.value.length; if (undoValue) setUndoValue(null) }} onKeyUp={(event) => { caretRef.current = event.currentTarget.selectionStart ?? 0 }} onClick={(event) => { caretRef.current = event.currentTarget.selectionStart ?? 0 }} onCompositionStart={() => { composingRef.current = true }} onCompositionEnd={() => { composingRef.current = false }} onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && enterToSend && !composingRef.current && !event.nativeEvent.isComposing) {
                event.preventDefault()
                submit()
              }
            }} onPaste={(event) => { if (event.clipboardData.files.length) { event.preventDefault(); addFiles(event.clipboardData.files) } }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} /></label>

            <div className="nezu-message-composer-right">
              {aiEnabled && value.trim() && <ToolButton label="AIで文章を整える" disabled={disabled || polishing} onClick={runPolish}><span className={polishing ? 'nezu-message-composer-spin' : ''}><IconSpark size={18} /></span></ToolButton>}
              {canSubmit || status !== 'idle' ? <button type="submit" className="nezu-message-composer-send" aria-label="送信" disabled={disabled || status !== 'idle'}>{status === 'sending' ? <span className="nezu-message-composer-loader" aria-hidden="true" /> : status === 'sent' ? <IconCheck size={16} /> : <IconArrowUp size={18} />}</button> : <button type="button" className="nezu-message-composer-mic" aria-label="音声メッセージを録音" disabled={disabled} onClick={startRecording}><IconMic size={18} /></button>}
            </div>
          </div>}
      </div>

      <input ref={fileRef} type="file" hidden accept="image/*,video/*" multiple onChange={(event) => { if (event.currentTarget.files) addFiles(event.currentTarget.files); event.currentTarget.value = '' }} />

      <div className="nezu-message-composer-hint" aria-live="polite"><span>{hint}</span>{undoValue !== null && <button type="button" className="nezu-message-composer-undo" onClick={() => { onValueChange(undoValue); setUndoValue(null); inputRef.current?.focus() }}><span aria-hidden="true">↶</span>元に戻す</button>}</div>
    </form>
  </div>
}
