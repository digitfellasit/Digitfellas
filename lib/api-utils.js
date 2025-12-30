// API helper utilities for the CMS
import { getPool } from './db'

/**
 * Generic CRUD operations for database tables
 */
export class CrudService {
    constructor(tableName, columns = []) {
        this.tableName = tableName
        this.columns = columns
    }

    async getAll(filters = {}, options = {}) {
        const pool = getPool()
        const { limit = 100, offset = 0, orderBy = 'created_at', orderDir = 'DESC' } = options

        let whereClause = 'WHERE deleted_at IS NULL'
        const values = []
        let paramCount = 1

        // Add filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                whereClause += ` AND ${key} = $${paramCount}`
                values.push(value)
                paramCount++
            }
        })

        const query = `
      SELECT * FROM ${this.tableName}
      ${whereClause}
      ORDER BY ${orderBy} ${orderDir}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `
        values.push(limit, offset)

        const result = await pool.query(query, values)

        // Get total count
        const countQuery = `SELECT COUNT(*) FROM ${this.tableName} ${whereClause}`
        const countResult = await pool.query(countQuery, values.slice(0, -2))

        return {
            items: result.rows,
            total: parseInt(countResult.rows[0].count),
            limit,
            offset
        }
    }

    async getById(id) {
        const pool = getPool()
        const result = await pool.query(
            `SELECT * FROM ${this.tableName} WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        )
        return result.rows[0] || null
    }

    async getBySlug(slug) {
        const pool = getPool()
        const result = await pool.query(
            `SELECT * FROM ${this.tableName} WHERE slug = $1 AND deleted_at IS NULL`,
            [slug]
        )
        return result.rows[0] || null
    }

    async create(data) {
        const pool = getPool()
        const { v4: uuidv4 } = require('uuid')

        const id = uuidv4()
        const columns = Object.keys(data)
        const values = Object.values(data)
        const placeholders = values.map((_, i) => `$${i + 2}`).join(', ')

        const query = `
      INSERT INTO ${this.tableName} (id, ${columns.join(', ')})
      VALUES ($1, ${placeholders})
      RETURNING *
    `

        const result = await pool.query(query, [id, ...values])
        return result.rows[0]
    }

    async update(id, data) {
        const pool = getPool()

        const entries = Object.entries(data)
        const setClause = entries.map(([key], i) => `${key} = $${i + 2}`).join(', ')
        const values = entries.map(([, value]) => value)

        const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `

        const result = await pool.query(query, [id, ...values])
        return result.rows[0] || null
    }

    async delete(id, soft = true) {
        const pool = getPool()

        if (soft) {
            const result = await pool.query(
                `UPDATE ${this.tableName} SET deleted_at = NOW() WHERE id = $1 RETURNING *`,
                [id]
            )
            return result.rows[0] || null
        } else {
            const result = await pool.query(
                `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
                [id]
            )
            return result.rows[0] || null
        }
    }
}

/**
 * Generate slug from title
 */
export function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

/**
 * Handle many-to-many relationships
 */
export async function updateManyToMany(tableName, parentIdColumn, parentId, childIdColumn, childIds) {
    const pool = getPool()

    // Delete existing relationships
    await pool.query(`DELETE FROM ${tableName} WHERE ${parentIdColumn} = $1`, [parentId])

    // Insert new relationships
    if (childIds && childIds.length > 0) {
        const values = childIds.map((childId, i) => `($1, $${i + 2})`).join(', ')
        const query = `INSERT INTO ${tableName} (${parentIdColumn}, ${childIdColumn}) VALUES ${values}`
        await pool.query(query, [parentId, ...childIds])
    }
}

/**
 * Get items with their related data
 */
export async function getWithRelations(tableName, id, relations = []) {
    const pool = getPool()
    const item = await pool.query(
        `SELECT * FROM ${tableName} WHERE id = $1 AND deleted_at IS NULL`,
        [id]
    )

    if (!item.rows[0]) return null

    const result = item.rows[0]

    // Fetch related data
    for (const relation of relations) {
        if (relation.type === 'hasMany') {
            const related = await pool.query(
                `SELECT * FROM ${relation.table} WHERE ${relation.foreignKey} = $1 ORDER BY ${relation.orderBy || 'created_at'}`,
                [id]
            )
            result[relation.as] = related.rows
        } else if (relation.type === 'belongsTo') {
            const related = await pool.query(
                `SELECT * FROM ${relation.table} WHERE id = $1`,
                [result[relation.foreignKey]]
            )
            result[relation.as] = related.rows[0] || null
        } else if (relation.type === 'manyToMany') {
            const related = await pool.query(
                `SELECT t.* FROM ${relation.table} t
         INNER JOIN ${relation.pivotTable} pt ON t.id = pt.${relation.pivotForeignKey}
         WHERE pt.${relation.pivotLocalKey} = $1`,
                [id]
            )
            result[relation.as] = related.rows
        }
    }

    return result
}
