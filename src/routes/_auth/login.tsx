import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { toast } from 'sonner'
import { loginServerFn } from '#/modules/auth/auth.api'
import { loginSchema } from '#/modules/auth/auth.schema'
import type { LoginInput } from '#/modules/auth/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const loginServerFnHandler = useServerFn(loginServerFn)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function handlerLoginUser(data: LoginInput) {
    try {
      const result = await loginServerFnHandler({ data })

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)

      await navigate({ to: '/' })

    } catch {
      toast.error('Login Gagal, Silahakan coba lagi')
    }
  }

  return (
    <>
      <h1 className="font-heading text-[34px] font-semibold tracking-tight">
        Senang kamu kembali.
      </h1>

      <p className="mt-3 mb-8 text-sm leading-7 text-[#737a70]">
        Masuk ke akunmu. Ada si kecil yang menunggu untuk dipahami.
      </p>

      <form
        onSubmit={handleSubmit(handlerLoginUser)}
        className="space-y-5"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="kamu@email.com"
            required
            maxLength={254}
            className="h-12 rounded-lg border-[#dce1d4] bg-white px-4 text-sm focus-visible:border-[#718567] focus-visible:ring-[#718567]/30 md:text-sm"
          />
          <p id='email-error' aria-live='polite'>
              {errors.email?.message}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Kata sandi</Label>

          <div className="relative">
            <Input
              id="password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              required
              maxLength={128}
              className="h-12 rounded-lg border-[#dce1d4] bg-white px-4 pr-12 text-sm focus-visible:border-[#718567] focus-visible:ring-[#718567]/30 md:text-sm"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-md text-[#737a70]"
              aria-label={
                showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
              }
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <p id='password-error' aria-live='polite'>
              {errors.password?.message}
            </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full gap-2 rounded-lg bg-[#284f3d] text-sm text-white hover:bg-[#3c664e]"
        >
          {isSubmitting ? (
            <>
              Masuk...
              <Loader2 className="size-4 animate-spin" />
            </>
          ) : (
            <>
              Masuk
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-[#737a70]">
        Belum punya akun?{' '}
        <Link
          to="/register"
          className="font-semibold text-[#284f3d] underline-offset-4 hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </>
  )
}
