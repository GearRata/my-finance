import { Client } from "pg";
import { createClient } from "redis";
import "dotenv/config";

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to PostgresSQL");
  } catch (error) {
    console.log("Error connecting to PostgresSQL", error);
  }
};

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.log("Error connecting to Redis", error);
  }
};

export { connectDB, client, connectRedis, redisClient };
