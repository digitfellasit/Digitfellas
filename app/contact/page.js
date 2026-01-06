'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Mail, Phone, MapPin, ArrowRight, Loader2 } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useRef } from 'react'

export default function Page() {
  const [site, setSite] = useState(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', message: '' })
  const [captchaToken, setCaptchaToken] = useState(null)
  const recaptchaRef = useRef(null)

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill out all required fields.")
      return
    }

    if (!captchaToken) {
      setError("Please complete the reCAPTCHA.")
      return
    }

    setLoading(true)
    setError('')
    setSent(false)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to send message')

      setSent(true)
      setFormData({ name: '', email: '', company: '', phone: '', message: '' })
      setCaptchaToken(null)
      recaptchaRef.current?.reset()
    } catch (err) {
      setError(err.message)
      recaptchaRef.current?.reset()
      setCaptchaToken(null)
    } finally {
      setLoading(false)
    }
  }

  // Fetch site data for footer contact info (if needed dynamically) or hardcode if preferred to match design
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/site', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          setSite(json)
        }
      } catch (e) {
        console.error("Failed to fetch site info", e)
      }
    }
    run()
  }, [])

  const inputClasses = "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20 h-12 rounded-xl px-4 text-base transition-all"

  return (
    <div className="min-h-screen bg-[#01010e] text-white pt-24 pb-20">
      <div className="container max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

          {/* Left Column: Context & Info */}
          <div className="flex flex-col justify-center">
            <ScrollReveal variant="fade-right">
              <h1 className="text-4xl md:text-4xl font-bold font-heading leading-tight mb-8">
                Start a Conversation.
              </h1>
              <p className="text text-gray-400 font-body leading-relaxed mb-12 max-w-lg">
                We work best with organizations that value clarity, structure, and long-term thinking. We’ll respond with context — not a sales pitch.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-full border border-white/10">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                    <a href="mailto:hello@digitfellas.com" className="text-gray-400 hover:text-white transition-colors">
                      {site?.footer?.contact?.email || 'hello@digitfellas.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-full border border-white/10">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Office</h3>
                    <p className="text-gray-400">
                      {site?.footer?.contact?.address || 'chennai, Tamil Nadu, India'}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Form */}
          <div className="bg-[#02000f] p-6 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />

            <ScrollReveal variant="fade-left" delay={200}>
              <div className="space-y-5 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">Full Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">Company / Organization</label>
                    <Input
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">Phone Number</label>
                    <Input
                      placeholder="+91 00000 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">Email Address *</label>
                    <Input
                      placeholder="john@company.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">Project Details *</label>
                  <Textarea
                    placeholder="Tell us about your project or inquiry..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-white/20 rounded-xl px-4 py-3 text-base resize-none min-h-[100px] transition-all"
                  />
                </div>

                {/* reCAPTCHA Section */}
                <div className="flex justify-center md:justify-start transform scale-90 origin-left">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // Fallback to test key if not set
                    onChange={(token) => setCaptchaToken(token)}
                    theme="dark"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full bg-white hover:bg-gray-200 text-[#0c053e] font-black h-12 rounded-xl text-base transition-all uppercase tracking-widest shadow-xl"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        Send Message <ArrowRight className="ml-2 h-6 w-6" />
                      </>
                    )}
                  </Button>
                </div>

                {sent && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-center font-bold animate-in fade-in slide-in-from-bottom-2">
                    Message sent successfully! We'll be in touch.
                  </div>
                )}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center font-bold animate-in fade-in slide-in-from-bottom-2">
                    {error}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </div>
  )
}
