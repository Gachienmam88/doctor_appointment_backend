import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import auth from './routes/auth.js'
import user from './routes/user.js'
import doctor from './routes/doctor.js'
import review from './routes/review.js'
dotenv.config()

const app = express()
const port = process.env.PORT || 8000
const corsOptions = {
    origin: true
}
app.get('/', (req, res) => {
    res.send('Api is working cc ')
})
//db connection
mongoose.set('strictQuery', false)
const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Mongo DB is connect')
    } catch (err) {
        console.log('MongoDB is connection failed')
    }
}
//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', user)
app.use('/api/v1/doctors', doctor)
app.use("/api/v1/reviews", review)
app.listen(port, () => {
    connectDB()
    console.log('Server is running on port ' + port)
})
