import { ShieldCheck, Loader2, Trash2 } from 'lucide-react'
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
    <section className="rounded-3xl border border-[#e1e5d9] bg-white p-6 sm:p-8">
      <div className="mb-7 flex items-center gap-3">
        <ShieldCheck className="text-[#718567]" />
        <h2 className="text-xl font-semibold">Tentang {profil.name}</h2>
      </div>
      <dl className="grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-[#737a70]">Jenis kelamin</dt>
          <dd className="mt-2 text-sm font-medium">
            {profil.gender === 'LAKI_LAKI' ? 'Jantan' : 'Betina'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#737a70]">Vaksinasi</dt>
          <dd className="mt-2 text-sm font-medium">
            {profil.vaccineStatus === 'VAKSIN'
              ? 'Sudah vaksin'
              : 'Belum vaksin'}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#737a70]">Tanggal lahir</dt>
          <dd className="mt-2 text-sm font-medium">{birthday}</dd>
        </div>
        <div>
          <dt className="text-xs text-[#737a70]">Ras kucing</dt>
          <dd className="mt-2 break-words text-sm font-medium">
            {profil.breed || 'Belum diisi'}
          </dd>
        </div>
      </dl>
      <div className="mt-7 border-t border-[#edf0e7] pt-6">
        <h3 className="text-xs text-[#737a70]">Catatan kesehatan</h3>
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7">
          {profil.healthHistory ||
            'Belum ada catatan. Kamu bisa menambahkannya lewat Edit profil.'}
        </p>
      </div>
      <div className="mt-8 border-t border-[#edf0e7] pt-5">
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
