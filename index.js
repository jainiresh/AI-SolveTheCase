import express from 'express'
import bodyParser from 'body-parser'
import authRouter from './routes/authRouter.js'
import storyRouter from './routes/storyRouter.js'
import contactRouter from './routes/contactRouter.js'
import cors from 'cors';
import { pingUrl } from './constants/constants.js'

const app = express()
app.use(cors())
app.use(bodyParser())
app.use('/auth', authRouter);
app.use('/story', storyRouter);
app.use('/contacts', contactRouter);

setInterval(pingUrl, 600000);

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("Server listening on " + port)
})