import {
  ArrowRight,
  Check,
  Heart,
  PawPrint,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/ui/button'

const topics = ['Nafsu makan', 'Perubahan perilaku', 'Perawatan harian']
const replies = [
  'Ceritakan perubahan nafsu makan si kecil. Sejak kapan kamu menyadarinya, dan berapa usianya?',
  'Perubahan apa yang kamu lihat? Ceritakan kebiasaan sebelumnya dan sejak kapan perilakunya berubah.',
  'Kenalan dulu, yuk. Berapa usia kucingmu, dan bagian perawatan apa yang ingin kamu pahami?',
]

export function DemoSection() {
  const [topic, setTopic] = useState(0)

  return (
    <section
      className="scroll-mt-5 bg-[#edf0e7] py-[45px] md:py-[70px]"
      id="demo"
    >
      <div className="grid items-center gap-[30px] md:grid-cols-2 md:gap-10 lg:gap-[110px] [&_p]:mb-4 [&_p]:max-w-[380px] [&_p]:text-[13px] [&_p]:leading-[1.9] [&_p]:text-[#737a70] mx-auto w-[calc(100%-40px)] max-w-[1180px] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]">
        <div>
          <span className="text-[10px] font-semibold tracking-[1.7px] text-[#6a7c65]">
            INTIP TEMAN NGOBROL BARUMU
          </span>
          <h2>
            Pertanyaan kecilmu,
            <br />
            <em>berarti buat dia.</em>
          </h2>
          <p>
            Dari kebiasaan sehari-hari sampai perubahan yang bikin kepikiran.
            Pilih topik untuk melihat contoh awal percakapan.
          </p>
          <div className="my-6 flex flex-wrap gap-[9px]">
            {topics.map((name, i) => (
              <Button
                type="button"
                key={name}
                aria-pressed={topic === i}
                variant="outline"
                className="h-auto gap-4 rounded-md border-[#cbd3c3] bg-transparent px-3 py-2.5 text-[11px] hover:bg-[#dce4d3] aria-pressed:border-[#8eaa7e] aria-pressed:bg-[#dce4d3]"
                onClick={() => setTopic(i)}
              >
                {name}
                {topic === i ? <Check size={15} /> : <ArrowRight size={15} />}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-[7px] text-[10px] text-[#7b826e]">
            <Sparkles size={16} /> Ini demo interaktif. Chatbot AI sedang
            disiapkan.
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#dce1d4] bg-[#fffefb] shadow-[0_14px_45px_#293b2d0a]">
          <div className="flex items-center gap-[11px] border-b border-[#eeeee6] p-5 [&_strong]:text-[13px] [&_small]:mt-1 [&_small]:block [&_small]:text-[10px] [&_small]:text-[#8c9284]">
            <span className="flex rounded-full bg-[#e8eddf] p-2.5 text-[#6e835f]">
              <PawPrint />
            </span>
            <div>
              <strong>AnabulCare</strong>
              <small>Teman memahami si kecil</small>
            </div>
            <span className="ml-auto rounded border border-[#d6dccd] px-[7px] py-[5px] text-[8px] tracking-[1px] text-[#76826b]">
              DEMO
            </span>
          </div>
          <div
            className="min-h-[330px] p-[21px] md:min-h-[320px]"
            aria-live="polite"
          >
            <span className="mb-[22px] block text-center text-[8px] tracking-[1px] text-[#a0a393]">
              CONTOH PERCAKAPAN
            </span>
            <div className="mb-4 max-w-[87%] rounded-xl rounded-tl-none bg-[#f0f2ea] px-4 py-[13px] text-[11px] leading-[1.8]">
              Halo, cat parent! 🐾
              <br />
              Ada yang ingin kamu ceritakan tentang si kecil hari ini?
            </div>
            <div className="mb-4 max-w-[87%] rounded-xl rounded-tr-none bg-[#34573f] px-4 py-[13px] text-[11px] leading-[1.8] ml-auto text-white">
              Aku mau tanya soal {topics[topic].toLowerCase()} kucingku.
            </div>
            <div className="mb-4 max-w-[87%] rounded-xl rounded-tl-none bg-[#f0f2ea] px-4 py-[13px] text-[11px] leading-[1.8]">
              {replies[topic]}
            </div>
            <div className="mt-5 flex items-center justify-center gap-1.5 text-[8px] text-[#939888]">
              <ShieldCheck size={14} /> Membantu memahami, bukan menetapkan
              diagnosis.
            </div>
          </div>
          <div className="mx-[19px] mb-[19px] flex items-center justify-between rounded-[7px] border border-[#e8eadd] bg-[#f8f8f3] p-[13px] text-[9px] text-[#979b8e]">
            Percakapan contoh · belum terhubung ke AI <Heart size={16} />
          </div>
        </div>
      </div>
    </section>
  )
}
