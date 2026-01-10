import { Pool } from 'pg'

let pool

export async function pgEnabled() {
  return !!process.env.DATABASE_URL
}

export function getPool() {
  // In development, use a global variable so the pool isn't recreated on every hot reload
  if (process.env.NODE_ENV === 'development') {
    if (!global.postgresPool) {
      if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set')
      }
      global.postgresPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      })
      global.postgresPool.on('error', (err) => {
        console.error('Unexpected error on idle client', err)
      })
    }
    return global.postgresPool
  }

  // In production, use module-level variable
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set')
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
  }
  return pool
}

export async function ensureSchema() {
  const p = getPool()
  const fs = require('fs')
  const path = require('path')

  // First ensure base tables
  await p.query(`
    CREATE TABLE IF NOT EXISTS df_users (
      id uuid PRIMARY KEY,
      email text UNIQUE NOT NULL,
      name text,
      salt text NOT NULL,
      hash text NOT NULL,
      role text NOT NULL DEFAULT 'admin',
      created_at timestamptz NOT NULL DEFAULT now()
    );

    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='df_users' AND column_name='name') THEN
        ALTER TABLE df_users ADD COLUMN name text;
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS df_site (
      id uuid PRIMARY KEY,
      data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `)

  // Run comprehensive schema migration
  try {
    const migrationPath = path.join(process.cwd(), 'lib', 'schema_migration.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    await p.query(migrationSQL)
    console.log('✅ Database schema migration completed successfully')

    // Run additional migration for media data
    try {
      const mediaMigrationPath = path.join(process.cwd(), 'lib', 'add_media_data_column.sql')
      const mediaMigrationSQL = fs.readFileSync(mediaMigrationPath, 'utf8')
      await p.query(mediaMigrationSQL)
      console.log('✅ Media data column migration completed successfully')
    } catch (error) {
      console.error('⚠️  Media data migration error:', error.message)
    }

  } catch (error) {
    console.error('⚠️  Schema migration error (may be already applied):', error.message)
  }
}
