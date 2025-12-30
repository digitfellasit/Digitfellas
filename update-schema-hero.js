const { Pool } = require('pg');

// Hardcoded to avoid dotenv dependency issues
const DATABASE_URL = 'postgresql://root:6tITiMVbnYLnRc3jqd48DvTsD5X5xFsJ@dpg-d57pa56uk2gs73d6kdm0-a.oregon-postgres.render.com/digitfellas';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Starting schema update...');

        // Add hero_section_id to services
        console.log('Adding hero_section_id to services...');
        await client.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS hero_section_id UUID REFERENCES hero_sections(id);
    `);

        // Add hero_section_id to projects
        console.log('Adding hero_section_id to projects...');
        await client.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS hero_section_id UUID REFERENCES hero_sections(id);
    `);

        console.log('Schema update completed successfully!');

        // Check columns
        const resServices = await client.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'services';
    `);
        console.log('Services columns:', resServices.rows.map(r => r.column_name).join(', '));

        const resProjects = await client.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'projects';
    `);
        console.log('Projects columns:', resProjects.rows.map(r => r.column_name).join(', '));

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
