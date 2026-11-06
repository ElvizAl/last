import { Cat, Heart, MessageCircle } from 'lucide-react'

export function FeaturesSection() {
  return (
    <div className="border-y border-[#e8e9df] bg-[#f3f4ec] [&>div]:flex [&>div]:justify-between [&>div]:gap-5 [&>div]:py-[25px] md:[&>div]:items-center md:[&>div]:justify-center lg:[&>div]:gap-[55px] [&_span]:flex [&_span]:flex-1 [&_span]:flex-col [&_span]:items-center [&_span]:gap-2 [&_span]:text-center [&_span]:text-[9px] [&_span]:text-[#65725d] md:[&_span]:flex-none md:[&_span]:flex-row md:[&_span]:gap-3 md:[&_span]:text-xs [&_svg]:size-[19px] [&_svg]:stroke-[1.5] [&_i]:hidden md:[&_i]:block [&_i]:size-[5px] [&_i]:rounded-full [&_i]:bg-[#c5c9b8]">
      <div className="mx-auto w-[calc(100%-40px)] max-w-[1180px] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]">
        <span>
          <Cat /> Khusus untuk kucing
        </span>
        <i />
        <span>
          <MessageCircle /> Bahasa yang mudah dimengerti
        </span>
        <i />
        <span>
          <Heart /> Berawal dari rasa peduli
        </span>
      </div>
    </div>
  )
}
