import { ArrowLeft, Cat, Pencil, Plus } from 'lucide-react'
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { toast } from 'sonner'
import { LandingHeader } from '#/components/home/landing-header'
import { LandingFooter } from '#/components/home/landing-footer'
import { listCats, deleteCat } from '#/modules/cats/cat.api'
import { CatFormDialog } from '#/modules/cats/components/cat-form-dialog'
import { CatProfileCard } from '#/modules/cats/components/cat-profile-card'
import { CatProfileDetails } from '#/modules/cats/components/cat-profile-details'
import { CatEmptyState } from '#/modules/cats/components/cat-empty-state'
import { getSession } from '#/lib/auth/auth-session'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/cats')({
  beforeLoad: async () => {
    if (!(await getSession())) throw redirect({ to: '/login' })
  },
  loader: async () => {
    const result = await listCats()
    if (!result.success) throw new Error(result.message)
    return result.cats
  },
  component: CatsPage,
  errorComponent: () => (
    <div className="p-8">
      Gagal memuat kucing.{' '}
      <Link to="/cats" reloadDocument>
        Coba lagi
      </Link>
    </div>
  ),
})

function CatsPage() {
  const cats = Route.useLoaderData()
  const router = useRouter()
  const remove = useServerFn(deleteCat)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const profil = cats.find((cat) => cat.id === selectedId) ?? cats.at(0)
  async function refresh() {
    await router.invalidate()
    setFormMode(null)
    setConfirmDelete(false)
  }

  async function handlerDeleteCat() {
    if (!profil || deleting) return
    setDeleting(true)
    try {
      const result = await remove({ data: { id: profil.id } })
      if (!result.success) {
        toast.error(result.message)
        return
      }
      toast.success(result.message)
      await refresh()
      setSelectedId(null)
    } catch {
      toast.error('Gagal menghapus profil. Silakan coba lagi.')
    } finally {
      setDeleting(false)
    }
  }

  function startAdding() {
    setFormMode('create')
    setConfirmDelete(false)
  }

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-[#253e32]">
      <LandingHeader />
      <main className="min-h-[75vh] px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs text-[#737a70]"
          >
            <ArrowLeft size={14} /> Kembali ke beranda
          </Link>
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#718567]">
                KENALI SI KECIL LEBIH DEKAT
              </p>
              <h1 className="font-heading text-4xl font-semibold tracking-tight">
                Satu profil, banyak cerita.
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#737a70]">
                Simpan hal-hal kecil yang membuat kucingmu istimewa.
              </p>
            </div>
            {!formMode && (
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={startAdding}
                  disabled={deleting || confirmDelete}
                  variant="outline"
                  className="h-11 rounded-xl border-[#dce1d4] bg-white px-5"
                >
                  <Plus size={16} /> Tambah kucing
                </Button>
                {profil && (
                  <Button
                    disabled={deleting || confirmDelete}
                    onClick={() => setFormMode('edit')}
                    className="h-11 rounded-xl bg-[#284f3d] px-5 text-white"
                  >
                    <Pencil size={16} /> Edit profil
                  </Button>
                )}
              </div>
            )}
          </div>
          {cats.length > 1 && !formMode && (
            <nav
              aria-label="Pilih kucing"
              className="mb-6 flex flex-wrap gap-2"
            >
              {cats.map((cat) => (
                <button
                  key={cat.id}
                  disabled={deleting || confirmDelete}
                  aria-pressed={cat.id === profil?.id}
                  onClick={() => setSelectedId(cat.id)}
                  className="flex items-center gap-2 rounded-xl border border-[#dce1d4] bg-white px-4 py-3 text-sm aria-pressed:border-[#718567] aria-pressed:bg-[#e9ecdf] disabled:opacity-50"
                >
                  <Cat size={16} />
                  {cat.name}
                </button>
              ))}
            </nav>
          )}
          <div className="mx-auto grid max-w-2xl items-start gap-4 md:grid-cols-[200px_minmax(0,1fr)]">
            <CatProfileCard cat={profil} />
            {profil ? (
              <CatProfileDetails
                profil={profil}
                confirmDelete={confirmDelete}
                deleting={deleting}
                setConfirmDelete={setConfirmDelete}
                onDelete={handlerDeleteCat}
              />
            ) : (
              <CatEmptyState onCreate={startAdding} />
            )}
          </div>
          {formMode && (
            <CatFormDialog
              cat={formMode === 'edit' ? profil : undefined}
              onClose={() => setFormMode(null)}
              onSaved={refresh}
            />
          )}
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
