const mongoose = require('mongoose');
const listing=require("../models/listing.js");
const initdata=require('./data.js');
main().then((err)=>{
  console.log("no error");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}
const initdb=async ()=>{
  await listing.deleteMany({});
  initdata.data=initdata.data.map(obj => ({ ...obj, owner: "68918a9f2e1781f7771a2e62" }));
  await listing.insertMany(initdata.data) ;
  console.log("data was initialized");   

}
initdb();