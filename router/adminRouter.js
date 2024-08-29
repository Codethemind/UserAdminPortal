const express=require('express')
const adminRouter=express.Router()
const {getadmin,getnewuser,postnewuser,getedituser,postupdateuser,getdeleteuser,getlogout}=require('../controllers/adminController')
const adminauth=require('../middleware/adminauth')

adminRouter.get('/admin',adminauth,getadmin)
adminRouter.get('/logout',adminauth,getlogout)
adminRouter.get('/newuser', adminauth,getnewuser)
adminRouter.post('/adduser',adminauth ,postnewuser)
adminRouter.get('/edituser/:id',adminauth ,getedituser )
adminRouter.post('/updateuser/:id', adminauth,postupdateuser )
adminRouter.get('/deleteuser/:id',adminauth , getdeleteuser)



module.exports=adminRouter;