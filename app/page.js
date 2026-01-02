import dynamic from 'next/dynamic'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { HeroSection } from '@/components/sections/HeroSection'
import { SponsorsSection } from '@/components/sections/SponsorsSection'
import { ProfessionalServices } from '@/components/sections/ProfessionalServices'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getHomeData } from '@/lib/data'

// Lazy load below-fold sections
const MainServicesProjects = dynamic(() => import('@/components/sections/MainServicesProjects').then(mod => ({ default: mod.MainServicesProjects })), {
  loading: () => <div className="min-h-[400px]" />,
})
const AboutSection = dynamic(() => import('@/components/sections/AboutSection').then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="min-h-[300px]" />,
})
const BlogSection = dynamic(() => import('@/components/sections/BlogSection').then(mod => ({ default: mod.BlogSection })), {
  loading: () => <div className="min-h-[400px]" />,
})
const ServicesPromo = dynamic(() => import('@/components/sections/ServicesPromo').then(mod => ({ default: mod.ServicesPromo })), {
  loading: () => <div className="min-h-[400px]" />,
})
const BannerPromo = dynamic(() => import('@/components/sections/BannerPromo').then(mod => ({ default: mod.BannerPromo })), {
  loading: () => <div className="min-h-[200px]" />,
})
const ProcessStepsSection = dynamic(() => import('@/components/sections/ProcessSteps').then(mod => ({ default: mod.ProcessStepsSection })), {
  loading: () => <div className="min-h-[400px]" />,
})
const TestimonialsSection = dynamic(() => import('@/components/sections/Testimonials').then(mod => ({ default: mod.TestimonialsSection })), {
  loading: () => <div className="min-h-[400px]" />,
})
const TechStackSection = dynamic(() => import('@/components/sections/TechStack').then(mod => ({ default: mod.TechStackSection })), {
  loading: () => <div className="min-h-[300px]" />,
})

export const revalidate = 60

export default async function Home() {
  const { hero, services, projects, posts } = await getHomeData()

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <HeroSection hero={hero} />
        <SponsorsSection />
        <ProfessionalServices />
        <MainServicesProjects services={services} projects={projects} />
        <AboutSection />
        <BlogSection posts={posts} />
        <ServicesPromo services={services} />
        <BannerPromo />
        <ProcessStepsSection />
        <TestimonialsSection />

        {/* CTA Section */}
        <section className="py-24 bg-[#0F0F0F] text-white text-center">
          <div className="container px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to transform your business?</h2>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 h-16 text-xl">
              <Link href="/contact">
                Let's Work Together <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <TechStackSection />
      </main>
    </>
  )
}
