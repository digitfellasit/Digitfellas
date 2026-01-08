CREATE TABLE IF NOT EXISTS navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    type VARCHAR(50) DEFAULT 'link', -- 'link', 'dropdown'
    parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster reads
CREATE INDEX IF NOT EXISTS idx_navigation_parent ON navigation_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_navigation_sort ON navigation_items(sort_order);

-- Seed defaults if empty
INSERT INTO navigation_items (label, url, type, sort_order)
SELECT 'About', '/about', 'link', 0
WHERE NOT EXISTS (SELECT 1 FROM navigation_items);

INSERT INTO navigation_items (label, url, type, sort_order)
SELECT 'Capabilities', '/services', 'dropdown', 10
WHERE NOT EXISTS (SELECT 1 FROM navigation_items WHERE label = 'Capabilities');

INSERT INTO navigation_items (label, url, type, sort_order)
SELECT 'How We Work', '/#how-we-work', 'link', 20
WHERE NOT EXISTS (SELECT 1 FROM navigation_items WHERE label = 'How We Work');

INSERT INTO navigation_items (label, url, type, sort_order)
SELECT 'Case Studies', '/case-studies', 'link', 30
WHERE NOT EXISTS (SELECT 1 FROM navigation_items WHERE label = 'Case Studies');

INSERT INTO navigation_items (label, url, type, sort_order)
SELECT 'Insights', '/insights', 'link', 40
WHERE NOT EXISTS (SELECT 1 FROM navigation_items WHERE label = 'Insights');

INSERT INTO navigation_items (label, url, type, sort_order)
SELECT 'Partnerships', '#partnerships', 'link', 50
WHERE NOT EXISTS (SELECT 1 FROM navigation_items WHERE label = 'Partnerships');

INSERT INTO navigation_items (label, url, type, sort_order)
SELECT 'Contact', '/contact', 'link', 60
WHERE NOT EXISTS (SELECT 1 FROM navigation_items WHERE label = 'Contact');
