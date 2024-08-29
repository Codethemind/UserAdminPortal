const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const user = require("./models/customermodel");
const nocache = require("nocache");
const session = require("express-session");
const bcrypt = require("bcrypt");
const userRouter=require('./router/userRouter');
const adminRouter=require('./router/adminRouter');

mongoose.connect("mongodb://127.0.0.1:27017/codethemind");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(nocache());
app.use(session({secret: "nothg",resave: false, saveUninitialized: false,}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use('/user',userRouter)
app.use('/admin',adminRouter)


app.get("/", (req, res) => {
  if(req.session.username){
    res.redirect('/user/home')
  }else if(req.session.isAdmin){
    res.redirect('/admin/admin')
  }else{
    res.render("log in", { title: "login page" });
  }
});

app.post("/login", async (req, res) => {
  if(req.session.username){
    res.redirect('/user/home')
  }else{
    try {
      const check = await user.findOne({ username: req.body.loginusername });
      if (!check) {
        return res.render("log in", {
          title: "Login Page",
          notexist: "User not found",
        });
      }
      const passwordMatch = await bcrypt.compare(req.body.loginpassword, check.password);
      if (passwordMatch) {
        
        req.session.username = check.username;
        console.log("hello")
        req.session.email = check.email;
        if(check.isAdmin){
          req.session.username=false;
          req.session.isAdmin=true
          res.redirect('/admin/admin')
        }else{
          res.redirect('/user/home')
        }
      } else {
        res.render("log in", { title: "Login Page", error: "Incorrect password" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred during login.");
    }
  } });

 
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
