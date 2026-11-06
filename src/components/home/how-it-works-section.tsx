import { BookOpen, Cat, MessageCircle } from 'lucide-react'

export function HowItWorksSection() {
  return (
    <section
      className="pb-[50px] md:pb-[90px] mx-auto w-[calc(100%-40px)] max-w-[1180px] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]"
      id="cara-kerja"
    >
      <div className="flex items-center justify-between [&_h2]:text-[29px] md:[&_h2]:text-[32px]">
        <div>
          <span className="text-[10px] font-semibold tracking-[1.7px] text-[#6a7c65]">
            NGGAK PERLU BINGUNG MULAI DARI MANA
          </span>
          <h2>Cukup cerita. Kita mulai dari situ.</h2>
        </div>
        <span className="hidden -rotate-7 font-serif text-[19px] text-[#8f967d] italic md:inline">
          Sesimpel ngobrol ♡
        </span>
      </div>
      <div className="mt-3 grid gap-[25px] md:mt-[30px] md:grid-cols-3 md:gap-[30px] [&>article]:border-t [&>article]:border-[#d8decf] [&>article]:pt-4 md:[&>article]:pt-[25px] md:[&>article]:pr-3 [&_h3]:mt-3 [&_h3]:mb-3 [&_h3]:text-[17px] [&_h3]:font-medium md:[&_h3]:mt-[21px] [&_p]:text-xs [&_p]:leading-[1.9] [&_p]:text-[#737a70] md:[&_p]:max-w-[310px]">
        {[
          {
            icon: MessageCircle,
            title: 'Ceritakan tentang si kecil',
            body: 'Mulai dari hal yang kamu perhatikan. Nggak perlu istilah medis, pakai bahasamu sendiri.',
          },
          {
            icon: Cat,
            title: 'Kenali ceritanya lebih dekat',
            body: 'Pertanyaan lanjutan membantu melengkapi konteks usia, kebiasaan, dan perubahan yang terjadi.',
          },
          {
            icon: BookOpen,
            title: 'Pahami langkah berikutnya',
            body: 'Tujuannya sederhana: membantu kamu menyiapkan informasi dan pertanyaan untuk perawatan si kecil.',
          },
        ].map((step, i) => (
          <article key={step.title}>
            <div className="flex items-center justify-between text-[#789170] [&>span]:font-serif [&>span]:text-[31px] [&>span]:text-[#c6cabb]">
              <step.icon size={25} />
              <span>0{i + 1}</span>
            </div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
