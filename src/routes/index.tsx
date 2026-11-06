import { LandingHeader } from '#/components/home/landing-header'
import { LandingFooter } from '#/components/home/landing-footer'
import { AboutSection } from '#/components/home/about-section'
import { CallToActionSection } from '#/components/home/call-to-action-section'
import { DemoSection } from '#/components/home/demo-section'
import { FaqSection } from '#/components/home/faq-section'
import { FeaturesSection } from '#/components/home/features-section'
import { HeroSection } from '#/components/home/hero-section'
import { HowItWorksSection } from '#/components/home/how-it-works-section'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div
      className="bg-[#fcfbf7] font-sans text-[#253e32] [&_em]:font-serif [&_em]:font-normal [&_em]:text-[#718567] [&_h2]:my-4 [&_h2]:font-heading [&_h2]:text-[34px] [&_h2]:leading-[1.2] [&_h2]:font-medium [&_h2]:tracking-[-1.3px] md:[&_h2]:text-[39px] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#a6b784] motion-reduce:**:transition-none"
      id="beranda"
    >
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <HowItWorksSection />
        <DemoSection />
        <FaqSection />
        <CallToActionSection />
      </main>
      <LandingFooter />
    </div>
  )
}
