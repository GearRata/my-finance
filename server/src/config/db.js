import { Client } from 'pg';
import 'dotenv/config'


const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
})

const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to PostgresSQL');
    } catch (error) {
        console.log('Error connecting to PostgresSQL', error);
    }
}

export { connectDB, client };