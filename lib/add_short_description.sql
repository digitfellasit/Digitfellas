-- Migration script to add short_description columns to existing tables
-- Run this on your existing database to add the new columns

-- Add short_description to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Add short_description to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Add service_id foreign key to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id);

-- Add short_description to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS short_description TEXT;

-- Add index for service_id in projects
CREATE INDEX IF NOT EXISTS idx_projects_service_id ON projects(service_id);
