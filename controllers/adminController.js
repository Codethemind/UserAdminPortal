const user =require('../models/customermodel')
const bcrypt=require('bcrypt')


const getadmin = async (req, res) => {
        try {
            let query = {};
            if (req.query.search) {
                query = {
                    $or: [
                        { name: { $regex: req.query.search, $options: 'i' } },
                        { email: { $regex: req.query.search, $options: 'i' } },
                        { username: { $regex: req.query.search, $options: 'i' } }
                    ]
                };
            }
            const users = await user.find(query).where({ isAdmin: false });
            res.render('admin', { title:"Admin Page", users, searchQuery: req.query.search || '' });
        } catch (err) {
            console.log('There is an issue in fetching the data', err);
        }
  
};


const getlogout=(req,res)=>{
    req.session.destroy(err=>{
      if(err){
        console.log(err);
      }else{
        res.redirect('/')
      }
    })
  }


  const getnewuser=async(req,res)=>{
    try {
        res.render('newuser',{title:"adduser"})
    } catch (error) {
        console.log(error.message); 
 }
}

  const postnewuser=async (req,res)=>{
    try {
        const data={
         name:req.body.name,
         email:req.body.email,
         username:req.body.username,
         password:req.body.password
        }
        const salt=10;
        const hashedpassword=await bcrypt.hash(data.password,salt)
        data.password=hashedpassword;
        const existuser=await user.findOne({username:data.username})
        const existemail=await user.findOne({email:data.email})
        if(existuser){
            res.render("newuser",{title:'add user',existuser:"username already exist"})
        }else if(existemail){
            res.render("newuser",{title:'add user',existemail:"email already exist"})
        }else{
            await user.insertMany(data)
            res.redirect('/admin/admin')
        }
    } catch (error) {
        console.log(error.message); 
    }
  }






  const getedituser=async (req, res) => {
    try {
        const users = await user.findById(req.params.id);
        res.render('edituser', { title: 'Edit User', users });
    } catch (error) {
        console.log(error.message);
        res.redirect('/admin/admin');
    }
};



const postupdateuser= async (req, res) => {
    try {
        const updatedData = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username
        };

        await user.findByIdAndUpdate(req.params.id, updatedData);
        res.redirect('/admin/admin');
    } catch (error) {
        console.log(error.message);
        res.redirect(`/admin/edituser/${req.params.id}`);
    }
};


const getdeleteuser= async(req,res)=>{
    try {
        await user.findByIdAndDelete(req.params.id)
        res.redirect('/admin/admin')
    } catch (error) {
        console.log(error.message);  
    }
}

module.exports={getadmin,getnewuser,postnewuser,getedituser,postupdateuser,getdeleteuser,getlogout};