import { ArrowRight } from 'lucide-react'

export function AboutSection() {
  return (
    <section
      className="grid gap-3 py-13.75 md:grid-cols-2 md:gap-11.25 md:py-22 lg:gap-23.75 [&_p]:mb-4 [&_p]:text-[13px] [&_p]:leading-[1.9] [&_p]:text-[#737a70] [&_a]:mt-2.5 mx-auto w-[calc(100%-40px)] max-w-295 md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]"
      id="tentang"
    >
      <div>
        <span className="text-[10px] font-semibold tracking-[1.7px] text-[#6a7c65]">
          SEDIKIT LEBIH PAHAM, SEDIKIT LEBIH TENANG
        </span>
        <h2>
          Sayang itu juga
          <br />
          tentang <em>memahami.</em>
        </h2>
      </div>
      <div>
        <p>
          Kucing punya caranya sendiri untuk menunjukkan apa yang ia rasakan.
          Kadang lewat makanan yang tersisa, kebiasaan baru, atau waktu bermain
          yang lebih singkat.
        </p>
        <p>
          AnabulCare dirancang untuk menemanimu menyusun cerita itu. Tempat
          bertanya yang ramah, sebelum menentukan langkah berikutnya.
        </p>
        <a
          href="#demo"
          className="inline-flex items-center gap-2.5 text-xs font-semibold hover:text-[#8c704b]"
        >
          Lihat seperti apa percakapannya <ArrowRight size={17} />
        </a>
      </div>
    </section>
  )
}
