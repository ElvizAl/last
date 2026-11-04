import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { registerServerFn } from '#/modules/auth/auth.api'
import { registerSchema, type RegisterInput } from '#/modules/auth/auth.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const registerServerFnHandler = useServerFn(registerServerFn)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function handlerRegisterUser(data: RegisterInput) {
    try {
      const result = await registerServerFnHandler({ data })

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
    } catch {
      toast.error('Register Gagal, silahkan coba lagi')
    }

    await navigate({ to: '/login'})

  }


  return (
    <>
      <h1 className="font-heading text-[34px] font-semibold tracking-tight">
        Jadi bagian dari ceritanya.
      </h1>

      <p className="mt-3 mb-8 text-sm leading-7 text-[#737a70]">
        Buat akun untuk memulai perjalanan bersama AnabulCare.
      </p>

      <form 
      className="space-y-5"
      onSubmit={handleSubmit(handlerRegisterUser)}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nama kamu</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Nama panggilanmu"
            required
            className="h-12 rounded-lg border-[#dce1d4] bg-white px-4 text-sm focus-visible:border-[#718567] focus-visible:ring-[#718567]/30 md:text-sm"
            {...register('name')}
          />
          <p id='name-error' aria-live='polite'>
              {errors.name?.message}
          </p>
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
            {...register('email')}
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
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
              maxLength={128}
              className="h-12 rounded-lg border-[#dce1d4] bg-white px-4 text-sm focus-visible:border-[#718567] focus-visible:ring-[#718567]/30 md:text-sm"
              {...register('password')}
            />
            <p id='password-error' aria-live='polite'>
              {errors.password?.message}
            </p>
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
            {...register('confirmPassword')}
          />
          <p id='confirmPassword-error' aria-live='polite'>
              {errors.confirmPassword?.message}
          </p>
        </div>

        <Button
          type="submit"
          className="h-12 w-full cursor-pointer gap-2 rounded-lg bg-[#284f3d] text-sm text-white hover:bg-[#3c664e] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              Mendaftarkan...
              <Loader2 className="size-4 animate-spin" />
            </>
          ) : (
            <>
              Buat akun
              <ArrowRight className="size-4" />
            </>
          )}
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
