const express=require('express');
const router=express.Router({mergeParams:true});
const review=require("../models/review.js");
const listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js").default;
const ExpressError=require("../utils/expressError.js");
const {reviewSchema}=require("../validateSchema.js");
const {isUser}=require("../utils/middleware.js");
const reviews=require("../controller/review.js")
const reviewValidate=(req,res,next)=>{
  const {result}=reviewSchema.validate(req.body);
  if(result)
     throw new ExpressError(result.details);
  else
    next();
}
router.post("/",isUser,reviewValidate,wrapAsync(reviews.addreview));
router.delete("/:reviewid",isUser,wrapAsync(reviews.destroyreview));
module.exports=router;