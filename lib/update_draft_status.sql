-- Migration to support draft status across insights, case studies, and capabilities

-- 1. Ensure blog_posts has all draft fields
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='is_published') THEN
        ALTER TABLE blog_posts ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='published_at') THEN
        ALTER TABLE blog_posts ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
END $$;

-- 2. Ensure case_studies table exists and has draft fields
CREATE TABLE IF NOT EXISTS case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    short_description TEXT,
    client_name TEXT,
    industry TEXT,
    project_url TEXT,
    meta_title TEXT,
    meta_description TEXT,
    featured_image_id UUID,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    completed_at DATE,
    sort_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Ensure case_studies has published_at if it was created before
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_studies' AND column_name='published_at') THEN
        ALTER TABLE case_studies ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_studies' AND column_name='view_count') THEN
        ALTER TABLE case_studies ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- 3. Ensure services (capabilities) has all draft and specialized fields
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='is_published') THEN
        ALTER TABLE services ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='published_at') THEN
        ALTER TABLE services ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='hero_data') THEN
        ALTER TABLE services ADD COLUMN hero_data JSONB DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='intro_title') THEN
        ALTER TABLE services ADD COLUMN intro_title VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='intro_content') THEN
        ALTER TABLE services ADD COLUMN intro_content TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='features') THEN
        ALTER TABLE services ADD COLUMN features JSONB DEFAULT '[]';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='details_sections') THEN
        ALTER TABLE services ADD COLUMN details_sections JSONB DEFAULT '[]';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='faq') THEN
        ALTER TABLE services ADD COLUMN faq JSONB DEFAULT '[]';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='template') THEN
        ALTER TABLE services ADD COLUMN template VARCHAR(100) DEFAULT 'default';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='cta_title') THEN
        ALTER TABLE services ADD COLUMN cta_title VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='cta_description') THEN
        ALTER TABLE services ADD COLUMN cta_description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='cta_button_text') THEN
        ALTER TABLE services ADD COLUMN cta_button_text VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='cta_link') THEN
        ALTER TABLE services ADD COLUMN cta_link VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='features_title') THEN
        ALTER TABLE services ADD COLUMN features_title VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='services' AND column_name='features_description') THEN
        ALTER TABLE services ADD COLUMN features_description TEXT;
    END IF;
END $$;
