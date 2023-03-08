require('dotenv').config();

const pg = require('pg');

const isPriduction = process.env.NODE_ENV === 'production';

const pool = new pg.Pool({
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,     
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    port: `${process.env.DB_PORT}}`,
    ssl: isPriduction
});

module.exports = {pool};