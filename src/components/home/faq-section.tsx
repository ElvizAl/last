import { PawPrint } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'

export function FaqSection() {
  return (
    <section
      className="grid gap-[5px] py-[50px] md:grid-cols-[1fr_1.3fr] md:gap-[45px] md:py-[90px] lg:gap-[90px] mx-auto w-[calc(100%-40px)] max-w-[1180px] md:w-[calc(100%-48px)] lg:w-[calc(100%-80px)]"
      id="faq"
    >
      <div>
        <span className="text-[10px] font-semibold tracking-[1.7px] text-[#6a7c65]">
          BIAR MAKIN KENAL
        </span>
        <h2>
          Mungkin ini
          <br />
          yang kamu <em>pikirkan.</em>
        </h2>
        <PawPrint
          className="mt-5 hidden -rotate-15 stroke-1 text-[#c4cdb8] md:block"
          size={55}
        />
      </div>
      <Accordion multiple className="w-full">
        {[
          {
            q: 'Apa itu AnabulCare?',
            a: 'AnabulCare adalah aplikasi yang sedang dikembangkan untuk membantu pemilik kucing memahami kebutuhan anabul melalui percakapan dengan AI. Halaman ini memperkenalkan konsep dan contoh percakapannya.',
          },
          {
            q: 'Apakah AnabulCare menggantikan dokter hewan?',
            a: 'Tidak. AnabulCare ditujukan sebagai pendamping informasi awal. Diagnosis dan penanganan tetap memerlukan pemeriksaan dokter hewan.',
          },
          {
            q: 'Apakah chatbot sudah bisa digunakan?',
            a: 'Belum. Kamu bisa mencoba pilihan topik pada demo di atas. Fitur percakapan AI, profil kucing, dan riwayat konsultasi akan dikembangkan pada tahap berikutnya.',
          },
          {
            q: 'Apakah bisa untuk hewan selain kucing?',
            a: 'Untuk tahap awal, AnabulCare fokus pada kucing agar pengalaman dan informasi yang dikembangkan lebih terarah.',
          },
        ].map((item) => (
          <AccordionItem
            key={item.q}
            value={item.q}
            className="border-b border-[#e0e4d8]"
          >
            <AccordionTrigger className="items-center gap-5 py-[22px] text-[13px] font-medium">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-xs leading-[1.9] text-[#7b8274]">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
