const { fileLoader } = require('ejs');
const { string } = require('joi');
const mongoose = require('mongoose');

const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connection is working")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};
const schema=mongoose.Schema;
 const listningSchema=new schema({
    title:{type:String,
        required:true,
    },
    description:{type:String,
      required:true,
    },
    image:{ 
    url:String,
     filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
      type:schema.Types.ObjectId,
      ref:"review",
    }],
    owner:{
      type:schema.Types.ObjectId,
      ref:"User",
    },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  
  
 });

 const listing=mongoose.model("listing",listningSchema);
 module.exports=listing;