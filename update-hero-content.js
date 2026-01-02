const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/digitfellas_db',
});

async function updateHero() {
    try {
        const client = await pool.connect();
        console.log('Connected to database...');

        const updateQuery = `
      UPDATE hero_sections
      SET 
        title = 'Hello! We Are A Group Of | Skilled, Talented, Creative | Developers And Programmers.',
        kicker = 'Avada Programmer',
        subtitle = 'We build digital products that help businesses grow. From simple websites to complex web applications, we deliver quality code provided by the best experts in the field.',
        primary_cta_label = 'Learn about our services',
        primary_cta_url = '/services',
        updated_at = NOW()
      WHERE page_key = 'home'
      RETURNING *;
    `;

        const res = await client.query(updateQuery);

        if (res.rows.length > 0) {
            console.log('Successfully updated Hero Section content:', res.rows[0].title);
        } else {
            // If no row exists, we should insert it?
            console.log('No hero section found for page_key="home". Attempting insert...');
            const insertQuery = `
            INSERT INTO hero_sections (id, page_key, title, kicker, subtitle, primary_cta_label, primary_cta_url, is_active)
            VALUES (
                gen_random_uuid(),
                'home', 
                'Hello! We Are A Group Of | Skilled, Talented, Creative | Developers And Programmers.',
                'Avada Programmer',
                'We build digital products that help businesses grow. From simple websites to complex web applications, we deliver quality code provided by the best experts in the field.',
                'Learn about our services',
                '/services',
                true
            )
            RETURNING *;
        `;
            const insertRes = await client.query(insertQuery);
            console.log('Successfully inserted Hero Section:', insertRes.rows[0].title);
        }

        client.release();
    } catch (err) {
        console.error('Error updating hero content:', err);
    } finally {
        pool.end();
    }
}

updateHero();
