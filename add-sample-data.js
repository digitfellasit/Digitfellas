const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Hardcode connection string to ensure reliability
const DATABASE_URL = 'postgresql://root:6tITiMVbnYLnRc3jqd48DvTsD5X5xFsJ@dpg-d57pa56uk2gs73d6kdm0-a.oregon-postgres.render.com/digitfellas';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addSampleData() {
  console.log('🚀 Adding sample data to database...');

  try {
    // 1. Add Categories
    console.log('📁 Adding categories...');
    const webDevCatId = uuidv4();
    const mobileCatId = uuidv4();
    const aiCatId = uuidv4();

    await pool.query(`
      INSERT INTO categories (id, name, slug, description, type)
      VALUES 
        ($1, 'Web Development', 'web-development', 'Modern web applications', 'service'),
        ($2, 'Mobile Apps', 'mobile-apps', 'iOS and Android applications', 'project'),
        ($3, 'AI & Automation', 'ai-automation', 'Intelligent automation solutions', 'service')
      ON CONFLICT (slug) DO NOTHING
    `, [webDevCatId, mobileCatId, aiCatId]);
    console.log('✅ Categories added\n');

    // Retrieve actual IDs in case they existed
    const catRes = await pool.query("SELECT id, slug FROM categories WHERE slug IN ('web-development', 'mobile-apps')");
    const webDevId = catRes.rows.find(c => c.slug === 'web-development')?.id || webDevCatId;
    const mobileId = catRes.rows.find(c => c.slug === 'mobile-apps')?.id || mobileCatId;

    // 2. Add Tags
    console.log('🏷️  Adding tags...');
    await pool.query(`
      INSERT INTO tags (id, name, slug)
      VALUES 
        ($1, 'React', 'react'),
        ($2, 'Node.js', 'nodejs'),
        ($3, 'AI/ML', 'ai-ml')
      ON CONFLICT (slug) DO NOTHING
    `, [uuidv4(), uuidv4(), uuidv4()]);
    console.log('✅ Tags added\n');

    const tagRes = await pool.query("SELECT id, slug FROM tags WHERE slug IN ('react', 'nodejs')");
    const reactId = tagRes.rows.find(t => t.slug === 'react')?.id;
    const nodeId = tagRes.rows.find(t => t.slug === 'nodejs')?.id;

    // 3. Add Navigation Items
    console.log('🧭 Adding navigation items...');
    // Clear existing nav items first to prevent duplicates/mess (optional, but cleaner for test)
    // await pool.query('DELETE FROM navigation_items'); 
    // Actually, let's just insert if not exists.

    await pool.query(`
      INSERT INTO navigation_items (id, label, url, sort_order, is_active)
      VALUES 
        ($1, 'Home', '/', 0, true),
        ($2, 'Services', '/services', 1, true),
        ($3, 'Projects', '/projects', 2, true),
        ($4, 'Blog', '/blog', 3, true),
        ($5, 'Contact', '/contact', 4, true)
      ON CONFLICT DO NOTHING
    `, [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()]);
    console.log('✅ Navigation items added\n');

    // 4. Add Hero Section
    console.log('🎨 Adding hero section...');
    const heroId = uuidv4();
    await pool.query(`
      INSERT INTO hero_sections (id, page_key, title, subtitle, kicker, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, is_active)
      VALUES ($1, 'home', 'Build Modern Products. Ship Faster.', 'We create beautiful, scalable web applications that help businesses grow. From concept to deployment, we handle it all.', 'Digitfellas • IT Solutions', 'Get Started', '/contact', 'View Our Work', '/projects', true)
      ON CONFLICT (page_key) DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        kicker = EXCLUDED.kicker,
        primary_cta_label = EXCLUDED.primary_cta_label,
        primary_cta_url = EXCLUDED.primary_cta_url,
        secondary_cta_label = EXCLUDED.secondary_cta_label,
        secondary_cta_url = EXCLUDED.secondary_cta_url
    `, [heroId]);
    console.log('✅ Hero section added\n');

    // 5. Add Services
    console.log('💼 Adding services...');
    await pool.query(`
      INSERT INTO services (id, title, slug, description, excerpt, category_id, is_published, is_featured)
      VALUES 
        ($1, 'Web Application Development', 'web-app-development', 
         'We build modern, responsive web applications using the latest technologies like React, Next.js, and Node.js. Our applications are fast, secure, and scalable.',
         'Custom web applications built with modern frameworks and best practices.',
         $4, true, true),
        ($2, 'API Development & Integration', 'api-development',
         'RESTful APIs and microservices architecture designed for performance and scalability. We integrate with third-party services and build custom APIs.',
         'Robust API development and seamless third-party integrations.',
         $4, true, false),
        ($3, 'Database Design & Optimization', 'database-design',
         'Expert database architecture using PostgreSQL, MongoDB, and other modern databases. We optimize queries and ensure data integrity.',
         'Efficient database solutions for your application needs.',
         $4, true, false)
      ON CONFLICT (slug) DO NOTHING
    `, [uuidv4(), uuidv4(), uuidv4(), webDevId]);
    console.log('✅ Services added\n');

    // 6. Add Projects
    console.log('🚀 Adding projects...');
    const project1Id = uuidv4();
    const project2Id = uuidv4();
    // Using mobileId for projects category

    const pRes = await pool.query(`
      INSERT INTO projects (id, title, slug, description, excerpt, client_name, project_url, category_id, is_published, is_featured, completed_at)
      VALUES 
        ($1, 'E-Commerce Platform', 'ecommerce-platform',
         'A full-featured e-commerce platform with payment integration, inventory management, and analytics dashboard. Built with Next.js and PostgreSQL.',
         'Modern e-commerce solution with advanced features.',
         'TechStore Inc.', 'https://example.com', $3, true, true, '2024-12-01'),
        ($2, 'Task Management App', 'task-management-app',
         'Collaborative task management application with real-time updates, team collaboration features, and project tracking.',
         'Real-time task management for teams.',
         'ProductivityCo', 'https://example.com', $3, true, false, '2024-11-15')
      ON CONFLICT (slug) DO NOTHING
      RETURNING id, slug
    `, [project1Id, project2Id, mobileId]);

    // If not inserted (conflict), retrieve IDs
    const currentProjects = await pool.query("SELECT id, slug FROM projects WHERE slug IN ('ecommerce-platform', 'task-management-app')");
    const p1Id = currentProjects.rows.find(p => p.slug === 'ecommerce-platform')?.id;

    // Add tags to projects
    if (p1Id && reactId) {
      await pool.query(`
        INSERT INTO project_tags (project_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `, [p1Id, reactId]);
    }
    console.log('✅ Projects added\n');

    // 7. Add Blog Posts
    console.log('📝 Adding blog posts...');
    const post1Id = uuidv4();
    const post2Id = uuidv4();

    await pool.query(`
      INSERT INTO blog_posts (id, title, slug, content, excerpt, author_name, is_published, published_at, reading_time_minutes)
      VALUES 
        ($1, 'Getting Started with Next.js 14', 'getting-started-nextjs-14',
         'Next.js 14 brings exciting new features including improved performance, better developer experience, and enhanced routing capabilities. In this article, we explore the key features and how to get started.',
         'Learn about the latest features in Next.js 14 and how to leverage them in your projects.',
         'John Doe', true, NOW(), 5),
        ($2, 'Building Scalable APIs with Node.js', 'building-scalable-apis-nodejs',
         'Learn best practices for building scalable and maintainable APIs using Node.js and Express. We cover architecture patterns, error handling, authentication, and performance optimization.',
         'Best practices for creating robust and scalable Node.js APIs.',
         'Jane Smith', true, NOW(), 8)
      ON CONFLICT (slug) DO NOTHING
    `, [post1Id, post2Id]);

    // Add tags to blog posts... logic similar to projects

    console.log('✅ Blog posts added\n');

    console.log('🎉 Sample data added successfully!\n');

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addSampleData();
