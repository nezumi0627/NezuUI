import { useState } from 'react'
import {
  Avatar,
  OfficialBadge,
  PremiumBadge,
  Toggle,
  VylineAccountSwitcherPreview,
  VylineCallEventPreview,
  VylineCallOverlayPreview,
  VylineChatRowPreview,
  VylineContextMenuPreview,
  VylineEditMessageDialogPreview,
  VylineMediaLightboxPreview,
  VylineMentionPickerPreview,
  VylineMessageBubblePreview,
  VylineMessageInputPreview,
  VylineRecordingPreview,
  VylineRichMessagePreview,
  VylineSourceOnlyPreview,
} from './components'
import { IconMemo } from './components/icons'
import type { UiInventoryItem } from './data/vyline-ui'

const avatarImage = 'data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2232%22 fill=%22%232aabee%22/%3E%3Ccircle cx=%2232%22 cy=%2225%22 r=%2212%22 fill=%22white%22/%3E%3Cpath d=%22M14 58c2-13 10-20 18-20s16 7 18 20%22 fill=%22white%22/%3E%3C/svg%3E'

function TogglePreview() {
  const [checked, setChecked] = useState(true)
  return <div className="nu-demo-stack"><div className="nu-demo-row"><span>{checked ? 'ON' : 'OFF'}</span><Toggle checked={checked} onCheckedChange={setChecked} label="Toggle preview" /></div></div>
}

function AvatarPreview() {
  const [size, setSize] = useState(44)
  return <div className="nu-avatar-preview"><div className="vy-preview-toolbar" aria-label="アバタープレビュー設定">{[32, 44, 56, 72].map((value) => <button type="button" key={value} aria-pressed={size === value} onClick={() => setSize(value)}>{value}px</button>)}</div><div className="nu-avatar-row nu-avatar-states"><div><Avatar glyph="N" color="#4a8578" size={size} /><small>glyph</small></div><div><Avatar imageUrl={avatarImage} color="#2aabee" size={size} alt="画像アバター" /><small>image</small></div><div><Avatar color="#6088af" size={size} icon={<IconMemo size={Math.max(16, Math.round(size * .48))} />} /><small>icon</small></div><div><Avatar glyph="あ" color="#a47d56" size={size} online /><small>online</small></div><div><Avatar glyph="ゆ" color="#6861a3" size={size} ring /><small>ring</small></div><div><Avatar glyph="ね" color="#397f65" size={size} ring online /><small>both</small></div></div></div>
}

function Card({ title, detail, children }: { title: string; detail: string; children: React.ReactNode }) {
  return <article className="nu-specimen"><div className="nu-specimen-head"><h3>{title}</h3><span className="nu-tag nu-tag-live">Vyline実装準拠</span></div><div className="nu-stage">{children}</div><div className="nu-specimen-foot"><p>{detail}</p><span>Vylineで使用中</span></div></article>
}

