import express from 'express'
import bodyParser from 'body-parser'
import authRouter from './routes/authRouter.js'
import storyRouter from './routes/storyRouter.js'

const app = express()

app.use(bodyParser())
app.use('/auth', authRouter);
app.use('/story', storyRouter);



const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("Server listening on " + port)
})