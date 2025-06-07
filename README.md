# XML to MySQL Updater with Cron Job

A Node.js application that automatically reads XML data and updates a MySQL database on a scheduled basis using cron jobs.

## Features

- Automated XML file parsing
- MySQL database integration
- Scheduled updates using node-cron
- Automatic table creation
- Error handling and logging
- Upsert functionality (insert/update)

## Prerequisites

- Node.js (v12 or higher)
- MySQL Server
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/xml-mysql-updater.git
cd xml-mysql-updater
```

2. Install dependencies:
```bash
npm install
```

3. Configure the database:
   - Create a MySQL database named 'xml_products'
   - Update the database configuration in `index.js` with your credentials:
   ```javascript
   const dbConfig = {
       host: 'localhost',
       user: 'your_username',
       password: 'your_password',
       database: 'xml_products',
       port: 3306
   };
   ```

4. Prepare your XML file:
   - Place your `data.xml` file in the project root directory
   - Ensure the XML structure matches the expected format:
   ```xml
   <products>
     <product>
       <id>1</id>
       <name>Product Name</name>
       <price>99.99</price>
       <stock>100</stock>
       <lastUpdated>2024-03-20</lastUpdated>
     </product>
   </products>
   ```

## Usage

1. Start the application:
```bash
npm start
```

The application will:
- Run immediately on startup
- Execute every hour (configurable in the cron schedule)
- Read the XML file
- Update the MySQL database
- Log all operations

## Database Schema

The application creates a `products` table with the following structure:
```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    stock INT,
    lastUpdated DATE
);
```

## Configuration

- Cron Schedule: Currently set to run every hour (`0 * * * *`)
- XML File: Place your `data.xml` in the project root
- Database: Configure in `index.js`

## Dependencies

- node-cron: ^3.0.3
- xml2js: ^0.6.2
- mysql2: ^3.9.1

## Error Handling

The application includes comprehensive error handling for:
- XML file reading and parsing
- Database connections
- Data insertion/updates
- All errors are logged to the console
