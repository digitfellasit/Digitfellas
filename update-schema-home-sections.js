const { Pool } = require('pg');

// Hardcoded to avoid dotenv dependency issues
const DATABASE_URL = 'postgresql://root:6tITiMVbnYLnRc3jqd48DvTsD5X5xFsJ@dpg-d57pa56uk2gs73d6kdm0-a.oregon-postgres.render.com/digitfellas';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Starting Home Page Sections schema update...');

        // 1. Experience Section Table
        console.log('Creating experience_sections table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS experience_sections (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title TEXT,
                description_1 TEXT,
                description_2 TEXT,
                principles JSONB DEFAULT '[]'::jsonb,
                years_count TEXT DEFAULT '20+',
                years_label TEXT DEFAULT 'Years of Experience',
                image_url TEXT,
                image_alt TEXT DEFAULT '',
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        // Check if data exists, if not seed it (AboutSection.jsx data)
        const expCheck = await client.query('SELECT COUNT(*) FROM experience_sections');
        if (parseInt(expCheck.rows[0].count) === 0) {
            console.log('Seeding experience_sections...');
            await client.query(`
                INSERT INTO experience_sections (title, description_1, description_2, principles, years_count, years_label, image_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                'Experience Shapes Our Approach',
                'With over 20 years in the software industry, we’ve worked across technologies, platforms, and business cycles. We’ve seen what scales, what breaks, and what quietly becomes expensive over time.',
                'That experience informs how we work today — prioritizing clarity over complexity, structure over shortcuts, and systems that remain dependable long after launch.',
                JSON.stringify([
                    "Senior-led engineering and decision-making",
                    "Architecture-first thinking with governance in mind",
                    "Clear communication across technical and business stakeholders"
                ]),
                '20+',
                'Years of Experience',
                'https://avada.website/programmer/wp-content/uploads/sites/179/2023/05/about-me.jpg' // Placeholder portrait
            ]);
        }

        // 2. How We Work Section Table
        console.log('Creating how_we_work_sections table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS how_we_work_sections (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title TEXT,
                subtitle TEXT,
                pillars JSONB DEFAULT '[]'::jsonb,
                cta_text TEXT,
                cta_link TEXT,
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        // Seed How We Work (HowWeWorkSection.jsx data)
        const hwwCheck = await client.query('SELECT COUNT(*) FROM how_we_work_sections');
        if (parseInt(hwwCheck.rows[0].count) === 0) {
            console.log('Seeding how_we_work_sections...');
            await client.query(`
                INSERT INTO how_we_work_sections (title, subtitle, pillars, cta_text, cta_link)
                VALUES ($1, $2, $3, $4, $5)
            `, [
                'How We Work',
                'We engage as a long-term technology partner, not a task-based vendor.',
                JSON.stringify([
                    {
                        title: "Discovery & Audit First",
                        description: "We begin by understanding business context, existing systems, constraints, and risks before proposing solutions."
                    },
                    {
                        title: "Structured Delivery",
                        description: "Clear milestones, documented decisions, and predictable execution — without unnecessary process overhead."
                    },
                    {
                        title: "Long-Term Ownership",
                        description: "We design systems with future teams, scale, audits, and evolution in mind."
                    }
                ]),
                'Learn more about how we work',
                '/how-we-work'
            ]);
        }

        // 3. Partnerships Section Table (Generic "Content Section" could work, but sticking to specific for clarity)
        console.log('Creating partnerships_sections table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS partnerships_sections (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title TEXT,
                description TEXT,
                logos JSONB DEFAULT '[]'::jsonb,
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        // Seed Partnerships (PartnershipsSection.jsx placeholders)
        // Note: Assuming logos are managed via client_logos or similar, but section text needs management.
        const partCheck = await client.query('SELECT COUNT(*) FROM partnerships_sections');
        if (parseInt(partCheck.rows[0].count) === 0) {
            console.log('Seeding partnerships_sections...');
            await client.query(`
                INSERT INTO partnerships_sections (title, description)
                VALUES ($1, $2)
             `, [
                'Platforms & Partnerships',
                'We work with leading technologies to deliver scalable solutions.'
            ]);
        }


        console.log('Schema update and seeding completed successfully!');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
