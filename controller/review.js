const listing=require("../models/listing.js");
const review=require("../models/review.js");
module.exports.addreview=async(req,res)=>{
  let listings=await listing.findById(req.params.id);
  let newreview= new review(req.body.review);
  newreview.author=req.user._id;
  console.log(newreview);
  listings.review.push(newreview);
  await newreview.save();
  await listings.save();
  req.flash("success","New review added successfull");
 res.redirect(`/listings/${req.params.id}`);
}
module.exports.destroyreview=async(req,res)=>{
  let {id,reviewid}=req.params;
  // console.log(id,reviewid);
  await listing.findByIdAndUpdate(id,{$pull:{review:reviewid}});
  const foundReview = await review.findById(reviewid);
  if(foundReview && foundReview.author.equals(req.user._id));
      await review.findByIdAndDelete(reviewid);
   res.redirect(`/listings/${id}`);
}