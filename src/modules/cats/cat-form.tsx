import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { catSchema } from './cat.schema'
import type { CatInput } from './cat.schema'
import { createCat, updateCat } from './cat.api'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

type Props = {
  initialValues?: CatInput
  catId?: string
  onSaved: () => Promise<void>
  onCancel: () => void
  onSavingChange: (saving: boolean) => void
}

export function CatForm({
  initialValues,
  catId,
  onSaved,
  onCancel,
  onSavingChange,
}: Props) {
  const create = useServerFn(createCat)
  const update = useServerFn(updateCat)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CatInput>({
    resolver: zodResolver(catSchema),
    defaultValues: initialValues ?? {
      name: '',
      gender: 'LAKI_LAKI',
      birthDate: '',
      breed: '',
      vaccineStatus: 'TIDAK_VAKSIN',
      healthHistory: '',
    },
  })

  async function save(data: CatInput) {
    onSavingChange(true)
    try {
      const result = catId
        ? await update({ data: { ...data, id: catId } })
        : await create({ data })

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      await onSaved()
    } catch {
      toast.error('Gagal menyimpan kucing. Silakan coba lagi.')
    } finally {
      onSavingChange(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(save)} noValidate className="space-y-5">
      <fieldset disabled={isSubmitting} className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cat-name">Nama kucing</Label>
          <Input
            id="cat-name"
            className="h-12 rounded-xl border-[#dce1d4] bg-white"
            {...register('name')}
            aria-invalid={!!errors.name}
            aria-describedby="cat-name-error"
          />
          <p id="cat-name-error" className="text-sm text-destructive">
            {errors.name?.message}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cat-gender">Jenis kelamin</Label>
          <select
            id="cat-gender"
            {...register('gender')}
            className="h-12 w-full rounded-xl border border-[#dce1d4] bg-white px-3 text-sm"
            aria-describedby="cat-gender-error"
          >
            <option value="LAKI_LAKI">Jantan</option>
            <option value="PEREMPUAN">Betina</option>
          </select>
          <p id="cat-gender-error" className="text-sm text-destructive">
            {errors.gender?.message}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cat-birth">Tanggal lahir (opsional)</Label>
          <Input
            id="cat-birth"
            type="date"
            className="h-12 rounded-xl border-[#dce1d4] bg-white"
            {...register('birthDate')}
            aria-invalid={!!errors.birthDate}
            aria-describedby="cat-birth-error"
          />
          <p id="cat-birth-error" className="text-sm text-destructive">
            {errors.birthDate?.message}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cat-breed">Ras (opsional)</Label>
          <Input
            id="cat-breed"
            className="h-12 rounded-xl border-[#dce1d4] bg-white"
            {...register('breed')}
            aria-describedby="cat-breed-error"
          />
          <p id="cat-breed-error" className="text-sm text-destructive">
            {errors.breed?.message}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cat-vaccine">Status vaksin</Label>
          <select
            id="cat-vaccine"
            {...register('vaccineStatus')}
            className="h-12 w-full rounded-xl border border-[#dce1d4] bg-white px-3 text-sm"
            aria-describedby="cat-vaccine-error"
          >
            <option value="TIDAK_VAKSIN">Belum vaksin</option>
            <option value="VAKSIN">Sudah vaksin</option>
          </select>
          <p id="cat-vaccine-error" className="text-sm text-destructive">
            {errors.vaccineStatus?.message}
          </p>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="cat-history">Riwayat kesehatan (opsional)</Label>
          <textarea
            id="cat-history"
            {...register('healthHistory')}
            rows={3}
            className="w-full rounded-xl border border-[#dce1d4] bg-white p-3 text-sm"
            aria-describedby="cat-history-error"
          />
          <p id="cat-history-error" className="text-sm text-destructive">
            {errors.healthHistory?.message}
          </p>
        </div>
      </fieldset>
      <div className="flex justify-end gap-2 border-t border-[#edf0e7] pt-5">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-xl bg-[#284f3d] px-5 text-white"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan profil'}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Batal
        </Button>
      </div>
    </form>
  )
}
