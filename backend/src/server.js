import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.js"
import categoriesRoutes from "./routes/categories.js"
import accountsRoutes from "./routes/accounts.js"
import { connectDB } from './config/db.js'






const app = express();
const port = 5000;

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

connectDB();


app.use('/api', authRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', accountsRoutes);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})