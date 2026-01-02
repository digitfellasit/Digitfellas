import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { HeroSection } from '@/components/sections/HeroSection'
import { SponsorsSection } from '@/components/sections/SponsorsSection'
import { ProfessionalServices } from '@/components/sections/ProfessionalServices'
import { MainServicesProjects } from '@/components/sections/MainServicesProjects'
import { AboutSection } from '@/components/sections/AboutSection'
import { BlogSection } from '@/components/sections/BlogSection'
import { ServicesPromo } from '@/components/sections/ServicesPromo'
import { BannerPromo } from '@/components/sections/BannerPromo'
import { ProcessStepsSection } from '@/components/sections/ProcessSteps'
import { TestimonialsSection } from '@/components/sections/Testimonials'
import { TechStackSection } from '@/components/sections/TechStack'

// Server Component data fetching
async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  try {
    const [heroRes, servicesRes, projectsRes, blogRes] = await Promise.all([
      fetch(`http://localhost:3000/api/hero/home`, { next: { revalidate: 60, tags: ['hero'] } }),
      fetch(`http://localhost:3000/api/services`, { next: { revalidate: 60, tags: ['services'] } }),
      fetch(`http://localhost:3000/api/projects`, { next: { revalidate: 60, tags: ['projects'] } }),
      fetch(`http://localhost:3000/api/blog`, { next: { revalidate: 60, tags: ['blog'] } })
    ])

    const hero = heroRes.ok ? await heroRes.json() : {}
    const services = servicesRes.ok ? await servicesRes.json() : []
    const projects = projectsRes.ok ? await projectsRes.json() : []
    const posts = blogRes.ok ? await blogRes.json() : []

    console.log('Hero Data Fetched:', hero?.title, 'Media Count:', hero?.media?.length)

    return { hero, services, projects, posts }
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    return { hero: {}, services: [], projects: [], posts: [] }
  }
}

export default async function Home() {
  const { hero, services, projects, posts } = await getData()

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
        <TechStackSection />
      </main>
    </>
  )
}
