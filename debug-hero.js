const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://root:6tITiMVbnYLnRc3jqd48DvTsD5X5xFsJ@dpg-d57pa56uk2gs73d6kdm0-a.oregon-postgres.render.com/digitfellas';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function debugHero() {
    try {
        // 1. Get Hero Sections
        const heroes = await pool.query('SELECT * FROM hero_sections');
        console.log('Heroes:', heroes.rows);

        // 2. Get Media Items
        const media = await pool.query('SELECT * FROM media_items');
        console.log('Media items count:', media.rows.length);
        console.log('Latest 5 media:', media.rows.slice(-5));

        // 3. Get Hero Media Relationships
        const relationships = await pool.query('SELECT * FROM hero_media');
        console.log('Hero Media:', relationships.rows);

        // 4. Test the exact query used in API
        const apiQuery = `
      SELECT h.*, 
             json_agg(DISTINCT jsonb_build_object('id', hm.id, 'url', mi.url, 'alt', mi.alt_text, 'variant', hm.variant)) FILTER (WHERE hm.id IS NOT NULL) as media
      FROM hero_sections h
      LEFT JOIN hero_media hm ON h.id = hm.hero_id
      LEFT JOIN media_items mi ON hm.media_id = mi.id
      WHERE h.is_active = true
      GROUP BY h.id
    `;
        const apiRes = await pool.query(apiQuery);
        console.log('API Result:', JSON.stringify(apiRes.rows, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pool.end();
    }
}

debugHero();
