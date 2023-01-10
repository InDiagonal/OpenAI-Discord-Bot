// Import required modules and classes
const fs = require('node:fs');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

// Class for interacting with a SQLite database to store chat information
class DatabaseManager {
    // Constructor for the ChatsDatabase class
    constructor() {
        // Set db paths
        const queriesPath = path.join(process.cwd(), 'server/db/queries');
        const databasePath = path.join(process.cwd(), 'server/db/user_chats.db');
        // Queries dictionary
        this.queries = {};
        // Store SQLite queries in queries dict, file name as key and file content as value
        fs.readdirSync(queriesPath)
            .filter(fileName => fileName.endsWith('.sql'))
            .map(fileName => {
                // remove file extension
                this.queries[fileName.split('.')[0]] = fs.readFileSync(path.join(queriesPath, fileName), 'utf8')
                    // replace carriage return characters
                    .replace(/\r/g, ' ');
            });
        // Database connection
        this.db = new sqlite3.Database(databasePath);
    }

    // Database connection and schema initialization
    async init() {
        return new Promise((resolve, reject) => {
            this.db.run(this.queries.schema, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(this);
            });
        });
    }

    // Insert user in database
    async insert_new_user(user_id) {
        return new Promise((resolve, reject) => {
            this.db.run(this.queries.insert_new_user, user_id, '', (err) => {
                if (err) {
                    reject(err);
                }
                resolve(/*`Insertion of user: ${user_id}`*/);
            });
        });
    }

    // Return true if user already in database and false if not
    async is_user_inserted(user_id) {
        return new Promise((resolve, reject) => {
            this.db.get(this.queries.is_user_inserted, user_id, (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(Boolean(row['foo']));
            });
        });
    }

    // Init user chat in database
    async init_user_chat(user_id, text) {
        return new Promise((resolve, reject) => {
            this.db.run(this.queries.init_user_chat, text, user_id, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(/*`Chat reset for user: ${user_id}`*/);
            });
        });
    }

    // Update user chat in database
    async update_user_chat(user_id, text) {
        return new Promise((resolve, reject) => {
            this.db.run(this.queries.update_user_chat, text, user_id, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(/*`Chat updated for user: ${user_id}`*/);
            });
        });
    }

    // Get user chat from database
    async get_user_chat(user_id) {
        return new Promise((resolve, reject) => {
            this.db.get(this.queries.get_user_chat, user_id, (err, row) => {
                if (err || !row) {
                    reject(err || 'row undefined');
                }
                resolve(row['chat']);
            });
        });
    }

    // Set user chat status (true/false) in database
    async set_user_chat_status(user_id, foo) {
        return new Promise((resolve, reject) => {
            this.db.run(this.queries.set_user_chat_status, foo, user_id, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(/*`Chat open/closed for user: ${user_id}`*/);
            });
        });
    }

    // Get user chat status (true/false) from database
    async get_user_chat_status(user_id) {
        return new Promise((resolve, reject) => {
            this.db.get(this.queries.get_user_chat_status, user_id, (err, row) => {
                if (err || !row) {
                    reject(err || 'row undefined');
                }
                resolve(Boolean(row['chat_status']));
            });
        });
    }
}

// Export class
module.exports = { DatabaseManager };