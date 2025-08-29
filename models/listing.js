const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const review=require("./review.js");
const User=require("./user.js")
const ListSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
    filename: {
      type: String,
      default: 'listingimage',
    },
    url: {
      type: String,
      default: 'https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg',
     set: (v) => {
  // Check for empty string, null, undefined, or only whitespace
     if (!v || v.trim() === '') {
         return 'https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg';
      }
     return v;
  }}},
    price:{
      type:Number,
       required:true,
    },
    location:{
      type:String,
       required:true,
    },
    country:{
      type:String,
       required:true,
    },
  review:[
    {
      type:Schema.Types.ObjectId,
      ref:"review",
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
});
ListSchema.post("findOneAndDelete",async(listing)=>{
  if(listing)
    await review.deleteMany({_id:{$in:listing.review}})
 console.log(listing);
})
const listing =mongoose.model("listing",ListSchema);
module.exports=listing;