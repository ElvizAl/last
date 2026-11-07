import { UserDropdown } from './user-dropdown'
import { useSession } from '#/lib/auth/auth-client'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Menu, PawPrint } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'

export function LandingHeader() {
  const [open, setOpen] = useState(false)
  const { data: session, isPending, error } = useSession()
  const showAuthLinks = !isPending && !error && !session
  return (
    <header className="mx-auto flex h-[78px] w-[calc(100%-40px)] max-w-[1180px] items-center justify-between gap-4 text-[#253e32] md:h-[100px] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]">
      <Link
        to="/"
        className="flex items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl"
      >
        <PawPrint size={23} />
        <span>
          Anabul<span className="text-[#69856b]">Care</span>
        </span>
        <span className="mt-4 size-1 rounded-full bg-[#d6a866]" />
      </Link>
      <nav
        aria-label="Navigasi utama"
        className="hidden items-center gap-7 text-[13px] md:flex"
      >
        <a href="/#beranda">Beranda</a>
        <a href="/#tentang">Tentang kami</a>
        <a href="/#cara-kerja">Cara kerja</a>
        <a href="/#faq">FAQ</a>
        <Link to="/cats">Kucingku</Link>
        {showAuthLinks && <Link to="/login">Masuk</Link>}
      </nav>
      <div className="flex items-center gap-2">
        {session && <UserDropdown user={session.user} />}
        {showAuthLinks && (
          <Button
            nativeButton={false}
            render={<Link to="/register" />}
            className="hidden h-11 rounded-lg bg-[#284f3d] px-5 text-white hover:bg-[#3c664e] lg:inline-flex"
          >
            Daftar sekarang <ArrowRight size={16} />
          </Button>
        )}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Buka menu"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent className="bg-[#fcfbf7] text-[#253e32]">
            <SheetHeader>
              <SheetTitle>AnabulCare</SheetTitle>
              <SheetDescription>Teman memahami kucingmu.</SheetDescription>
            </SheetHeader>
            <nav
              aria-label="Navigasi mobile"
              className="flex flex-col gap-3 px-4"
            >
              {[
                { href: '/#beranda', label: 'Beranda' },
                { href: '/#tentang', label: 'Tentang kami' },
                { href: '/#cara-kerja', label: 'Cara kerja' },
                { href: '/#faq', label: 'FAQ' },
                { href: '/cats', label: 'Kucingku' },
                ...(showAuthLinks
                  ? [
                      { href: '/login', label: 'Masuk' },
                      { href: '/register', label: 'Daftar sekarang' },
                    ]
                  : []),
              ].map((link) => (
                <SheetClose
                  key={link.href}
                  nativeButton={false}
                  render={
                    <a
                      href={link.href}
                      className="rounded-lg px-3 py-3 text-sm hover:bg-[#edf0e7]"
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
