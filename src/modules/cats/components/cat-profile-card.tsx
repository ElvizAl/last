import { Cat, Heart } from 'lucide-react'
import type { CatProfile } from '../cat.types'

export function CatProfileCard({ cat }: { cat?: CatProfile }) {
  return (
    <aside className="overflow-hidden rounded-3xl border border-[#e1e5d9] bg-white">
      <div className="flex h-44 items-center justify-center bg-[#e9ecdf]">
        <div className="flex size-24 items-center justify-center rounded-full bg-[#fcfbf7] text-[#718567]">
          <Cat size={52} strokeWidth={1.3} />
        </div>
      </div>
      <div className="p-7">
        <p className="mb-2 text-[10px] tracking-widest text-[#718567]">
          TEMAN KECILMU
        </p>
        <h2 className="break-words text-2xl font-semibold">
          {cat?.name || 'Siapa nama si kecil?'}
        </h2>
        <p className="mt-2 text-sm text-[#737a70]">
          {cat?.breed || 'Ras belum diisi'}
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#f5f6ef] p-3 text-xs">
          <Heart size={16} /> Dirawat dengan penuh sayang.
        </div>
      </div>
    </aside>
  )
}
