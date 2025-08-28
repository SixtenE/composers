import express, { Response, Request } from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import ComposerModel from './models/composerModel'
import composerRouter from './routes/composerRoutes'
import seedRouter from './routes/seedRoutes'

mongoose.connect(String(process.env.DATABASE_URL), {
    dbName: 'workshop-composers',
})

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

const app = express()
app.use(express.json())

app.use('/api/composers', composerRouter)
app.use('/api/seed', seedRouter)

const server = app.listen(PORT, '::', () => {
    console.log(`Server is running at ${JSON.stringify(server.address())}`)
})
