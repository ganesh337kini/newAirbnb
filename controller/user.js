const user=require("../models/user.js");
module.exports.signup=async(req,res)=>{
         let {username,email,password}=req.body;
     let newUser=new user({username,email});
     try{
     let registereduser=await user.register(newUser,password);
     req.login(newUser,(err)=>{
        if(err){
            return next(err);
        }
             req.flash("success","The user registered successfull");
         res.redirect("/listings");
     })

     }catch(e){
         req.flash("error",e.message);
         res.redirect("/signup");
     }

 
}
module.exports.login=(req,res)=>{
        req.flash("success","successfully logined")
        let redirecturl=res.locals.redirectUrl||"/listings";
        console.log(redirecturl);
        res.redirect(redirecturl);
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err); 
        }
        req.flash("success","You are succesfull loged out!");
        res.redirect("/listings"); 
    })
}