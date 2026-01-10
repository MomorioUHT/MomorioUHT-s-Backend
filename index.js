require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8113;

app.use(express.json());
app.use(cors());
app.use('/images', express.static('images'));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
    } catch (error) {
        console.log('Database connection failed: ', error);
        process.exit(1);
    }
})();

function loadRoutes(routeModule) {
    const routes = routeModule(pool);
    for (const [key, router] of Object.entries(routes)) {
        app.use(`/api/${key}`, router);
        console.log(`[+] Loaded route: /api/${key}`);
    }
    console.log('---------------------------');
}

const getterRoutes = require('./apis/fanart-post/base-modules');
loadRoutes(getterRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})