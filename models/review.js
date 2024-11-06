const mongoose = require('mongoose');
const Schema=mongoose.Schema;


const dbUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connection is working")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};

 const reviewSchema=new Schema({
      comment:String,

      rating:{type:Number,
             min:1,
             max:5,
      },
      author:{
        type:Schema.Types.ObjectId,
        ref:"User"
      }
      
 })

 const review=mongoose.model("review",reviewSchema);
 module.exports=review;