import { Link } from '@tanstack/react-router'
import {
  Cat,
  ChevronDown,
  LogOut,
  MessageCircle,
  PanelLeftClose,
  PawPrint,
  Search,
  SquarePen,
} from 'lucide-react'
import { Menu } from '@base-ui/react/menu'
import { useState } from 'react'
import { authClient } from '#/lib/auth/auth-client'
import { toast } from 'sonner'

export function ChatSidebar({
  name,
  conversations,
  activeId,
  onSelect,
  onNew,
  onClose,
  loadingId,
  disabled,
}: {
  name: string
  conversations: Array<{ id: string; title: string; catName: string | null }>
  activeId: string | null
  onSelect: (id: string) => void | Promise<void>
  onNew: () => void
  onClose: () => void
  loadingId: string | null
  disabled: boolean
}) {
  const [search, setSearch] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  async function handlerSignOut() {
    setSigningOut(true)
    try {
      const result = await authClient.signOut()
      if (result.error) throw new Error('Logout failed')
      window.location.assign('/')
    } catch {
      toast.error('Gagal keluar. Silakan coba lagi.')
    } finally {
      setSigningOut(false)
    }
  }
  const filtered = conversations.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  )
  return (
    <div className="flex h-full flex-col bg-[#f3f5ee] text-[#253e32]">
      <div className="flex h-[72px] shrink-0 items-center justify-between px-5">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <PawPrint size={23} className="text-[#718567]" /> Anabul
          <span className="-ml-2 text-[#718567]">Care</span>
        </Link>
        <button
          onClick={onClose}
          aria-label="Tutup sidebar"
          className="rounded-lg p-2 text-[#87917b] hover:bg-[#e9ecdf]"
        >
          <PanelLeftClose size={19} />
        </button>
      </div>
      <div className="space-y-2 px-3 pt-3">
        <button
          disabled={disabled}
          onClick={onNew}
          className="flex w-full items-center gap-3 rounded-xl border border-[#dce3d1] bg-[#fffefa] px-4 py-3 text-xs font-medium text-[#557047] shadow-[0_2px_5px_#3c4f3004] hover:bg-[#eaf0e0] disabled:opacity-50"
        >
          <SquarePen size={18} /> Chat baru{' '}
          <span className="ml-auto text-base text-[#87987a]">+</span>
        </button>
        <label className="flex items-center gap-3 rounded-xl border border-transparent bg-[#e9ede1]/60 px-3 py-2.5 text-[#737a70]">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari percakapan"
            aria-label="Cari percakapan"
            className="w-full bg-transparent text-xs text-[#253e32] outline-none placeholder:text-[#737a70]"
          />
        </label>
        <Link
          to="/cats"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-[#7d8a71] hover:bg-[#e9ecdf]"
        >
          <Cat size={18} /> Profil kucing
        </Link>
      </div>
      <div className="mt-7 min-h-0 flex-1 overflow-y-auto px-3">
        <p className="px-3 text-[9px] font-medium tracking-[0.15em] text-[#737a70]">
          PERCAKAPAN
        </p>
        <div className="mt-3 space-y-1">
          {filtered.map((item) => (
            <button
              key={item.id}
              disabled={disabled}
              onClick={() => onSelect(item.id)}
              aria-current={activeId === item.id ? 'page' : undefined}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-left text-xs transition disabled:opacity-50 ${activeId === item.id ? 'bg-[#fffefa] text-[#49633b] shadow-[0_2px_8px_#3c4f3006]' : 'text-[#87917b] hover:bg-[#e9ecdf]'}`}
            >
              <MessageCircle size={15} className="shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate">{item.title}</span>
                {item.catName && (
                  <span className="mt-1 block truncate text-[10px] text-[#949e87]">
                    {item.catName}
                  </span>
                )}
              </span>
              {loadingId === item.id && (
                <span className="ml-auto text-[10px]">Memuat…</span>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="mx-2 mt-4 rounded-2xl border border-dashed border-[#dce2d2] px-4 py-6 text-center text-[11px] leading-6 text-[#98a08c]">
              {search
                ? 'Tidak ada percakapan yang cocok.'
                : 'Cerita pertama si kecil dimulai di sini.'}
            </p>
          )}
        </div>
      </div>
      <Menu.Root>
        <Menu.Trigger
          aria-label="Menu akun"
          disabled={signingOut || disabled}
          className="flex w-full items-center gap-3 border-t border-[#e1e6d8] px-5 py-4 text-left hover:bg-[#e9ecdf]"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e2e8d9] text-sm text-[#284f3d]">
            {name.trim().charAt(0).toUpperCase() || 'A'}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-medium">{name}</span>
            <span className="text-[10px] text-[#949e87]">
              Sahabat AnabulCare
            </span>
          </span>
          <ChevronDown size={16} />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner side="top" sideOffset={8} className="z-50">
            <Menu.Popup className="w-56 rounded-xl border border-[#dce1d4] bg-[#ffffff] p-2 text-sm text-[#253e32] shadow-xl">
              <Menu.LinkItem
                render={<Link to="/cats" />}
                closeOnClick
                className="flex items-center gap-3 rounded-lg p-3 outline-none data-highlighted:bg-[#edf0e7]"
              >
                <Cat size={16} /> Profil
              </Menu.LinkItem>
              <Menu.Item
                disabled={signingOut || disabled}
                onClick={handlerSignOut}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-3 text-red-700 outline-none data-highlighted:bg-[#edf0e7]"
              >
                <LogOut size={16} />
                {signingOut ? 'Keluar...' : 'Keluar'}
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  )
}
