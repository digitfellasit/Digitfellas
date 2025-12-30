const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkDatabase() {
    try {
        console.log('Checking database tables and data...\n');

        // Check if tables exist
        const tablesResult = await pool.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('services', 'projects', 'blog_posts', 'cms_pages', 'navigation_items', 'media_items', 'hero_sections')
      ORDER BY tablename
    `);

        console.log('✓ Tables found:');
        tablesResult.rows.forEach(row => console.log(`  - ${row.tablename}`));
        console.log('');

        // Count records in each table
        const counts = await Promise.all([
            pool.query('SELECT COUNT(*) FROM services'),
            pool.query('SELECT COUNT(*) FROM projects'),
            pool.query('SELECT COUNT(*) FROM blog_posts'),
            pool.query('SELECT COUNT(*) FROM cms_pages'),
            pool.query('SELECT COUNT(*) FROM navigation_items'),
            pool.query('SELECT COUNT(*) FROM media_items'),
            pool.query('SELECT COUNT(*) FROM hero_sections'),
        ]);

        console.log('Record counts:');
        console.log(`  Services: ${counts[0].rows[0].count}`);
        console.log(`  Projects: ${counts[1].rows[0].count}`);
        console.log(`  Blog Posts: ${counts[2].rows[0].count}`);
        console.log(`  CMS Pages: ${counts[3].rows[0].count}`);
        console.log(`  Navigation Items: ${counts[4].rows[0].count}`);
        console.log(`  Media Items: ${counts[5].rows[0].count}`);
        console.log(`  Hero Sections: ${counts[6].rows[0].count}`);
        console.log('');

        // List hero sections
        const heroResult = await pool.query('SELECT id, page_key, title, subtitle FROM hero_sections ORDER BY created_at DESC');
        if (heroResult.rows.length > 0) {
            console.log('Hero Sections:');
            heroResult.rows.forEach(hero => {
                console.log(`  - ${hero.page_key}: "${hero.title}" (ID: ${hero.id})`);
                if (hero.subtitle) console.log(`    Subtitle: ${hero.subtitle}`);
            });
        } else {
            console.log('No hero sections found.');
        }
        console.log('');

        // List services
        const servicesResult = await pool.query('SELECT id, title, slug, is_published FROM services WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 5');
        if (servicesResult.rows.length > 0) {
            console.log('Services (latest 5):');
            servicesResult.rows.forEach(service => {
                console.log(`  - ${service.title} (/${service.slug}) - Published: ${service.is_published}`);
            });
        } else {
            console.log('No services found.');
        }
        console.log('');

        // List projects
        const projectsResult = await pool.query('SELECT id, title, slug, is_published FROM projects WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 5');
        if (projectsResult.rows.length > 0) {
            console.log('Projects (latest 5):');
            projectsResult.rows.forEach(project => {
                console.log(`  - ${project.title} (/${project.slug}) - Published: ${project.is_published}`);
            });
        } else {
            console.log('No projects found.');
        }
        console.log('');

        // List blog posts
        const blogResult = await pool.query('SELECT id, title, slug, is_published FROM blog_posts WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 5');
        if (blogResult.rows.length > 0) {
            console.log('Blog Posts (latest 5):');
            blogResult.rows.forEach(post => {
                console.log(`  - ${post.title} (/${post.slug}) - Published: ${post.is_published}`);
            });
        } else {
            console.log('No blog posts found.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkDatabase();
