const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const passport = require("passport");
const ExpressError=require("../utils/expressError");
const { SaveRedirectUrl}=require("../middleware.js")
const { register } = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

//  SIGNUP
router.get("/signUp",(req,res)=>{
        res.render("./user/signUp.ejs");
});



 router.post("/signUp",wrapAsync(async(req,res)=>{
   try{ let{email,username,password}=req.body;
    const Newuser=new User({email,username,});
    const RegiteredUser=await User.register(Newuser,password);
    
    console.log(RegiteredUser);
//  how to direct login with sign up
     req.login(RegiteredUser,(err)=>{
      if(err) {return next(err)}; 
      req.flash("success","Welcome to wandurlust")
      res.redirect("/listings")
    })
   
}catch(e){
        req.flash("error",e.message);
        res.redirect("/signUp");
}
 }))

//LOGIN ROUTE

 router.get("/login",(req,res)=>{
        res.render("./user/login.ejs");
});


 router.post("/login",SaveRedirectUrl,
 passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
        async(req,res)=>{
        req.flash("success","Welcome to wanderlst You are now loged in");
         let redirectUrl=res.locals.redirectUrl||"/listings";
         res.redirect(redirectUrl)                 
});

router.get("/logout",(req,res,next)=>{
        req.logOut((err)=>
                {
                if(err){
                        return next(err)
 }
 req.flash("sucess","you Are logedout");
 res.redirect("/listings")
})
});





module.exports=router;