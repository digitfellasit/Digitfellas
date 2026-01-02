// Force migration for new tables
import { getPool } from './lib/db.js'

async function forceMigration() {
    const pool = getPool()
    try {
        console.log('🚀 Running forced migration...')

        await pool.query(`
      -- Client logos table
      CREATE TABLE IF NOT EXISTS client_logos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          logo_url TEXT NOT NULL,
          website_url TEXT,
          sort_order INTEGER DEFAULT 0,
          is_published BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Testimonials table
      CREATE TABLE IF NOT EXISTS testimonials (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          client_name VARCHAR(255) NOT NULL,
          client_role VARCHAR(255),
          client_company VARCHAR(255),
          client_image_url TEXT,
          rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
          testimonial_text TEXT NOT NULL,
          is_featured BOOLEAN DEFAULT FALSE,
          is_published BOOLEAN DEFAULT TRUE,
          sort_order INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Tech stack table
      CREATE TABLE IF NOT EXISTS tech_stack (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          icon_url TEXT NOT NULL,
          category VARCHAR(100),
          website_url TEXT,
          sort_order INTEGER DEFAULT 0,
          is_published BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Process steps table
      CREATE TABLE IF NOT EXISTS process_steps (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          step_number INTEGER NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          icon_name VARCHAR(100),
          sort_order INTEGER DEFAULT 0,
          is_published BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)
        console.log('✅ Tables created successfully')
    } catch (e) {
        console.error('❌ Migration failed:', e)
    } finally {
        pool.end()
    }
}

forceMigration()
