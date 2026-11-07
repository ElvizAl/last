import { Menu } from '@base-ui/react/menu'
import { Link } from '@tanstack/react-router'
import { Cat, ChevronDown, Loader2, LogOut, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { signOut } from '#/lib/auth/auth-client'

type Props = { user: { name: string; email: string } }

export function UserDropdown({ user }: Props) {
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      const result = await signOut()
      if (result.error) {
        toast.error('Gagal keluar. Silakan coba lagi.')
        return
      }
      window.location.assign('/')
    } catch {
      toast.error('Gagal keluar. Periksa koneksi kamu.')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        disabled={signingOut}
        aria-label={`Menu akun ${user.name}`}
        className="flex min-w-0 items-center gap-2 rounded-xl border border-[#dce1d4] bg-white px-3 py-2 text-sm text-[#284f3d] outline-none focus-visible:ring-2 focus-visible:ring-[#718567] disabled:opacity-60"
      >
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#edf0e7] font-semibold"
        >
          {user.name.trim().charAt(0).toUpperCase() || 'A'}
        </span>
        <span className="hidden max-w-32 truncate lg:block">{user.name}</span>
        {signingOut ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={8} className="z-50">
          <Menu.Popup className="w-64 max-w-[calc(100vw-24px)] rounded-2xl border border-[#dce1d4] bg-white p-2 text-[#253e32] shadow-lg outline-none">
            <div className="mb-1 border-b border-[#edf0e7] px-3 py-3">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="mt-1 truncate text-xs text-[#737a70]">
                {user.email}
              </p>
            </div>
            <Menu.LinkItem
              render={<Link to="/cats" />}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm outline-none data-highlighted:bg-[#edf0e7]"
            >
              <Cat size={17} /> Kucingku
            </Menu.LinkItem>
            <Menu.LinkItem
              render={<Link to="/chat" />}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm outline-none data-highlighted:bg-[#edf0e7]"
            >
              <MessageCircle size={17} /> Konsultasi
            </Menu.LinkItem>
            <Menu.Item
              disabled={signingOut}
              onClick={handleSignOut}
              className="mt-1 flex cursor-pointer items-center gap-3 rounded-lg border-t border-[#edf0e7] px-3 py-3 text-sm text-red-700 outline-none data-highlighted:bg-red-50 data-disabled:opacity-50"
            >
              <LogOut size={17} /> {signingOut ? 'Keluar...' : 'Keluar'}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
