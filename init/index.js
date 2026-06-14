const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
  require("dotenv").config();
const  MONGOURL= "mongodb://localhost:27017/traworld";

main().
then(()=>{
      console.log("connected to DB");
})
.catch((err)=>console.log(err));


async function main() {
     await mongoose.connect(MONGOURL);
}

 const initDB=async()=>{
       await Listing.deleteMany({});
      //using map
      initData.data=initData.data.map((obj)=>({...obj, owner: "6a22b1f0e90aa3213cabf918"}));
     
       await Listing.insertMany(initData.data);
       console.log("data is initialised");

   
  }

  initDB();
