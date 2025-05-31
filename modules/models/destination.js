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
        const sql = 'INSERT INTO destinations (account_id, url, http_method, headers) VALUES (?, ?, ?, ?)';
        const result = await db.run(sql, [accountId, url, httpMethod, headers]);
        return res.status(200).json({ message: 'Destination created successfully', result });
    } catch (error) {
        console.error('Error creating destination:', error);
        res.status(500).json({ error: error.message || 'Failed to create destination' });
    }
}

module.exports = {
    createDestination
}