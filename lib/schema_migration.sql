-- Digitfellas CMS Database Schema Migration
-- This script creates all necessary tables for the admin CMS system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table (shared across content types)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'service', 'project', 'blog', etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tags table (shared across content types)
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Media items table (centralized media library)
CREATE TABLE IF NOT EXISTS media_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    url TEXT NOT NULL,
    mime_type VARCHAR(100),
    size_bytes INTEGER,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    uploaded_by UUID REFERENCES df_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT, -- Rich content
    excerpt TEXT,
    icon_url TEXT,
    featured_image_id UUID REFERENCES media_items(id),
    category_id UUID REFERENCES categories(id),
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Service images (gallery)
CREATE TABLE IF NOT EXISTS service_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
    variant VARCHAR(50) DEFAULT 'desktop', -- 'desktop' or 'mobile'
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT, -- Rich content
    excerpt TEXT,
    client_name VARCHAR(255),
    project_url TEXT,
    category_id UUID REFERENCES categories(id),
    featured_image_id UUID REFERENCES media_items(id),
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    completed_at DATE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Project images (gallery)
CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
    variant VARCHAR(50) DEFAULT 'desktop',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project tags (many-to-many)
CREATE TABLE IF NOT EXISTS project_tags (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL, -- Rich content
    featured_image_id UUID REFERENCES media_items(id),
    author_id UUID REFERENCES df_users(id),
    category_id UUID REFERENCES categories(id),
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    reading_time_minutes INTEGER,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Blog post tags (many-to-many)
CREATE TABLE IF NOT EXISTS blog_post_tags (
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, tag_id)
);

-- CMS Pages table
CREATE TABLE IF NOT EXISTS cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL, -- Rich content or JSON for page builder
    template VARCHAR(100) DEFAULT 'default',
    featured_image_id UUID REFERENCES media_items(id),
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    show_in_menu BOOLEAN DEFAULT FALSE,
    parent_id UUID REFERENCES cms_pages(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Hero sections table
CREATE TABLE IF NOT EXISTS hero_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_key VARCHAR(100) UNIQUE NOT NULL, -- 'home', 'about', 'services', etc.
    title VARCHAR(255),
    subtitle TEXT,
    kicker VARCHAR(255),
    primary_cta_label VARCHAR(100),
    primary_cta_url TEXT,
    secondary_cta_label VARCHAR(100),
    secondary_cta_url TEXT,
    background_type VARCHAR(50) DEFAULT 'image', -- 'image', 'video', 'gradient'
    background_video_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hero media (desktop/mobile variants)
CREATE TABLE IF NOT EXISTS hero_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_id UUID NOT NULL REFERENCES hero_sections(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media_items(id) ON DELETE CASCADE,
    variant VARCHAR(50) DEFAULT 'desktop',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hero bullets/features
CREATE TABLE IF NOT EXISTS hero_bullets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_id UUID NOT NULL REFERENCES hero_sections(id) ON DELETE CASCADE,
    text VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Navigation items table
CREATE TABLE IF NOT EXISTS navigation_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    parent_id UUID REFERENCES navigation_items(id),
    icon VARCHAR(100),
    target VARCHAR(20) DEFAULT '_self', -- '_self' or '_blank'
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site settings table (key-value store)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(is_published) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_navigation_parent ON navigation_items(parent_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_pages_updated_at BEFORE UPDATE ON cms_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_sections_updated_at BEFORE UPDATE ON hero_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON navigation_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
