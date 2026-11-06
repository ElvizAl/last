import { createFileRoute } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { toast } from '#/components/ui/toast'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <>
      <h1 className="font-heading text-[34px] font-semibold tracking-tight">
        Jadi bagian dari ceritanya.
      </h1>

      <p className="mt-3 mb-8 text-sm leading-7 text-[#737a70]">
        Buat akun untuk memulai perjalanan bersama AnabulCare.
      </p>

      <form className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Nama kamu</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Nama panggilanmu"
            required
            className="h-12 rounded-lg border-[#dce1d4] bg-white px-4 text-sm focus-visible:border-[#718567] focus-visible:ring-[#718567]/30 md:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="kamu@email.com"
            required
            maxLength={254}
            className="h-12 rounded-lg border-[#dce1d4] bg-white px-4 text-sm focus-visible:border-[#718567] focus-visible:ring-[#718567]/30 md:text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Kata sandi</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
              maxLength={128}
              className="h-12 rounded-lg border-[#dce1d4] bg-white px-4 text-sm focus-visible:border-[#718567] focus-visible:ring-[#718567]/30 md:text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-md text-[#737a70]"
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi kata sandi</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Ulangi kata sandi"
            required
            minLength={8}
            maxLength={128}
            className="h-12 rounded-lg border-[#dce1d4] bg-white px-4 text-sm focus-visible:border-[#718567] focus-visible:ring-[#718567]/30 md:text-sm"
          />
        </div>

        <Button
          type="submit"
          className="h-12 w-full cursor-pointer gap-2 rounded-lg bg-[#284f3d] text-sm text-white hover:bg-[#3c664e] disabled:cursor-not-allowed disabled:opacity-70"
        >
          Buat akun
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-[#737a70]">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-semibold text-[#284f3d] underline-offset-4 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </>
  )
}
