import { PawPrint, Heart, Loader2, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import type { CatProfile } from '../cat.types'

type Props = {
  profil: CatProfile
  confirmDelete: boolean
  deleting: boolean
  setConfirmDelete: (open: boolean) => void
  onDelete: () => Promise<void>
}
export function CatProfileDetails({
  profil,
  confirmDelete,
  deleting,
  setConfirmDelete,
  onDelete,
}: Props) {
  const birthday = profil.birthDate
    ? new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeZone: 'UTC',
      }).format(profil.birthDate)
    : 'Belum diisi'
  return (
    <section className="min-w-0 rounded-[24px] border border-[#e1e5d9] bg-[#fffefb] p-4 shadow-[0_6px_24px_#71856708] sm:p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[#edf0e5] text-[#718567]">
          <PawPrint size={18} aria-hidden="true" />
        </span>
        <h2 className="min-w-0 break-words font-heading text-base font-semibold">
          Tentang {profil.name}
        </h2>
      </div>
      <dl className="grid grid-cols-2 gap-2.5 [&>div]:min-w-0 [&>div]:rounded-2xl [&>div]:bg-[#f5f6ef] [&>div]:px-3 [&>div]:py-2.5">
        <div>
          <dt className="text-xs text-[#737a70]">Jenis kelamin</dt>
          <dd className="mt-1 text-xs font-medium">
            {profil.gender === 'LAKI_LAKI' ? 'Jantan' : 'Betina'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#737a70]">Vaksinasi</dt>
          <dd className="mt-1 text-xs font-medium">
            {profil.vaccineStatus === 'VAKSIN'
              ? 'Sudah vaksin'
              : 'Belum vaksin'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#737a70]">Tanggal lahir</dt>
          <dd className="mt-1 text-xs font-medium">{birthday}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#737a70]">Ras kucing</dt>
          <dd className="mt-1 break-words text-xs font-medium">
            {profil.breed || 'Belum diisi'}
          </dd>
        </div>
      </dl>
      <div className="mt-3 rounded-2xl bg-[#fbf3e9] p-3">
        <h3 className="flex items-center gap-1.5 text-xs font-medium text-[#8b755c]">
          <Heart size={12} aria-hidden="true" /> Catatan kesehatan
        </h3>
        <p className="mt-1.5 whitespace-pre-wrap break-words text-xs leading-5 text-[#737a70]">
          {profil.healthHistory ||
            'Belum ada catatan. Kamu bisa menambahkannya lewat Edit profil.'}
        </p>
      </div>
      <div className="mt-4 border-t border-[#edf0e7] pt-3">
        {confirmDelete ? (
          <div
            role="group"
            aria-label="Konfirmasi hapus profil"
            className="rounded-xl bg-red-50 p-4"
          >
            <p className="text-sm font-medium text-red-900">
              Hapus profil {profil.name}?
            </p>
            <p className="mt-2 text-xs leading-5 text-red-800">
              Data profil akan dihapus permanen. Tindakan ini tidak dapat
              dibatalkan.
            </p>
            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                disabled={deleting}
                onClick={() => setConfirmDelete(false)}
              >
                Batal
              </Button>
              <Button
                disabled={deleting}
                onClick={onDelete}
                className="bg-red-700 text-white hover:bg-red-800"
              >
                {deleting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {deleting ? 'Menghapus...' : 'Ya, hapus profil'}
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 text-xs text-red-700"
          >
            <Trash2 size={14} /> Hapus profil
          </button>
        )}
      </div>
    </section>
  )
}
