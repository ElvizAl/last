import { PawPrint } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3.5 py-[30px] md:gap-5 md:py-9 [&>a]:text-xl [&>p]:order-3 [&>p]:w-full [&>p]:text-[10px] [&>p]:text-[#909485] md:[&>p]:order-none md:[&>p]:w-auto [&>span]:text-[9px] [&>span]:text-[#909485] md:[&>span]:text-[10px] mx-auto w-[calc(100%-40px)] max-w-[1180px] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]">
      <a
        className="flex items-center text-2xl font-bold tracking-[-1px] [&>span:first-child]:mr-2 [&>span:first-child]:flex [&>svg]:mr-2 [&>i]:mb-2 [&>i]:ml-1 [&>i]:size-[5px] [&>i]:self-end [&>i]:rounded-full [&>i]:bg-[#d6a866]"
        href="#beranda"
      >
        <PawPrint size={23} />
        Anabul<span className="text-[#69856b]">Care</span>
      </a>
      <p>Dibuat dengan peduli, untuk kamu dan kucingmu.</p>
      <span>© {new Date().getFullYear()} AnabulCare</span>
    </footer>
  )
}
