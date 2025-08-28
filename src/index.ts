import express, { Response, Request } from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import ComposerModel from './models/composerModel'
import composerRouter from './routes/composerRoutes'
import seedRouter from './routes/seedRoutes'
import rateLimit from 'express-rate-limit'
import path from 'path'

mongoose.connect(String(process.env.DATABASE_URL), {
    dbName: 'workshop-composers',
})

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

const app = express()
app.use(express.json())

app.use(
    rateLimit({
        windowMs: process.env.RATE_LIMIT_WINDOW_MS
            ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) * 1000
            : 15 * 60 * 1000 * 100,
        max: process.env.RATE_LIMIT_MAX
            ? parseInt(process.env.RATE_LIMIT_MAX)
            : 50,
        message: 'Too many requests from this IP, please try again later.',
    }),
)

app.use('/api/composers', composerRouter)
app.use('/api/seed', seedRouter)

app.use('/', express.static('public'))

const server = app.listen(PORT, '::', () => {
    console.log(`Server is running at ${JSON.stringify(server.address())}`)
})
