module.exports = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    ssl: true,
    NODE_TLS_REJECT_UNAUTHORIZED: 0
};