export function VylineComponentsCatalog({
  enabled,
  setEnabled,
  setNotice,
  copied,
  copy,
}: {
  enabled: boolean
  setEnabled: (value: boolean) => void
  setNotice: (value: boolean) => void
  copied: boolean
  copy: () => Promise<void>
}) {
  return <>
    <div className="nu-section-heading"><h2>Vyline実コードから再構成</h2><span>LIVE PREVIEWS <i className="nu-dot" /></span></div>
    <div className="nu-grid">
      <Card title="Toggle" detail="vy-ui.tsx · ON / OFF / disabled">
        <div className="nu-demo-stack"><div className="nu-demo-row"><span>通知を受け取る</span><Toggle checked={enabled} onCheckedChange={setEnabled} label="通知を受け取る" /></div><div className="nu-demo-row"><span>無効なスイッチ</span><Toggle checked={false} disabled onCheckedChange={() => {}} label="無効なスイッチ" /></div></div>
      </Card>
      <Card title="Avatar" detail="vy-ui.tsx · image / glyph / icon / online / ring / size">
        <div className="nu-avatar-row nu-avatar-states">
          <div><Avatar glyph="N" color="#4a8578" size={32} /><small>glyph</small></div>
          <div><Avatar imageUrl={avatarImage} color="#2aabee" size={44} alt="画像アバター" /><small>image</small></div>
          <div><Avatar color="#6088af" size={44} icon={<IconMemo size={22} />} /><small>icon</small></div>
          <div><Avatar glyph="あ" color="#a47d56" size={48} online /><small>online</small></div>
          <div><Avatar glyph="ゆ" color="#6861a3" size={56} ring /><small>ring</small></div>
          <div><Avatar glyph="ね" color="#397f65" size={72} ring online /><small>both</small></div>
        </div>
      </Card>
      <Card title="OfficialBadge" detail="official-badge.tsx · 14px / #06c755 / white check">
        <div className="nu-vyline-preview nu-demo-row"><Avatar glyph="L" color="#06c755" size={38} /><strong>LINE公式アカウント</strong><OfficialBadge /></div>
      </Card>
      <Card title="PremiumBadge" detail="premium-badge.tsx · default / 24 / 32 / compact">
        <div className="nu-vyline-preview nu-demo-row"><PremiumBadge /><PremiumBadge size={24} /><PremiumBadge size={32} /><PremiumBadge compact size={18} /></div>
      </Card>
      <Card title="FloatNotice" detail="float-notice.tsx · Vylineの一時通知">
        <button type="button" className="nu-button" onClick={() => setNotice(true)}>通知を表示</button>
      </Card>
      <Card title="ChatRow" detail="sidebar.tsx · official / pin / mute / time / unread / online"><VylineChatRowPreview /></Card>
      <Card title="AccountSwitcher" detail="sidebar.tsx · avatar / premium / account id / chevron"><VylineAccountSwitcherPreview /></Card>
      <Card title="MessageBubble" detail="message-bubble.tsx · separate meta / read / reply / reactions"><VylineMessageBubblePreview /></Card>
      <Card title="MessageInput" detail="message-input.tsx · plus / attachment / sticker / mute / AI / textarea / send"><VylineMessageInputPreview /></Card>
      <Card title="Mention picker" detail="message-input.tsx · @All / member candidate"><VylineMentionPickerPreview /></Card>
      <Card title="Recording state" detail="message-input.tsx · recording card / waveform / cancel / send"><VylineRecordingPreview /></Card>
      <Card title="MessageContextMenu" detail="message-context-menu.tsx · children submenu / 戻る / danger"><VylineContextMenuPreview /></Card>
      <Card title="EditMessageDialog" detail="edit-message-dialog.tsx · textarea / count / save / cancel"><VylineEditMessageDialogPreview /></Card>
      <Card title="MediaLightbox" detail="media-lightbox.tsx · image / video / close"><VylineMediaLightboxPreview /></Card>
      <Card title="RichMessageView" detail="rich-message.tsx · image map / hotspot / fallback"><VylineRichMessagePreview /></Card>
      <Card title="CallEventMessage" detail="call-event-message.tsx · centered history card / ended / missed"><VylineCallEventPreview /></Card>
      <Card title="CallOverlay" detail="call-overlay.tsx · avatar / state / duration / controls"><VylineCallOverlayPreview /></Card>
      <Card title="Portable import" detail="NezuUI export · presentation-only components">
        <div className="nu-demo-stack"><code>import {'{ Avatar, OfficialBadge }'} from './components'</code><button type="button" className="nu-button" onClick={() => void copy()}>{copied ? 'コピーしました' : 'コードをコピー'}</button></div>
      </Card>
    </div>
    <p className="nu-note">Vylineのstore・APIには依存させず、表示と操作だけを実コードから移植しています。未移植の項目は推測UIを出さず、元ソース参照として表示します。</p>
  </>
}

export function VylineInventoryPreview({ item }: { item: UiInventoryItem }) {
  switch (item.title) {
    case 'Toggle': return <TogglePreview />
    case 'Avatar': return <AvatarPreview />
    case 'OfficialBadge': return <div className="nu-vyline-preview nu-demo-row"><strong>公式アカウント</strong><OfficialBadge /></div>
    case 'PremiumBadge': return <div className="nu-vyline-preview nu-demo-row"><PremiumBadge /><PremiumBadge size={24} /><PremiumBadge size={32} /><PremiumBadge compact size={18} /></div>
    case 'ChatRow': return <VylineChatRowPreview />
    case 'AccountSwitcher': return <VylineAccountSwitcherPreview />
    case 'MessageBubble':
    case 'ReplyQuote':
    case 'ReactionBadges': return <VylineMessageBubblePreview />
    case 'MessageInput': return <VylineMessageInputPreview />
    case 'Mention picker': return <VylineMentionPickerPreview />
    case 'Reply preview': return <VylineMessageInputPreview />
    case 'Recording state': return <VylineRecordingPreview />
    case 'MessageContextMenu': return <VylineContextMenuPreview />
    case 'EditMessageDialog': return <VylineEditMessageDialogPreview />
    case 'MediaLightbox': return <VylineMediaLightboxPreview />
    case 'RichMessageView': return <VylineRichMessagePreview />
    case 'CallEventMessage': return <VylineCallEventPreview />
    case 'CallOverlay': return <VylineCallOverlayPreview />
    default: return <VylineSourceOnlyPreview title={item.title} details={item.details} />
  }
}
