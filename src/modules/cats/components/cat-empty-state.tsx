import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function CatEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="rounded-3xl border border-dashed border-[#ccd5c3] bg-white p-8 sm:p-12">
      <Plus className="mb-6 text-[#718567]" size={28} />
      <h2 className="text-2xl font-semibold">Mulai cerita si kecil</h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-[#737a70]">
        Tambahkan nama dan jenis kelamin kucingmu. Informasi lainnya bisa
        dilengkapi kapan saja.
      </p>
      <Button
        onClick={onCreate}
        className="mt-7 h-12 rounded-xl bg-[#284f3d] px-6 text-white"
      >
        Buat profil kucing <Plus size={16} />
      </Button>
    </section>
  )
}
