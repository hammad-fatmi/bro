import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js'
import dns from 'node:dns/promises';
import userRoute from './routes/userRoute.js'
import cors from 'cors'
import productRoute from './routes/productRoute.js'
import uploadRoute from "./routes/uploadRoutes.js";


dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use("/api/upload", uploadRoute);



async function startServer() {
    try {
        await connectDB()          // connect to MongoDB first
        console.log('✅ Connected to MongoDB!')

        app.listen(PORT, () => {
            console.log(`Server is listening at Port: ${PORT}`)
        })
    } catch (err) {
        console.error('MongoDB Connection Failed:', err.message)
        process.exit(1)           // stop the server if DB fails
    }
}

startServer()