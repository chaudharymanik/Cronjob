const cron = require('node-cron');
const fs = require('fs');
const xml2js = require('xml2js');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'singh1974',
    database: 'xml_products',
    port: 3306
};

async function readXMLFile() {
    try {
        const xmlData = fs.readFileSync('data.xml', 'utf8');
        console.log('XML Data read:', xmlData);
        const parser = new xml2js.Parser({
            explicitArray: false
        });
        const result = await parser.parseStringPromise(xmlData);
        console.log('Parsed XML result:', JSON.stringify(result, null, 2));
        return result.products.product;
    } catch (error) {
        console.error('Error reading XML file:', error);
        throw error;
    }
}

async function updateDatabase(products) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Database connected successfully');
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS products (
                id INT PRIMARY KEY,
                name VARCHAR(255),
                price DECIMAL(10,2),
                stock INT,
                lastUpdated DATE
            )
        `);
        console.log('Table created/verified successfully');

        for (const product of products) {
            console.log('Processing product:', product);
            const { id, name, price, stock, lastUpdated } = product;
            await connection.execute(
                'INSERT INTO products (id, name, price, stock, lastUpdated) VALUES (?, ?, ?, ?, ?) ' +
                'ON DUPLICATE KEY UPDATE name = ?, price = ?, stock = ?, lastUpdated = ?',
                [id, name, price, stock, lastUpdated, name, price, stock, lastUpdated]
            );
            console.log(`Product ${id} inserted/updated successfully`);
        }
        
        console.log('Database updated successfully');
    } catch (error) {
        console.error('Error updating database:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function processXMLAndUpdateDB() {
    try {
        console.log('Starting XML processing and database update...');
        const products = await readXMLFile();
        console.log('Products to be inserted:', products);
        await updateDatabase(products);
        console.log('Process completed successfully');
    } catch (error) {
        console.error('Error in main process:', error);
    }
}

cron.schedule('0 * * * *', () => {
    console.log('Running scheduled task...');
    processXMLAndUpdateDB();
});

console.log('Starting application...');
processXMLAndUpdateDB(); 