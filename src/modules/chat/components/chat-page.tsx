import { useEffect, useRef, useState } from 'react'
import { createHttpClientTransport, messageText } from '@anvia/client'
import { useChat } from '@anvia/react'
import { StreamMarkdown } from '@anvia/react-ui/stream'
import {
  Cat,
  Heart,
  Leaf,
  MessageCircle,
  PanelLeft,
  PawPrint,
  Sparkles,
  ArrowUpRight,
  Check,
  Plus,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '#/components/ui/sheet'
import { ChatSidebar } from './chat-sidebar'
import { ChatComposer } from './chat-composer'
import { ToolActivity } from './tool-activity'
import { loadChatConversation } from '../chat-history.api'

type Conversation = {
  id: string
  title: string
  catId: string | null
  catName: string | null
}
const transport = createHttpClientTransport({
  endpoint: '/api/chat',
  format: 'jsonl',
})
const topics = [
  {
    icon: Heart,
    title: 'Ada perubahan kebiasaan',
    text: 'Apa saja yang perlu dicatat saat kebiasaan kucing berubah?',
    color: 'text-[#a17b55]',
  },
  {
    icon: Leaf,
    title: 'Tanya perawatan harian',
    text: 'Bantu saya menyusun rutinitas perawatan kucing.',
    color: 'text-[#718567]',
  },
  {
    icon: Cat,
    title: 'Kenali profil si kecil',
    text: 'Informasi apa yang perlu saya isi di profil kucing?',
    color: 'text-[#687e93]',
  },
]

export function ChatPage({
  name,
  initialConversations,
  cats,
}: {
  name: string
  initialConversations: Array<Conversation>
  cats: Array<{ id: string; name: string }>
}) {
  const chat = useChat({ transport })
  const [sidebar, setSidebar] = useState(true)
  const [mobile, setMobile] = useState(false)
  const [conversations, setConversations] = useState<Array<Conversation>>(
    () => initialConversations,
  )
  const [selectedCatId, setSelectedCatId] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState({ text: '', key: 0 })
  const bottom = useRef<HTMLDivElement>(null)
  const loadSequence = useRef(0)
  const active = conversations.find((item) => item.id === activeId)
  const chatCatId = active ? active.catId : selectedCatId
  const selectedCat = cats.find((cat) => cat.id === chatCatId)
  const busy = chat.status === 'submitted' || chat.status === 'streaming'
  const locked = busy || loadingId !== null
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [activeId, chat.messages])
  function newChat() {
    if (busy) return
    loadSequence.current += 1
    setLoadingId(null)
    setHistoryError(null)
    chat.reset()
    setActiveId(null)
    setSelectedCatId('')
    setSuggestion((prev) => ({ text: '', key: prev.key + 1 }))
    setMobile(false)
  }
  async function selectChat(id: string) {
    if (busy) return
    const selected = conversations.find((item) => item.id === id)
    if (!selected) return
    const sequence = ++loadSequence.current
    setLoadingId(id)
    setHistoryError(null)
    try {
      const result = await loadChatConversation({ data: { id } })
      if (sequence !== loadSequence.current) return
      chat.reset()
      chat.setMessages(result.messages)
      setConversations((items) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                catId: result.catId,
                catName: result.catName,
              }
            : item,
        ),
      )
      setActiveId(id)
      setSuggestion((prev) => ({ text: '', key: prev.key + 1 }))
      setMobile(false)
    } catch {
      if (sequence === loadSequence.current) {
        setHistoryError('Percakapan gagal dimuat. Silakan coba lagi.')
      }
    } finally {
      if (sequence === loadSequence.current) setLoadingId(null)
    }
  }
  function send(message: string) {
    if (locked) return
    if (!selectedCat) {
      setHistoryError('Pilih kucing sebelum memulai percakapan.')
      return
    }
    setHistoryError(null)
    const id = activeId ?? crypto.randomUUID()
    if (!activeId) {
      chat.reset()
      setConversations((items) => [
        {
          id,
          title: message.slice(0, 80),
          catId: selectedCat.id,
          catName: selectedCat.name,
        },
        ...items,
      ])
      setActiveId(id)
    }
    void chat
      .sendMessage({
        text: message,
        metadata: { sessionId: id, catId: selectedCat.id },
      })
      .catch(() => {
        // useChat exposes the error through chat.error.
      })
  }
  const sidebarProps = {
    name,
    conversations,
    activeId,
    onSelect: selectChat,
    onNew: newChat,
    loadingId,
    disabled: locked,
  }
  return (
    <div className="flex h-dvh overflow-hidden bg-[#fafbf8] font-sans text-[#263e32] selection:bg-[#dce6d4] [&_button]:transition-colors [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-4 [&_button]:focus-visible:outline-[#7b916e]">
      {sidebar && (
        <aside className="hidden w-[252px] shrink-0 border-r border-[#e3e7de] lg:block">
          <ChatSidebar {...sidebarProps} onClose={() => setSidebar(false)} />
        </aside>
      )}
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent
          side="left"
          className="w-[280px] gap-0 border-[#e3e7de] bg-[#f1f3ed] p-0 text-[#263e32] [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Navigasi AnabulCare</SheetTitle>
          <SheetDescription className="sr-only">
            Percakapan dan profil kucing
          </SheetDescription>
          <ChatSidebar {...sidebarProps} onClose={() => setMobile(false)} />
        </SheetContent>
      </Sheet>
      <main className="flex min-w-0 flex-1 flex-col bg-[#fffefa]">
        <header className="flex h-[72px] shrink-0 items-center justify-between gap-3 border-b border-[#eceee6] px-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Buka navigasi"
              onClick={() => setMobile(true)}
              className="rounded-xl p-2 text-[#788273] hover:bg-[#f0f3eb] lg:hidden"
            >
              <PanelLeft size={19} />
            </button>
            {!sidebar && (
              <button
                aria-label="Buka sidebar"
                onClick={() => setSidebar(true)}
                className="hidden rounded-xl p-2 text-[#788273] hover:bg-[#f0f3eb] lg:block"
              >
                <PanelLeft size={19} />
              </button>
            )}
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#edf2e7] text-[#728666]">
              <MessageCircle size={17} />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold">
                {active
                  ? active.catName
                    ? `Cerita ${active.catName}`
                    : 'Percakapan lama'
                  : 'Ruang cerita'}
              </h1>
              <p className="mt-0.5 text-[11px] text-[#899181]">
                {busy
                  ? 'AnabulCare sedang menjawab…'
                  : 'Teman memahami si kecil'}
              </p>
            </div>
          </div>
          <Link
            to="/cats"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-[#e4e8dd] px-3 py-2 text-xs text-[#61715b] hover:bg-[#f1f4ed]"
          >
            <Cat size={15} />
            <span className="hidden sm:inline">Kucingku</span>
            <ArrowUpRight size={13} />
          </Link>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8">
          {!active ? (
            <div className="mx-auto flex min-h-full max-w-[680px] flex-col justify-center py-8 sm:py-12">
              <div className="mb-6 flex items-center justify-center">
                <div className="relative flex size-[76px] items-center justify-center rounded-[28px] bg-[#edf2e5] text-[#718666]">
                  <Cat size={39} strokeWidth={1.35} aria-hidden="true" />
                  <span className="absolute -right-2 -bottom-1 flex size-7 items-center justify-center rounded-full border-4 border-[#fffefa] bg-[#efdfcd] text-[#a27e55]">
                    <Heart size={12} fill="currentColor" aria-hidden="true" />
                  </span>
                </div>
              </div>
              <p className="text-center text-xs text-[#8a9283]">
                Hai, {name.split(' ')[0]} <span aria-hidden="true">🐾</span>
              </p>
              <h2 className="mt-3 text-center font-heading text-[30px] font-medium leading-[1.2] tracking-[-1px] sm:text-[40px]">
                Cerita kecil,
                <br />
                <span className="font-serif italic text-[#7b8e6e]">
                  perhatian sepenuh hati.
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-sm text-center text-[13px] leading-6 text-[#899080]">
                Ada yang berbeda dari si kecil hari ini?
                <br />
                Pilih kucingmu, lalu ceritakan pelan-pelan.
              </p>

              <div className="mt-8 rounded-[22px] border border-[#e7eadf] bg-[#f8f9f3] p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p
                    id="cat-selection-label"
                    className="text-[11px] font-semibold tracking-[0.04em] text-[#7c8771]"
                  >
                    TEMAN CERITA HARI INI
                  </p>
                  <Link
                    to="/cats"
                    className="flex items-center gap-1 text-[11px] text-[#7b8e6e] hover:text-[#284f3d]"
                  >
                    <Plus size={12} />
                    Tambah kucing
                  </Link>
                </div>
                {cats.length ? (
                  <div
                    role="group"
                    aria-labelledby="cat-selection-label"
                    className="flex flex-wrap gap-2"
                  >
                    {cats.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        disabled={locked}
                        aria-pressed={selectedCatId === cat.id}
                        onClick={() => setSelectedCatId(cat.id)}
                        className={`flex min-w-0 max-w-full items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-sm disabled:opacity-50 ${selectedCatId === cat.id ? 'border-[#98ad86] bg-[#e7eddf] text-[#365531]' : 'border-[#e3e7db] bg-[#fffefa] text-[#7a8471] hover:border-[#b6c3aa]'}`}
                      >
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${selectedCatId === cat.id ? 'bg-[#d7e2cb]' : 'bg-[#f0f1e9]'}`}
                        >
                          <Cat size={18} strokeWidth={1.5} />
                        </span>
                        <span className="truncate">{cat.name}</span>
                        {selectedCatId === cat.id && (
                          <Check size={14} className="shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs leading-6 text-[#8a9280]">
                    Belum ada teman kecil di sini.{' '}
                    <Link
                      to="/cats"
                      className="font-medium text-[#527047] underline underline-offset-4"
                    >
                      Tambahkan profil kucingmu
                    </Link>{' '}
                    untuk memulai.
                  </p>
                )}
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {topics.map((topic) => (
                  <button
                    key={topic.title}
                    disabled={locked || !selectedCat}
                    onClick={() =>
                      setSuggestion((prev) => ({
                        text: topic.text,
                        key: prev.key + 1,
                      }))
                    }
                    className="flex items-center gap-2.5 rounded-xl border border-[#e8ebe1] bg-white px-3 py-3 text-left text-[11px] leading-5 text-[#77836b] hover:border-[#b6c3aa] hover:bg-[#f7f9f1] disabled:opacity-45"
                  >
                    <topic.icon
                      size={15}
                      className={`shrink-0 ${topic.color}`}
                    />
                    <span>{topic.title}</span>
                    <ArrowUpRight
                      size={12}
                      className="ml-auto shrink-0 opacity-50"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-[720px] py-7 sm:py-10">
              <div className="mb-8 flex items-center justify-between gap-3 border-b border-[#eceee6] pb-4">
                <div className="flex min-w-0 items-center gap-2 text-xs text-[#89917f]">
                  <PawPrint size={14} />
                  <span className="truncate">
                    {selectedCat
                      ? `Bersama ${selectedCat.name}`
                      : 'Riwayat percakapan'}
                  </span>
                </div>
                <button
                  onClick={newChat}
                  disabled={locked}
                  className="shrink-0 text-[11px] text-[#7b8e6e] hover:text-[#284f3d] disabled:opacity-50"
                >
                  Ganti kucing →
                </button>
              </div>
              {!selectedCat && (
                <p className="mb-6 rounded-xl bg-[#f7f0e5] px-4 py-3 text-xs leading-6 text-[#9a805b]">
                  Profil kucing tidak tersedia. Riwayat ini tetap bisa dibaca;
                  mulai chat baru untuk melanjutkan.
                </p>
              )}
              {chat.messages
                .filter(
                  (message) =>
                    message.role === 'user' || message.role === 'assistant',
                )
                .map((message) => (
                  <div key={message.id} className="mb-7 sm:mb-9">
                    {message.role === 'user' ? (
                      <div className="ml-auto max-w-[88%] rounded-[22px] rounded-br-md bg-[#eaf0e2] px-5 py-3.5 text-sm leading-7 whitespace-pre-wrap break-words text-[#41573a]">
                        {messageText(message)}
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 sm:gap-4">
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#f0f3e9] text-[#7b8e6e]">
                          <PawPrint size={17} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="mb-2 text-[11px] font-medium text-[#8a9580]">
                            AnabulCare
                          </p>
                          <ToolActivity parts={message.parts} />
                          {messageText(message) && (
                            <StreamMarkdown
                              content={messageText(message)}
                              live={busy}
                              className="break-words text-sm leading-7 text-[#46523f] [&_a]:text-[#557847] [&_a]:underline [&_li]:my-1 [&_p]:mb-3"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              {busy && (
                <p
                  role="status"
                  className="flex items-center gap-2 text-xs text-[#8a9580]"
                >
                  <Sparkles size={13} className="animate-pulse" />
                  Sedang merangkai jawaban untuk si kecil…
                </p>
              )}
              <div ref={bottom} />
            </div>
          )}
        </div>

        <div className="shrink-0 bg-[#fffefa] px-5 pt-3 pb-4 sm:px-8 sm:pb-5">
          <div className="mx-auto w-full max-w-[720px]">
            {(historyError || chat.error) && (
              <p
                role="alert"
                className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-700"
              >
                {historyError ||
                  'Pesan belum berhasil dikirim. Silakan coba lagi.'}
              </p>
            )}
            <ChatComposer
              key={`${activeId ?? 'new'}-${suggestion.key}`}
              initialMessage={suggestion.text}
              onSend={send}
              disabled={locked || !selectedCat}
              placeholder={
                selectedCat
                  ? `Ceritakan tentang ${selectedCat.name}...`
                  : 'Pilih kucingmu untuk mulai bercerita...'
              }
              catName={selectedCat?.name}
              busy={busy}
              onStop={chat.stop}
            />
            <p className="mt-3 text-center text-[10px] leading-5 text-[#9ba391]">
              Informasi awal untuk si kecil. Diagnosis dan perawatan bersama
              dokter hewan.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
