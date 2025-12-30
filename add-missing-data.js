const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const DATABASE_URL = 'postgresql://root:6tITiMVbnYLnRc3jqd48DvTsD5X5xFsJ@dpg-d57pa56uk2gs73d6kdm0-a.oregon-postgres.render.com/digitfellas';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function addMissingData() {
    console.log('🚀 Adding missing projects and blog posts...');

    try {
        // Check if projects exist
        const pCount = await pool.query('SELECT COUNT(*) FROM projects');
        if (parseInt(pCount.rows[0].count) === 0) {
            console.log('Adding projects...');
            // Get a category
            const catRes = await pool.query("SELECT id FROM categories WHERE type='project' LIMIT 1");
            const catId = catRes.rows[0]?.id;

            if (catId) {
                await pool.query(`
          INSERT INTO projects (id, title, slug, description, excerpt, client_name, project_url, category_id, is_published, is_featured, completed_at)
          VALUES 
            ($1, 'E-Commerce Platform', 'ecommerce-platform', 'Full stack e-commerce', 'Modern e-commerce solution.', 'TechStore', 'https://example.com', $3, true, true, '2024-12-01'),
            ($2, 'Task App', 'task-app', 'Task management tool', 'Team productivity.', 'ProdCo', 'https://example.com', $3, true, false, '2024-11-01')
        `, [uuidv4(), uuidv4(), catId]);
                console.log('✅ Projects added');
            } else {
                console.log('⚠️ No project category found, skipping projects');
            }
        } else {
            console.log(`Projects already exist (${pCount.rows[0].count})`);
        }

        // Check if blog posts exist
        const bCount = await pool.query('SELECT COUNT(*) FROM blog_posts');
        if (parseInt(bCount.rows[0].count) === 0) {
            console.log('Adding blog posts...');
            await pool.query(`
        INSERT INTO blog_posts (id, title, slug, content, excerpt, author_name, is_published, published_at, reading_time_minutes)
        VALUES 
          ($1, 'Next.js 14 Guide', 'nextjs-14-guide', 'Content about Next.js 14...', 'Learn Next.js 14.', 'John Doe', true, NOW(), 5),
          ($2, 'Node.js API Tips', 'nodejs-api-tips', 'Content about Node.js...', 'Scalable APIs.', 'Jane Smith', true, NOW(), 8)
      `, [uuidv4(), uuidv4()]);
            console.log('✅ Blog posts added');
        } else {
            console.log(`Blog posts already exist (${bCount.rows[0].count})`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

addMissingData();
