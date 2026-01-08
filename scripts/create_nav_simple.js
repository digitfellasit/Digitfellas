const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: (() => {
        try {
            const envPath = path.join(__dirname, '..', '.env');
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/DATABASE_URL=(.*)/);
            return match ? match[1].trim().replace(/(^"|"$)/g, '') : null;
        } catch (e) {
            return null;
        }
    })()
});

async function run() {
    try {
        console.log("Creating table...");
        await pool.query(`
      CREATE TABLE IF NOT EXISTS navigation_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        label VARCHAR(255) NOT NULL,
        url VARCHAR(500),
        type VARCHAR(50) DEFAULT 'link',
        parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log("Seeding data...");
        const check = await pool.query("SELECT count(*) FROM navigation_items");
        if (check.rows[0].count == 0) {
            await pool.query(`
            INSERT INTO navigation_items (label, url, type, sort_order) VALUES
            ('About', '/about', 'link', 0),
            ('Capabilities', '/services', 'dropdown', 10),
            ('How We Work', '/#how-we-work', 'link', 20),
            ('Case Studies', '/case-studies', 'link', 30),
            ('Insights', '/insights', 'link', 40),
            ('Partnerships', '#partnerships', 'link', 50),
            ('Contact', '/contact', 'link', 60);
        `);
            console.log("Seeded.");
        } else {
            console.log("Already seeded.");
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

run();
