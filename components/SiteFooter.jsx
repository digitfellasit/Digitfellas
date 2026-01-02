'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function SiteFooter() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-black text-white pt-[72px] pb-[48px] border-t border-white/10">
            <div className="container max-w-[1248px] mx-auto px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* COLUMN 1: Brand & Contact */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-8">
                            <span className="text-2xl font-bold font-heading text-white">
                                DigitFellas
                            </span>
                        </Link>

                        <div className="flex flex-col gap-4 max-w-sm">
                            {/* Contact Box: Mail */}
                            <div className="border border-white/15 p-5 rounded-[5px] flex items-center gap-4 hover:border-[#ffffff] transition-colors group">
                                <div className="bg-[#121212] p-3 rounded-full group-hover:bg-[#ffffff] transition-colors">
                                    <Mail className="w-5 h-5 text-white group-hover:text-black" />
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Email us</span>
                                    <a href="mailto:hello@digitfellas.com" className="text-sm font-bold hover:text-[#ffffff] transition-colors">
                                        hello@digitfellas.com
                                    </a>
                                </div>
                            </div>

                            {/* Contact Box: Phone */}
                            <div className="border border-white/15 p-5 rounded-[5px] flex items-center gap-4 hover:border-[#ffffff] transition-colors group">
                                <div className="bg-[#121212] p-3 rounded-full group-hover:bg-[#ffffff] transition-colors">
                                    <Phone className="w-5 h-5 text-white group-hover:text-black" />
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Call us</span>
                                    <a href="tel:+15551234567" className="text-sm font-bold hover:text-[#ffffff] transition-colors">
                                        +1 (555) 123-4567
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="flex gap-3 mt-8">
                            <SocialIcon href="#" icon={Twitter} />
                            <SocialIcon href="#" icon={Facebook} />
                            <SocialIcon href="#" icon={Instagram} />
                            <SocialIcon href="#" icon={Linkedin} />
                        </div>
                    </div>

                    {/* COLUMN 2: Explore */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 font-heading">Explore</h4>
                        <ul className="space-y-3">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/services">Our Services</FooterLink>
                            <FooterLink href="/projects">Projects</FooterLink>
                            <FooterLink href="/blog">Blog</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                        </ul>
                    </div>

                    {/* COLUMN 3: Legal */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 font-heading">Legal</h4>
                        <ul className="space-y-3">
                            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
                            <FooterLink href="/cookie-policy">Cookie Policy</FooterLink>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <p>© {currentYear} DigitFellas IT Solutions LLP. All rights reserved.</p>
                    <p>Designed with ❤️ by DigitFellas.</p>
                </div>
            </div>
        </footer>
    )
}

function SocialIcon({ href, icon: Icon }) {
    return (
        <a
            href={href}
            className="w-10 h-10 bg-[#121212] rounded-[4px] flex items-center justify-center text-white hover:bg-[#ffffff] hover:text-black transition-all duration-300"
        >
            <Icon className="w-4 h-4" />
        </a>
    )
}

function FooterLink({ href, children }) {
    return (
        <li>
            <Link
                href={href}
                className="text-gray-400 hover:text-[#ffffff] transition-colors text-[15px]"
            >
                {children}
            </Link>
        </li>
    )
}
