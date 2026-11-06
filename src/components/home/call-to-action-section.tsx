import { ArrowRight } from 'lucide-react'
import { Button } from '#/components/ui/button'

export function CallToActionSection() {
  return (
    <section className="flex flex-col items-start justify-between gap-6.25 rounded-[13px] bg-[#e9ecdf] p-[27px] md:flex-row md:items-center md:px-11.25 md:py-[38px] [&_span]:text-[9px] [&_span]:tracking-[1.4px] [&_span]:text-[#7b876b] [&_h2]:mt-3 [&_h2]:mb-0 [&_h2]:text-[27px] md:[&_h2]:text-[30px] mx-auto w-[calc(100%-40px)] max-w-[1180px] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]">
      <div>
        <span>UNTUK SETIAP MEONG YANG BERARTI.</span>
        <h2>
          Lebih dekat dengan si kecil,
          <br />
          dimulai dari rasa ingin tahu.
        </h2>
      </div>
      <Button
        nativeButton={false}
        render={(props) => (
          <a {...props} href="#demo">
            {props.children}
          </a>
        )}
        className="h-auto gap-[18px] rounded-lg bg-[#284f3d] px-[23px] py-[17px] text-[13px] font-medium text-white hover:-translate-y-0.5 hover:bg-[#3c664e]"
      >
        Kenalan dengan AnabulCare <ArrowRight size={18} />
      </Button>
    </section>
  )
}
