import { ArrowUp, PawPrint, Square } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const messageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Tulis pesan terlebih dahulu.')
    .max(4000, 'Pesan maksimal 4.000 karakter.'),
})
type MessageInput = z.infer<typeof messageSchema>

export function ChatComposer({
  onSend,
  initialMessage = '',
  disabled = false,
  placeholder = 'Ceritakan tentang si kecil...',
  catName,
  busy = false,
  onStop,
}: {
  onSend: (message: string) => void
  initialMessage?: string
  disabled?: boolean
  placeholder?: string
  catName?: string
  busy?: boolean
  onStop?: () => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MessageInput>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: initialMessage },
  })
  function handlerSendMessage(data: MessageInput) {
    if (disabled) return
    onSend(data.message)
    reset({ message: '' })
  }
  return (
    <form
      onSubmit={handleSubmit(handlerSendMessage)}
      noValidate
      className="rounded-[22px] border border-[#e1e6d7] bg-white p-3 shadow-[0_4px_24px_#3c4f3010] transition-shadow focus-within:border-[#9caf8e] focus-within:shadow-[0_4px_24px_#3c4f3018]"
    >
      <textarea
        {...register('message')}
        disabled={disabled}
        aria-label="Pesan untuk AnabulCare"
        aria-invalid={!!errors.message}
        aria-describedby={errors.message ? 'message-error' : undefined}
        rows={2}
        maxLength={4000}
        placeholder={placeholder}
        className="max-h-36 min-h-14 w-full resize-none bg-transparent px-2 py-1 text-sm leading-6 text-[#43513b] outline-none placeholder:text-[#a3aa98] disabled:cursor-not-allowed"
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault()
            void handleSubmit(handlerSendMessage)()
          }
        }}
      />
      {errors.message && (
        <p
          id="message-error"
          role="alert"
          className="px-3 pb-2 text-xs text-red-700"
        >
          {errors.message.message}
        </p>
      )}
      <div className="mt-1 flex items-center justify-between gap-3 px-1">
        <span className="flex items-center gap-2 px-2 text-xs text-[#737a70]">
          <PawPrint size={13} />
          <span className="max-w-40 truncate text-[10px] text-[#919c85]">
            {catName || 'Teman cerita anabulmu'}
          </span>
        </span>
        {busy ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Hentikan jawaban"
            className="flex size-9 items-center justify-center rounded-xl bg-[#e8edde] text-[#577447] hover:bg-[#dce5ce]"
          >
            <Square size={13} fill="currentColor" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={disabled || !watch('message').trim()}
            aria-label="Kirim pesan"
            className="flex size-9 items-center justify-center rounded-xl bg-[#587649] text-white transition hover:bg-[#456237] disabled:bg-[#edf0e6] disabled:text-[#b5bea8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#718567]"
          >
            <ArrowUp size={18} />
          </button>
        )}
      </div>
    </form>
  )
}
