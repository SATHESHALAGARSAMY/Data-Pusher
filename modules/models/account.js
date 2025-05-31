const { getDatabase } = require('../../db');
const dayjs = require('dayjs');

const db = getDatabase();

/**
 * Create a new account
 * @param {Object} req - Email, account_id, account_name, website, app_secret_token
 * @param {Object} res - Account will be created successfully
 */
const createAccount = async (req, res) => {
    try {
        const { accountId, email, accountName, website, appSecretToken } = req.body;
        if (!accountId || !email || !accountName || !website || !appSecretToken) {
            throw new Error('Missing required fields');
        }
        // Check if the email already exists
        const checkEmailSql = 'SELECT COUNT(*) as count FROM accounts WHERE email = ?';
        const emailCheckResult = await db.get(checkEmailSql, [email]);
        console.log('Email check result:', emailCheckResult);
        if (emailCheckResult.count > 0) {
            throw new Error('Email already exists');
        }
        // Create a new account
        const sql = 'INSERT INTO accounts ( account_id, email, account_name, website, app_secret_token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const result = await db.run(sql, [accountId, email, accountName, website, appSecretToken, new Date(), new Date()]);
        return res.status(200).json({ message: 'Account created successfully', result });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: error.message || 'Failed to create account' });
    }
};

/**
 * Get accounts by date
 * @param {Object} req - date
 * @param {Object} res - Accounts will be fetched successfully
 * @returns {Object} - Accounts Details
 */
const getAccounts = async (req, res) => {
    try {
        const { date } = req.params;
        const sql = 'SELECT * FROM accounts WHERE created_at = ?';
        const result = await db.all(sql, [dayjs(date).format('YYYY-MM-DD')]);
        if (!result) {
            throw new Error('No accounts found');
        }
        return res.status(200).json({ message: 'Accounts fetched successfully', result });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch accounts' });
    }
}

/**
 * Get account by id
 * @param {Object} req - account_id
 * @param {Object} res - Account will be fetched successfully
 */
const getAccountById = async (req, res) => {
    try {
        console.log('getAccountById', req.params);
        const { accountId } = req.params;
        const sql = 'SELECT * FROM accounts WHERE account_id = ?';
        const result = await db.get(sql, [accountId]);
        if (!result) {
            throw new Error('Account not found');
        }
        return res.status(200).json({ message: 'Account fetched successfully', result });
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch account' });
    }
}

/**
 * Update account by id
 * @param {Object} req - account_id, email, account_name, website, app_secret_token
 * @param {Object} res - Account will be updated successfully
 */

const updateAccountById = async (req, res) => {
    try {
        console.log('updateAccountById', req.body);
        console.log('updateAccountById', req.params);
        const { accountId } = req.params;
        const { email, accountName, website, appSecretToken } = req.body;
        if (!accountId || !email || !accountName || !website || !appSecretToken) {
            throw new Error('Missing required fields');
        }
        // Check if the email already exists
        const checkEmailSql = 'SELECT COUNT(*) as count FROM accounts WHERE email = ?';
        const emailCheckResult = await db.get(checkEmailSql, [email]);
        console.log('Email check result:', emailCheckResult);
        if (emailCheckResult.count > 0) {
            throw new Error('Email already exists');
        }
        const sql = 'UPDATE accounts SET email = ?, account_name = ?, website = ?, updated_at = ? WHERE account_id = ?';
        const result = await db.run(sql, [email, accountName, website,new Date(), accountId]);
        return res.status(200).json({ message: 'Account updated successfully', result });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: error.message || 'Failed to update account' });
    }
}

module.exports = {
    createAccount,
    getAccounts,
    getAccountById,
    updateAccountById
};