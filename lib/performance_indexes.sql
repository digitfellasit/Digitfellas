-- Performance Optimization: Add Database Indexes
-- These indexes will significantly improve query performance

-- Services table indexes
CREATE INDEX IF NOT EXISTS idx_services_published ON services(is_published, sort_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug) WHERE deleted_at IS NULL;

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published, sort_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug) WHERE deleted_at IS NULL;

-- Blog posts table indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug) WHERE deleted_at IS NULL;

-- Case studies table indexes
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(is_published, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug) WHERE deleted_at IS NULL;

-- Client logos index
CREATE INDEX IF NOT EXISTS idx_client_logos_published ON client_logos(is_published, sort_order);

-- Media items index for faster joins
CREATE INDEX IF NOT EXISTS idx_media_items_id ON media_items(id);

-- Hero sections index
CREATE INDEX IF NOT EXISTS idx_hero_sections_page_key ON hero_sections(page_key);

COMMENT ON INDEX idx_services_published IS 'Improves homepage services query performance';
COMMENT ON INDEX idx_blog_posts_published IS 'Improves homepage blog posts query performance';
COMMENT ON INDEX idx_case_studies_published IS 'Improves case studies listing performance';
