const listing=require("./models/listing.js");
const review =require("./models/review.js");
const ExpressError=require("./utils/expressError.js")


const{listingSchema} =require("./schema.js");


module.exports.isLogedin=(req,res,next)=>{
  
    if(!req.isAuthenticated()){
     req.session.redirectUrl=req.originalUrl;    
    req.flash("error","You must be loged in")
    return res.redirect("/login")
}
next()

};

//note every session have that path from  original req but original url always faDE AFTER  EVERY
//  NEW REFRESS THEN WE OUT THAT USRLIN LOCALS VARIABLE
module.exports.SaveRedirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();

};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let s_listing=await listing.findById(id);
    if(!s_listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You dont have prmission to edit")
       return res.redirect(`/listings/${id}`)
    }
    next()
}


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
   let t_review= await review.findById(reviewId);
    if(!t_review.author.equals(res.locals.currUser._id)){
        req.flash("error","You dont have prmission to delete this review")
       return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
   
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(","); 
        throw new ExpressError(400,errmsg );
     } else{
        next();
     }
    };