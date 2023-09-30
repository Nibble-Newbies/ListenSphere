import userRouter from './user/index.js'
import express from 'express'

const apiRouter = express.Router();

apiRouter.use('/user',userRouter)

export default apiRouter;