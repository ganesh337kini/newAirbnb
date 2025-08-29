const express=require('express');
const router=express.Router();
const passport=require("passport");
const user=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js").default;
const {saveRedirectUrl}=require("../utils/middleware.js");
const users=require("../controller/user.js")
router.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});
router.post("/signup",wrapAsync(users.signup));
router.route("/login")
.get((req,res)=>{
    res.render("login.ejs");
})
.post(saveRedirectUrl,passport.authenticate("local" ,{ failureRedirect: '/login' ,failureFlash:true}),users.login);
router.get("/logout",users.logout);
module.exports=router;