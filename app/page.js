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
  const { hero, services, projects, posts } = await getHomeData()

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <HeroSection hero={hero} />
        {/* SponsorsSection moved to bottom */}
        <ProfessionalServices services={services} />
        {/* <MainServicesProjects services={services} projects={projects} /> */}
        <AboutSection />
        <HowWeWorkSection />
        <SelectedWorkSection />
        <PartnershipsSection />
        <InsightsSection posts={posts} />


        {/* CTA Section */}
        {/* CTA Section (Closing Section) */}
        {/* CTA Section (Closing Section) */}
        <section className="py-32 bg-background text-foreground text-center border-t border-border transition-colors duration-300">
          <div className="container max-w-4xl mx-auto px-6">
            <ScrollReveal variant="fade-up">
              <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-tight font-heading">
                We work best with organizations that value clarity, structure, and long-term thinking.
              </h2>

              <div className="flex flex-col items-center gap-6">
                <Button asChild size="lg" className="bg-foreground hover:bg-foreground/80 text-background font-bold rounded-full px-12 h-16 text-lg transition-all duration-300 transform hover:scale-105">
                  <Link href="/contact">
                    Start a Conversation
                  </Link>
                </Button>

                <p className="text-muted-foreground text-sm font-body">
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
