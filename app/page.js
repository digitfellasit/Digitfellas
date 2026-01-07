import dynamic from 'next/dynamic'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { HeroSection } from '@/components/sections/HeroSection'

import { ProfessionalServices } from '@/components/sections/ProfessionalServices'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getHomeData } from '@/lib/data'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

// Lazy load below-fold sections
const MainServicesProjects = dynamic(() => import('@/components/sections/MainServicesProjects').then(mod => ({ default: mod.MainServicesProjects })), {
  loading: () => <div className="min-h-[400px]" />,
})
const AboutSection = dynamic(() => import('@/components/sections/AboutSection').then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="min-h-[300px]" />,
})
const HowWeWorkSection = dynamic(() => import('@/components/sections/HowWeWorkSection').then(mod => ({ default: mod.HowWeWorkSection })), {
  loading: () => <div className="min-h-[400px]" />,
})
const SelectedWorkSection = dynamic(() => import('@/components/sections/SelectedWorkSection').then(mod => ({ default: mod.SelectedWorkSection })), {
  loading: () => <div className="min-h-[400px]" />,
})
const PartnershipsSection = dynamic(() => import('@/components/sections/PartnershipsSection').then(mod => ({ default: mod.PartnershipsSection })), {
  loading: () => <div className="min-h-[200px]" />,
})
const InsightsSection = dynamic(() => import('@/components/sections/InsightsSection').then(mod => ({ default: mod.InsightsSection })), {
  loading: () => <div className="min-h-[400px]" />,
})
const ServicesPromo = dynamic(() => import('@/components/sections/ServicesPromo').then(mod => ({ default: mod.ServicesPromo })), {
  loading: () => <div className="min-h-[400px]" />,
})
const BannerPromo = dynamic(() => import('@/components/sections/BannerPromo').then(mod => ({ default: mod.BannerPromo })), {
  loading: () => <div className="min-h-[200px]" />,
})


export const revalidate = 60

export default async function Home() {
  const { hero, services, projects, posts, experience, howWeWork, partnerships, clientLogos } = await getHomeData()

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <HeroSection hero={hero} />
        {/* SponsorsSection moved to bottom */}
        <ProfessionalServices services={services} />
        {/* <MainServicesProjects services={services} projects={projects} /> */}
        <AboutSection data={experience} />
        <HowWeWorkSection data={howWeWork} />
        <SelectedWorkSection />
        <PartnershipsSection data={partnerships} logos={clientLogos} />
        <InsightsSection posts={posts} />


        {/* CTA Section */}
        {/* CTA Section (Closing Section) */}
        {/* CTA Section (Closing Section) */}
        {/* CTA Section (Closing Section) */}
        <section className="relative py-32 overflow-hidden border-t border-border transition-colors duration-300">
          {/* Corporate Background: Subtle Grid + Radial Glow */}
          <div className="absolute inset-0 bg-[#01010e] z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
          </div>

          <div className="container relative z-10 max-w-4xl mx-auto px-6 text-center">
            <ScrollReveal variant="fade-up">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-heading tracking-tight text-foreground">
                We work best with organizations that value <span className="text-primary">clarity</span>, <span className="text-primary">structure</span>, and <span className="text-primary">long-term thinking</span>.
              </h2>

              <div className="flex flex-col items-center gap-8 mt-12">
                <Button asChild size="lg" className="bg-foreground hover:bg-foreground/90 text-background font-bold rounded-full px-12 h-16 text-lg transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-primary/20">
                  <Link href="/contact">
                    Start a Conversation
                  </Link>
                </Button>

                <p className="text-muted-foreground text-base font-medium font-body max-w-lg mx-auto">
                  We’ll respond with context — not a sales pitch.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>


      </main>
    </>
  )
}
