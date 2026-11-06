import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { useState } from 'react'
import { CatForm } from '../cat-form'
import type { CatProfile } from '../cat.types'
import { Button } from '#/components/ui/button'

type Props = {
  cat?: CatProfile
  onClose: () => void
  onSaved: () => Promise<void>
}

export function CatFormDialog({ cat, onClose, onSaved }: Props) {
  const [saving, setSaving] = useState(false)
  return (
    <Dialog.Root
      open
      disablePointerDismissal
      onOpenChange={(open) => {
        if (!open && !saving) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-[#e1e5d9] bg-[#fcfbf7] p-6 text-[#253e32] shadow-xl outline-none sm:p-8">
          <div className="mb-6 pr-10">
            <Dialog.Title className="font-heading text-2xl font-semibold">
              {cat ? 'Perbarui profil' : 'Kenalkan kucingmu'}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-[#737a70]">
              Lengkapi profil si kecil. Nama dan jenis kelamin wajib diisi.
            </Dialog.Description>
          </div>
          <Dialog.Close
            disabled={saving}
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-5 right-5"
                aria-label="Tutup dialog"
              />
            }
          >
            <X />
          </Dialog.Close>
          <CatForm
            catId={cat?.id}
            initialValues={
              cat
                ? {
                    name: cat.name,
                    gender: cat.gender,
                    birthDate: cat.birthDate?.toISOString().slice(0, 10) ?? '',
                    breed: cat.breed ?? '',
                    vaccineStatus: cat.vaccineStatus,
                    healthHistory: cat.healthHistory ?? '',
                  }
                : undefined
            }
            onSaved={onSaved}
            onCancel={onClose}
            onSavingChange={setSaving}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
