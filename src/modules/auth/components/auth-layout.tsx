import { Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, PawPrint } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fcfbf7] font-sans text-[#253e32] lg:grid lg:grid-cols-[1fr_1fr]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#e9ecdf] p-14 lg:flex lg:flex-col">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight"
        >
          <PawPrint />
          AnabulCare
        </Link>

        <div className="relative z-10 mt-16 max-w-md">
          <span className="text-[10px] font-semibold tracking-[2px] text-[#718567]">
            UNTUK SETIAP MEONG YANG BERARTI
          </span>

          <h2 className="mt-5 font-heading text-5xl leading-[1.1] tracking-tight">
            Teman kecilmu.
            <br />
            <em className="font-serif font-normal text-[#718567]">
              Cerita besarmu.
            </em>
          </h2>

          <p className="mt-5 max-w-sm text-sm leading-7 text-[#737a70]">
            Satu tempat untuk memulai perjalanan memahami kucing kesayanganmu.
          </p>
        </div>

        <div className="relative mt-10 max-w-lg flex-1 overflow-hidden rounded-t-[160px] rounded-b-2xl min-h-64">
          <img
            src="/images/anabul-cat.jpg"
            alt="Kucing oranye yang penasaran"
            className="absolute inset-0 size-full object-cover object-[50%_40%]"
          />

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/50 to-transparent p-7 pt-16 text-sm text-white">
            <Heart className="mb-2 size-5" />
            Karena sayang dimulai dari memahami.
          </div>
        </div>
      </aside>

      <section className="flex min-h-screen flex-col px-6 py-8 sm:px-12 lg:px-16">
        <Link
          to="/"
          className="flex w-fit items-center gap-2 text-xs text-[#737a70] hover:text-[#284f3d]"
        >
          <ArrowLeft className="size-4" />
          Kembali ke beranda
        </Link>

        <div className="mx-auto flex w-full max-w-100 flex-1 flex-col justify-center py-12">
          <div className="mb-7 flex size-12 items-center justify-center rounded-2xl bg-[#edf0e7] text-[#718567]">
            <PawPrint className="size-6" />
          </div>

          {children}
        </div>

        <p className="text-center text-[10px] text-[#909485]">
          Dibuat dengan peduli, untuk kamu dan kucingmu.
        </p>
      </section>
    </main>
  );
}