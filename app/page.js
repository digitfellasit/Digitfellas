'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, useRef } from 'react'
import { ArrowRight, CheckCircle2, Code2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useHero, useServices, useProjects, useBlog, useSite } from '@/lib/api-hooks'

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

function CardImageCarousel({ images, featuredImage, alt, className = "" }) {
  const [index, setIndex] = useState(0)
  const items = useMemo(() => {
    const list = []
    if (featuredImage?.url) list.push(featuredImage)

    if (images && Array.isArray(images)) {
      images.forEach(img => {
        if (img?.url && img.url !== featuredImage?.url) {
          list.push(img)
        }
      })
    }

    if (list.length === 0) list.push({ url: '/uploads/placeholder-hero.jpg' })
    return list
  }, [images, featuredImage])

  useEffect(() => {
    if (items.length <= 1) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [items])

  return (
    <div className={cx("relative w-full h-full overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={items[index]?.url || '/uploads/placeholder-hero.jpg'}
            alt={alt}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}


function RotatingText() {
  const words = ['Modern', 'Scalable', 'Innovative', 'Professional', 'Dynamic']
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mb-4">
      <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl leading-[1.05]">
        <span className="text-white">Hello! We Are A</span>
        <br />
        <span className="text-white">Group Of </span>
        <span className="inline-block">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block text-white"
            >
              Skilled <span className="text-yellow-500">and</span> Innovative
            </motion.span>
          </AnimatePresence>
        </span>
        <br />
        <span className="text-white">Developers And</span>
        <br />
        <span className="text-white">Programmers.</span>
      </h1>
    </div>
  )
}

function Hero({ hero }) {
  const allMedia = hero?.media || []
  const bullets = hero?.bullets || []

  // Group images into sets (e.g., 3 images per set)
  const imageSets = useMemo(() => {
    if (allMedia.length === 0) return []
    const sets = []
    for (let i = 0; i < allMedia.length; i += 3) {
      sets.push(allMedia.slice(i, i + 3))
    }
    return sets
  }, [allMedia])

  const [setIndex, setSetIndex] = useState(0)

  useEffect(() => {
    if (imageSets.length <= 1) return
    const interval = setInterval(() => {
      setSetIndex((prev) => (prev + 1) % imageSets.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [imageSets])

  const currentSet = imageSets[setIndex] || []

  return (
    <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-16">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Colorful glows - Infinite slow movement */}
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 left-1/4 h-[800px] w-[800px] rounded-full bg-purple-500/10 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[130px]"
        />
      </div>

      <div className="container relative z-10 grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col items-start">
          <Reveal>
            <div className="px-4 py-1 rounded-full border border-[#eab308]/30 bg-[#eab308]/10 text-[11px] font-bold uppercase tracking-[0.2em] text-[#eab308] mb-4 inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#eab308] animate-pulse" />
              {hero?.kicker || 'Avada Programmer'}
            </div>
          </Reveal>

          <RotatingText />

          <Reveal delay={0.2}>
            <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg mb-6">
              {hero?.subtitle ||
                'We have experience in working with different platforms, systems, and devices to create products that are compatible and accessible.'}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center w-full sm:w-auto">
              <Button asChild size="lg" className="rounded-2xl px-10 py-6 text-base font-bold bg-white text-black hover:bg-white/90 shadow-2xl shadow-white/10 transition-all group">
                <Link href={hero?.primary_cta_url || '/contact'} className="flex items-center gap-3">
                  {hero?.primary_cta_label || 'View Portfolio'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2">
            {bullets.slice(0, 4).map((b, i) => (
              <Reveal key={b?.id} delay={0.4 + i * 0.1}>
                <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground group">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <span className="group-hover:text-white transition-colors duration-300 text-xs sm:text-sm">{b?.text}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2} className="relative h-[450px] flex items-center justify-center lg:justify-end">
          <div className="relative w-full h-full max-w-md">
            {/* Background Blob - Infinite Rotation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-blue-500/20 blur-3xl -z-10"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={setIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {/* Main Mockup (Image 1) */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] z-20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative overflow-hidden rounded-[1.5rem] border border-white/20 shadow-[-10px_20px_40px_rgba(0,0,0,0.5)] bg-[#0f1419] aspect-[16/10]"
                  >
                    <img
                      src={currentSet[0]?.url || '/uploads/placeholder-hero.jpg'}
                      alt="Main Feature"
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-transparent to-transparent opacity-60" />
                  </motion.div>
                </motion.div>

                {/* Overlapping Card 1 (Image 2) */}
                <motion.div
                  className="absolute top-4 right-0 w-[35%] z-30"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="overflow-hidden rounded-xl border border-white/20 shadow-2xl aspect-square bg-[#0f1419]"
                  >
                    <img
                      src={currentSet[1]?.url || currentSet[0]?.url || '/uploads/placeholder-hero.jpg'}
                      alt="Sub Feature"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </motion.div>

                {/* Overlapping Card 2 (Image 3 or Code) */}
                <motion.div
                  className="absolute bottom-8 left-0 w-[40%] z-40"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="group relative"
                  >
                    {currentSet[2] ? (
                      <div className="overflow-hidden rounded-xl border border-white/20 shadow-2xl aspect-square bg-[#0f1419]">
                        <img src={currentSet[2].url} alt="Sub Feature 2" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e]/90 backdrop-blur-md shadow-2xl p-5">
                        <div className="flex gap-1.5 mb-2">
                          <div className="w-2 h-2 rounded-full bg-red-500/30" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                          <div className="w-2 h-2 rounded-full bg-green-500/30" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1 w-[80%] bg-blue-400/20 rounded-full" />
                          <div className="h-1 w-[60%] bg-purple-400/20 rounded-full" />
                          <div className="h-1 w-[90%] bg-green-400/20 rounded-full" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={cx('max-w-3xl mb-12', align === 'center' ? 'mx-auto text-center' : '')}>
      {eyebrow ? (
        <div className={cx('text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4', align === 'center' ? 'justify-center' : '')}>
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl text-gradient">{title}</h2>
      {description ? <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{description}</p> : null}
    </div>
  )
}

function Services({ services }) {
  const items = services || []
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e, currentTarget) => {
    const rect = currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePosition({ x, y })
    currentTarget.style.setProperty('--mouse-x', `${x}px`)
    currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <section className="container py-24 md:py-32" id="services">
      <Reveal>
        <SectionHeading
          eyebrow="Expertise"
          title="Engineering, design, and automation."
          description="End-to-end delivery from idea to deployment — optimized for speed and reliability."
        />
      </Reveal>

      <div className="grid gap-8 md:grid-cols-3">
        {items.map((s, i) => (
          <Reveal key={s?.id} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -10, scale: 1.02 }}
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              className="group h-full card-glow border-gradient rounded-[2.5rem] bg-card/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20"
            >
              <div className="relative h-full flex flex-col p-8 z-10">
                <div className="mb-8 w-full h-56 rounded-3xl overflow-hidden relative border border-white/5 shadow-inner">
                  <CardImageCarousel
                    images={s.images}
                    featuredImage={s.featured_image}
                    alt={s.featured_image?.alt || s.title}
                    className="group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="rounded-full px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider bg-primary/10 text-primary border-none">
                    {s?.category_name || 'Service'}
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{s?.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8 flex-grow line-clamp-4">{s?.excerpt || s?.description}</p>

                <Link href={`/services/${s?.slug}`} className="group/link inline-flex items-center gap-2 font-bold text-sm text-primary">
                  <span className="relative">
                    Learn More
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover/link:w-full" />
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Projects({ projects }) {
  const items = projects || []

  return (
    <section className="relative py-24 md:py-32 bg-muted/30 overflow-hidden" id="projects">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <Reveal align="center">
          <SectionHeading
            align="center"
            eyebrow="Showcase"
            title="Work that looks great and performs."
            description="Selected case studies and builds across web, automation, and product engineering."
          />
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal key={p?.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -12 }}
                className="group relative h-[500px] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 z-0">
                  <CardImageCarousel
                    images={p.images}
                    featuredImage={p.featured_image}
                    alt={p?.featured_image?.alt || p?.title}
                    className="transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                </div>

                <div className="relative h-full flex flex-col justify-end p-8 z-10">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Badge className="mb-4 rounded-full bg-primary/20 backdrop-blur-md text-primary-foreground border-none px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest" variant="secondary">
                      {p?.category_name || 'Project'}
                    </Badge>
                    <h3 className="text-3xl font-extrabold text-white mb-4 leading-tight">{p?.title}</h3>
                    <p className="text-gray-300 line-clamp-2 leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {p?.excerpt || p?.description}
                    </p>
                  </div>

                  <div className="overflow-hidden">
                    <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-200">
                      <Button asChild size="lg" className="w-full rounded-2xl py-7 font-bold bg-white text-black hover:bg-primary hover:text-white transition-all">
                        <Link href={`/projects/${p?.slug}`}>
                          View Case Study <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogPreview({ posts }) {
  const items = posts || []

  return (
    <section className="container py-24 md:py-32" id="blog">
      <Reveal>
        <SectionHeading
          eyebrow="Lab"
          title="Articles & updates"
          description="Practical engineering notes, product thinking, and delivery lessons."
        />
      </Reveal>

      <div className="grid gap-10 md:grid-cols-3">
        {items.map((post, i) => (
          <Reveal key={post?.id} delay={i * 0.1}>
            <Link href={`/blog/${post?.slug || ''}`} className="group block h-full">
              <div className="flex flex-col h-full space-y-6">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl group-hover:border-primary/50 transition-colors duration-500">
                  <img
                    alt={post?.featured_image?.alt || post?.title}
                    src={post?.featured_image?.url || post?.featured_image_url || '/uploads/placeholder-blog.jpg'}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 scale-50 group-hover:scale-100 transition-transform duration-500">
                      <ArrowRight className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex-grow space-y-4">
                  <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    <span className="h-[2px] w-10 bg-primary/20 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                    {post?.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Technical Article'}
                  </div>

                  <h3 className="text-2xl font-extrabold leading-tight group-hover:text-primary transition-colors duration-300">
                    {post?.title}
                  </h3>

                  <p className="line-clamp-3 text-muted-foreground leading-relaxed">
                    {post?.excerpt}
                  </p>

                  <div className="pt-4 flex items-center gap-2 text-sm font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Read Report <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Footer({ site }) {
  const footer = site?.footer
  const socials = footer?.socials || []

  return (
    <footer className="relative border-t border-border/60 bg-muted/20 pb-12 pt-24">
      <div className="container relative z-10">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Code2 className="h-6 w-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">{site?.brand?.name || 'Digitfellas'}</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">{footer?.tagline || 'Professional IT solutions for modern teams.'}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-foreground/80">Navigation</h4>
            <ul className="grid gap-4">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="#projects" className="text-muted-foreground hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="#blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-foreground/80">Get in Touch</h4>
            <div className="grid gap-4 text-muted-foreground">
              <a href={`mailto:${footer?.contact?.email}`} className="hover:text-primary transition-colors">{footer?.contact?.email || 'info@digitfellas.com'}</a>
              <div className="mt-1">{footer?.contact?.address || 'India'} </div>
              <Button asChild size="sm" className="w-fit rounded-full px-6 premium-gradient mt-2">
                <Link href="/contact">Quick Message</Link>
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-foreground/80">Socials</h4>
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <motion.a
                  key={s?.id}
                  href={s?.href || '#'}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border glass hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <span className="sr-only">{s?.label}</span>
                  <span className="text-xs font-bold leading-none">{s?.label?.[0]}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="mt-20 mb-8 opacity-50" />
        <div className="flex flex-col gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {site?.brand?.name || 'Digitfellas IT Solutions LLP'}. Crafted for excellence.</div>
          <div className="flex gap-8">
            <Link className="hover:text-foreground transition-colors" href="/privacy">Privacy</Link>
            <Link className="hover:text-foreground transition-colors" href="/admin">Admin access</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  const { hero } = useHero('home')
  const { services } = useServices()
  const { projects } = useProjects()
  const { posts } = useBlog()
  const { site } = useSite()

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-purple-500/30">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 origin-left z-[100]"
        style={{ scaleX }}
      />
      <main>
        <Hero hero={hero} />
        <Services services={services?.slice(0, 6)} />
        <Projects projects={projects?.slice(0, 6)} />
        <BlogPreview posts={posts?.slice(0, 3)} />
        <Footer site={site} />
      </main>
    </div>
  )
}
