const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const{ reviewSchema} = require("../schema.js")
const ExpressError=require("../utils/expressError.js");
const review = require("../models/review.js");
const listing = require("../models/listing");
const {isReviewAuthor }=require("../middleware.js")
const {isLogedin,isOwner}=require("../middleware.js")

// ################## VALIDATION ROUTE FOR REVIEWS#######################

const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body)
   console.log(error)
    if(error){
        let errmsg=error.details.map(el=>el.message).join(","); 
        throw new ExpressError(400,errmsg ) }}


// %%%%%%%% ROUTE FOR DELETE A REVIEW #############################

router.delete("/listings/:id/Reviews/:reviewId",isLogedin,isReviewAuthor,(async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","review was deleted")
    res.redirect(`/listings/${id}`)
}));

// #####  REVIEW ROUTE ALL LISTING #############################

router.post("/listings/:id/Reviews",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let that_listing=await listing.findById(req.params.id);//it find that particular listing
    let newReview=new review(req.body.review);
    newReview.author=req.user._id;
    that_listing.reviews.push(newReview);
    await that_listing.save();
    await newReview.save();
    res.redirect(`/listings/${id}`)
}));
module.exports=router;