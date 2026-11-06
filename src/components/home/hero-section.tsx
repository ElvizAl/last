import {
  ArrowDown,
  ArrowRight,
  Heart,
  PawPrint,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '../ui/button'

export function HeroSection() {
  return (
    <section className="grid items-center gap-[38px] pt-[30px] pb-[45px] md:grid-cols-[1.08fr_1fr] md:gap-[35px] md:pt-[55px] md:pb-[83px] lg:gap-[62px] mx-auto w-[calc(100%-40px)] max-w-[1180px] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]">
      <div className="[&>h1]:relative [&>h1]:my-[25px] [&>h1]:font-heading [&>h1]:text-[clamp(48px,8vw,61px)] [&>h1]:leading-[1.04] [&>h1]:font-medium [&>h1]:tracking-[-3px] md:[&>h1]:text-[clamp(52px,5.6vw,77px)] [&>p]:max-w-[425px] [&>p]:text-[13px] [&>p]:leading-[1.9] [&>p]:text-[#737a70] lg:[&>p]:text-sm">
        <div className="flex items-center gap-2 text-[9px] font-semibold tracking-[1.7px] text-[#6a7c65] md:text-[10px] [&>span]:size-[7px] [&>span]:rounded-full [&>span]:bg-[#88a078]">
          <span /> TEMAN CERITA PARA CAT PARENTS
        </div>
        <h1>
          Karena si kecil
          <br />
          nggak bisa
          <br />
          <em>cerita sendiri.</em>
          <Heart className="ml-4 inline-block size-[39px] -rotate-17 stroke-[1.2] text-[#bca47e]" />
        </h1>
        <p>
          Kenali kebutuhan kucingmu, satu percakapan pada satu waktu. Teman
          berbasis AI untuk membantumu lebih memahami anabul kesayangan.
        </p>
        <div className="mt-[30px] mb-[22px] flex flex-wrap items-center gap-4 lg:gap-[26px]">
          <Button
            nativeButton={false}
            render={(props) => (
              <a {...props} href="#demo">
                {props.children}
              </a>
            )}
            className="h-auto gap-[18px] rounded-lg bg-[#284f3d] px-[23px] py-[17px] text-[13px] font-medium text-white hover:-translate-y-0.5 hover:bg-[#3c664e]"
          >
            Coba contoh percakapan <ArrowRight size={18} />
          </Button>
          <a
            className="inline-flex items-center gap-2.5 text-xs font-semibold hover:text-[#8c704b]"
            href="#cara-kerja"
          >
            Cara kerjanya <ArrowDown size={16} />
          </a>
        </div>
        <div className="flex max-w-[410px] items-center gap-2 text-[10px] text-[#8b8d80] [&>svg]:shrink-0">
          <ShieldCheck size={17} />
          <span>
            Informasi awal untukmu. Perawatan terbaik bersama dokter hewan.
          </span>
        </div>
      </div>
      <div className="relative mx-3.5 pb-[25px] md:mx-0">
        <div className="relative h-[400px] overflow-hidden rounded-t-[150px] rounded-b-2xl bg-[#e7ddc8] md:h-[440px] lg:h-[490px] lg:rounded-t-[180px] [&>img]:size-full [&>img]:object-cover [&>img]:object-[50%_46%] after:absolute after:inset-x-0 after:top-[60%] after:bottom-0 after:bg-linear-to-b after:from-transparent after:to-[#302a2260]">
          <img
            src="/images/anabul-cat.jpg"
            alt="Kucing oranye dengan tatapan penasaran"
            fetchPriority="high"
          />
          <span className="absolute bottom-[25px] left-7 z-10 flex items-center gap-2 text-[9px] tracking-[2px] text-white [&>span]:size-[5px] [&>span]:rounded-full [&>span]:bg-[#e8cfa5]">
            <span /> LITTLE PAWS, BIG LOVE
          </span>
        </div>
        <div className="absolute top-[18px] -right-3 flex size-24 rotate-12 flex-col items-center justify-center gap-[7px] rounded-full border border-[#d5d9cb] bg-[#eef0e5] text-center text-[10px] leading-[1.3] lg:-right-[25px] lg:size-28 [&>svg]:stroke-[1.4]">
          <PawPrint size={31} />
          <span>
            Made for
            <br />
            <b>cat people.</b>
          </span>
        </div>
        <div className="absolute bottom-0 -left-3 flex items-center gap-[13px] rounded-xl border border-[#eeece3] bg-[#fffefb] px-[18px] py-[15px] text-[11px] leading-[1.9] text-[#88867b] shadow-[0_12px_35px_#263c3110] md:-left-[35px] md:px-6 md:py-[19px] [&_strong]:font-semibold [&_strong]:text-[#3c4e3c]">
          <span className="rounded-full bg-[#f0f1e7] p-[13px] text-[#738565]">
            <Heart size={22} />
          </span>
          <div>
            Satu langkah kecil untukmu.
            <br />
            <strong>Rasa nyaman untuknya.</strong>
          </div>
        </div>
        <span
          className="absolute top-10 -left-[25px] text-[55px] text-[#b5a17c]"
          aria-hidden="true"
        >
          ✳
        </span>
      </div>
    </section>
  )
}
