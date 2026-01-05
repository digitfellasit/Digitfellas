const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const services = [
    {
        title: "Digital Product Engineering",
        short_description: "Web and mobile systems built to scale.",
        slug: "digital-product-engineering",
        sort_order: 1
    },
    {
        title: "Commerce & Platform Engineering",
        short_description: "Scalable commerce and enterprise platforms.",
        slug: "commerce-platform-engineering",
        sort_order: 2
    },
    {
        title: "AI & Automation Engineering",
        short_description: "Intelligent automation for real business workflows.",
        slug: "ai-automation-engineering",
        sort_order: 3
    },
    {
        title: "Security & Assurance",
        short_description: "Software security, audits, and risk assurance.",
        slug: "security-assurance",
        sort_order: 4
    }
];

async function updateServices() {
    const client = await pool.connect();
    try {
        console.log('Starting services update...');
        await client.query('BEGIN');

        // Delete existing services to ensure clean state
        await client.query('DELETE FROM services');
        console.log('Cleared existing services.');

        for (const service of services) {
            // Using minimal fields initially; description and content can be empty for now
            await client.query(`
                INSERT INTO services (title, short_description, slug, sort_order, is_published, content, description)
                VALUES ($1, $2, $3, $4, true, '', '')
            `, [service.title, service.short_description, service.slug, service.sort_order]);
        }

        await client.query('COMMIT');
        console.log('Services updated successfully.');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error updating services:', e);
    } finally {
        client.release();
        await pool.end();
    }
}

updateServices();
