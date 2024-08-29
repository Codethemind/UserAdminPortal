const user =require('../models/customermodel')
const bcrypt=require('bcrypt')

const getsignup= (req, res) => {
  if(req.session.username){
    res.redirect('/user/home')
  }
  else{
    res.render('signup',{title:'signup page'})
  }
  };


  const postsignup= async (req, res) => {
    const data = {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };
    const existuser=await user.findOne({username:data.username});
    const existemail=await user.findOne({email:data.email})
  
    if(existuser){
      res.render('signup',{title:'signup page',existuser:"This user name already exist"})
    }else if(existemail){
      res.render('signup',{title:'signup page',existemail:"This email already exist"})
    }else{
      const salt = 10;
    const hashedpassword = await bcrypt.hash(data.password, salt);
    data.password = hashedpassword;
  
    const userdata = await user.insertMany(data);
    console.log(userdata);
    res.render("log in",{alert:'Sign up successfully' , title:'login page'});
    }
  };


  const gethome=(req, res) => {
      res.render('home',{username:req.session.username,email:req.session.email})

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



  const checksession=async(req,res,next)=>{
    if(req.session.username){
      const userfind=req.session.username;
      const existuser=await user.findOne({username:userfind})
      if(!existuser){
        req.session.destroy((err)=>{
          if(err){
            console.log(err)
          }
          res.redirect('/')
        })
      }else{
        next()
      }
    }else{
      next()
    }
  }


module.exports={getsignup,postsignup,gethome,getlogout,checksession};