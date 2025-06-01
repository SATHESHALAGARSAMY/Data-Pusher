const { getDatabase } = require('../../db');
const dayjs = require('dayjs');

const db = getDatabase();

/**
 * Create a new destination
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const createDestination = async (req, res) => {
    try {
        const { accountId, url, httpMethod, headers } = req.body;
        if (!accountId || !url || !httpMethod || !headers) {
            throw new Error('Missing required fields');
        }
        const sql = 'INSERT INTO destinations (account_id, url, http_method, headers, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await db.run(sql, [accountId, url, httpMethod, headers, dayjs().format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')]);
        return res.json({
            code: 200,
            success: true,
            message: 'Destination created successfully',
            result
        })
    } catch (error) {
        console.error('Error creating destination:', error);
        return res.json({
            code: 500,
            success: false,
            message: error.message || 'Failed to create destination'
        })
    }
}

/**
 * Get all destinations
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getAllDestinations = async (req, res) => {
    try {
        const sql = 'SELECT d.*, a.* FROM destinations AS d INNER JOIN accounts AS a ON d.account_id = a.account_id WHERE d.account_id = ? AND d.status = "Y" AND a.status = "Y"';
        const result = await db.all(sql, [req.params.accountId]);
        if(!result){
            throw new Error('No destinations found');
        }
        return res.json({
            code: 200,
            success: true,
            message: 'Destinations fetched successfully',
            result
        })
    } catch (error) {
        console.error('Error fetching destinations:', error);
        return res.json({
            code: 500,
            success: false,
            message: error.message || 'Failed to fetch destinations'
        })
    }
}

/**
 * Get destination by id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getDestinationById = async (req, res) => {
    try {
        const sql = 'SELECT d.*, a.* FROM destinations AS d INNER JOIN accounts AS a ON d.account_id = a.account_id WHERE d.destination_id = ? AND d.status = "Y" AND a.status = "Y"';
        const result = await db.get(sql, [req.params.destinationId]);
        if(!result){
            throw new Error('Destination not found');
        }
        return res.json({
            code: 200,
            success: true,
            message: 'Destination fetched successfully',
            result
        })
    } catch (error) {
        console.error('Error fetching destination:', error);
        return res.json({
            code: 500,
            success: false,
            message: error.message || 'Failed to fetch destination'
        })
    }
}

/**
 * Update destination by id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const updateDestinationById = async (req, res) => {
    try {
        const { destinationId } = req.body;
        if (!destinationId) {
            throw new Error('Missing destinationId');
        }

        // Build the SQL query dynamically
        const fieldsToUpdate = [];
        const values = [];

        const fieldMappings = {
            accountId: 'account_id',
            url: 'url',
            httpMethod: 'http_method',
            headers: 'headers'
        };

        for (const [key, field] of Object.entries(fieldMappings)) {
            if (req.body[key]) {
                fieldsToUpdate.push(`${field} = ?`);
                values.push(req.body[key]);
            }
        }

        // Always update the updated_at field
        fieldsToUpdate.push('updated_at = ?');
        values.push(dayjs().format('YYYY-MM-DD HH:mm:ss'));

        if (fieldsToUpdate.length === 0) {
            throw new Error('No fields to update');
        }

        const sql = `UPDATE destinations SET ${fieldsToUpdate.join(', ')} WHERE destination_id = ? AND status = "Y"`;
        values.push(destinationId);

        const result = await db.run(sql, values);
        return res.json({
            code: 200,
            success: true,
            message: 'Destination updated successfully',
            result
        });
    } catch (error) {
        console.error('Error updating destination:', error);
        return res.json({
            code: 500,
            success: false,
            message: error.message || 'Failed to update destination'
        });
    }
}

/**
 * Delete destination by id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

const deleteDestinationById = async (req, res) => {
    try {
        const { destinationId } = req.body;
        if (!destinationId) {
            throw new Error('Missing required fields');
        }
        const sql = 'UPDATE destinations SET status = "D" WHERE destination_id = ?';
        const result = await db.run(sql, [destinationId]);
        return res.json({
            code: 200,
            success: true,
            message: 'Destination deleted successfully',
            result
        })
    } catch (error) {
        console.error('Error deleting destination:', error);
        return res.json({
            code: 500,
            success: false,
            message: error.message || 'Failed to delete destination'
        })
    }
}

/**
 * Delete all destinations by account id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */

const deleteAllDestinationsByAccountId = async (req, res) => {
    try {
        const { accountId } = req.body;
        if (!accountId) {
            throw new Error('Missing required fields');
        }
        const sql = 'UPDATE destinations SET status = "D" WHERE account_id = ?';
        const result = await db.run(sql, [accountId]);

        return res.json({
            code: 200,
            success: true,
            message: 'All destinations deleted successfully',
            result
        })
    } catch (error) {
        console.error('Error deleting all destinations by account id:', error.message);
        return res.json({
            code: 500,
            success: false,
            message: error.message || 'Failed to delete all destinations by account id'
        })
    }
}

module.exports = {
    createDestination,
    getAllDestinations,
    getDestinationById,
    updateDestinationById,
    deleteDestinationById,
    deleteAllDestinationsByAccountId
}
