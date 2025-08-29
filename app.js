if(process.env.NODE_ENV != "production"){
 require('dotenv').config()
}


const express=require('express');
const app=express();
const mongoose = require('mongoose');
const path = require('path');
app.set("view engine","ejs");
const engine = require('ejs-mate');
app.engine('ejs', engine);
app.set("views",path.join( __dirname,"/views"));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
const wrapAsync=require("./utils/wrapAsync.js").default;
const ExpressError=require("./utils/expressError.js");
const listings=require("./route/listing.js");
const reviews=require("./route/review.js");
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const user=require("./models/user.js");
const passport=require("passport");
const localStratergy=require("passport-local");
const signup=require("./route/user.js");
const atlas_db=process.env.Atlas_url;
async function main() {
  await mongoose.connect(atlas_db);
}
main().then((err)=>{
  console.log("no error");
})
.catch((err) => console.log(err));
const store=MongoStore.create({
   mongoUrl:atlas_db,
   crypto: {
    secret: 'hihowareyou'
  },
  touchAfter:24*3600
})
const sessionOption={
  store,
  secret:"hihowareyou",
  resave:false,
  saveUninitialized:true,
  cookie:{
     expires:Date.now()+7*24*60*60*1000,
     maxAge:7*24*60*60*1000,
     httpOnly:true,
  }
}
app.get("/",async (req,res)=>{
   res.redirect("/listings");
});
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curruser=req.user;
  next();
})
app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);
app.use("/",signup);
// Catch-all route for undefined paths
app.all('/*splat',(req, res) => {
  throw new ExpressError(404, "Page Not Found");
});
// Error handler middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});
app.listen(8080,()=>{
    console.log("app is linstening");
})