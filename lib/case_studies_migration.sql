-- Case Studies Table Migration
-- Creates a new table for case studies separate from projects

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
    featured_image_id UUID REFERENCES media_items(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(is_published, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON case_studies(is_featured) WHERE deleted_at IS NULL AND is_published = true;

-- Add comment
COMMENT ON TABLE case_studies IS 'Stores case study content separate from projects';
