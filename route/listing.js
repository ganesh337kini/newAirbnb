const express=require('express');
const router=express.Router({mergeParams:true});
const listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js").default;
const ExpressError=require("../utils/expressError.js");
const {validateSchema}=require("../validateSchema.js");
const {isUser}=require("../utils/middleware.js");
const listings=require("../controller/listing.js");
const {storage}=require("../cloud.js");
const multer  = require('multer')
const upload = multer({storage});
const validate=(req,res,next)=>{
  const {result}= validateSchema.validate(req.body);
  if(result)
     throw new ExpressError(result.details);
  else
    next();
}
router.get("/",wrapAsync(listings.showalllistings));
router.get("/new",isUser,wrapAsync(listings.renderlist));
router.post("/",validate,upload.single('listing[image]'),wrapAsync(listings.newlist));
router.get("/:id/edit",isUser,wrapAsync(listings.editlist));
router.get("/:id",wrapAsync(listings.showlistings));
router.put("/:id",validate,upload.single('listing[image]'),wrapAsync(listings.updatelist));
router.delete("/:id",isUser,wrapAsync(listings.destroylist));
module.exports=router;