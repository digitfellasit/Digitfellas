// Script to populate sample data for homepage redesign
// Run with: node populate-sample-data.js

import { getPool } from './lib/db.js'
import { v4 as uuidv4 } from 'uuid'

async function populateData() {
    const pool = getPool()

    try {
        console.log('🌱 Seeding sample data...')

        // 1. Client Logos
        const logos = [
            { name: 'Avada', url: 'https://avada.website/agency/wp-content/uploads/sites/126/2021/04/client-logo-1.png' },
            { name: 'Figma', url: 'https://avada.website/agency/wp-content/uploads/sites/126/2021/04/client-logo-2.png' },
            { name: 'Canva', url: 'https://avada.website/agency/wp-content/uploads/sites/126/2021/04/client-logo-3.png' },
            { name: 'Shopify', url: 'https://avada.website/agency/wp-content/uploads/sites/126/2021/04/client-logo-4.png' },
            { name: 'WordPress', url: 'https://avada.website/agency/wp-content/uploads/sites/126/2021/04/client-logo-5.png' }
        ]

        for (const [i, logo] of logos.entries()) {
            await pool.query(`
        INSERT INTO client_logos (id, name, logo_url, sort_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING
      `, [uuidv4(), logo.name, logo.url, i])
        }
        console.log('✅ Client Logos seeded')

        // 2. Process Steps
        const steps = [
            { n: 1, title: 'I need a UX review', desc: 'We begin with a thorough audit of your current user experience to identify pain points and opportunities.', icon: 'Search' },
            { n: 2, title: 'I want a full design', desc: 'Our creative team crafts stunning, functional designs that align with your brand identity and goals.', icon: 'Palette' },
            { n: 3, title: 'Development', desc: 'We bring designs to life with clean, efficient code using the latest modern technologies.', icon: 'Code' },
            { n: 4, title: 'Launch & Scale', desc: 'We help you launch with confidence and provide ongoing support to help your product grow.', icon: 'Rocket' }
        ]

        for (const [i, step] of steps.entries()) {
            await pool.query(`
        INSERT INTO process_steps (id, step_number, title, description, icon_name, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [uuidv4(), step.n, step.title, step.desc, step.icon, i])
        }
        console.log('✅ Process Steps seeded')

        // 3. Testimonials
        const testimonials = [
            { name: 'Sarah Johnson', role: 'CTO', company: 'TechFlow', text: "DigitFellas transformed our outdated platform into a modern, high-performance web app. The team's attention to detail was incredible.", rating: 5 },
            { name: 'Michael Chen', role: 'Founder', company: 'StartUp Inc', text: "Best development agency I've worked with. They understood our vision perfectly and delivered ahead of schedule.", rating: 5 },
            { name: 'Emily Davis', role: 'Marketing Dir', company: 'CreativeCo', text: "The new website design has increased our conversion rates by 200%. Highly recommended!", rating: 5 }
        ]

        for (const [i, t] of testimonials.entries()) {
            await pool.query(`
        INSERT INTO testimonials (id, client_name, client_role, client_company, testimonial_text, rating, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [uuidv4(), t.name, t.role, t.company, t.text, t.rating, i])
        }
        console.log('✅ Testimonials seeded')

        // 4. Tech Stack
        const techs = [
            { name: 'React', cat: 'frontend', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
            { name: 'Next.js', cat: 'frontend', url: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png' },
            { name: 'Tailwind', cat: 'frontend', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg' },
            { name: 'Node.js', cat: 'backend', url: 'https://nodejs.org/static/images/logo.svg' },
            { name: 'PostgreSQL', cat: 'database', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg' },
            { name: 'Figma', cat: 'tools', url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' }
        ]

        for (const [i, t] of techs.entries()) {
            await pool.query(`
        INSERT INTO tech_stack (id, name, icon_url, category, sort_order)
        VALUES ($1, $2, $3, $4, $5)
      `, [uuidv4(), t.name, t.url, t.cat, i])
        }
        console.log('✅ Tech Stack seeded')

    } catch (err) {
        console.error('❌ Error seeding data:', err)
    } finally {
        await pool.end()
        process.exit(0)
    }
}

populateData()
