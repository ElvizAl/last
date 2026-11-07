import { Cat, Heart, PawPrint } from 'lucide-react'
import type { CatProfile } from '../cat.types'

export function CatProfileCard({ cat }: { cat?: CatProfile }) {
  return (
    <aside className="mx-auto w-full max-w-60 overflow-hidden rounded-[28px] border border-[#e1e5d9] bg-[#fffefb] text-center shadow-[0_6px_24px_#71856708]">
      <div className="relative flex h-28 items-center justify-center bg-[#edf0e5]">
        <PawPrint
          aria-hidden="true"
          className="absolute top-4 left-5 size-4 -rotate-12 text-[#c4cdb7]"
        />
        <Heart
          aria-hidden="true"
          className="absolute right-5 bottom-5 size-4 rotate-12 fill-[#ead7c2] text-[#c5a582]"
        />
        <div className="flex size-16 items-center justify-center rounded-[22px] bg-[#fffefb] text-[#718567] shadow-sm">
          <Cat size={37} strokeWidth={1.4} aria-hidden="true" />
        </div>
      </div>
      <div className="px-4 pt-4 pb-5">
        <p className="mb-1.5 text-[9px] font-medium tracking-[0.15em] text-[#718567]">
          TEMAN KECILMU
        </p>
        <h2 className="break-words font-heading text-xl font-semibold leading-tight">
          {cat?.name || 'Si kecil'}
        </h2>
        <p className="mt-1.5 break-words text-xs text-[#737a70]">
          {cat?.breed || 'Ras belum diisi'}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#f5f1e9] px-3 py-1.5 text-[10px] text-[#8b755c]">
          <Heart size={11} aria-hidden="true" /> Kesayangan rumah
        </span>
      </div>
    </aside>
  )
}
