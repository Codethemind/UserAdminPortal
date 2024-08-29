const express=require('express')
const userRouter=express.Router()
const {getsignup,postsignup,gethome, getlogout,checksession}=require('../controllers/userController')
const userauth=require('../middleware/userauth')


userRouter.use(checksession)
userRouter.get("/signup",getsignup)
userRouter.post("/signup",postsignup)
userRouter.get("/home", userauth, gethome)
userRouter.get('/logout', getlogout)





module.exports=userRouter;