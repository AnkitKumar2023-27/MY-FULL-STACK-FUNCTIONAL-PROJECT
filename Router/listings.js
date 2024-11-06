const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const{listingSchema} =require("../schema.js");
const {isLogedin,isOwner,validateListing}=require("../middleware.js")
const listing = require("../models/listing");
const ExpressError=require("../utils/expressError.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

const listingController=require("../Contrroler/listing.js")

//ADD NEW ROUTE


router.get("/new",isLogedin,(req,res)=>{
   res.render("./listings/new.ejs")
});
// router.post('/', upload.single('listing[image]'), function (req, res) {
//     res.send(req.file);
//  });
        
router.post("/",
   isLogedin,
   upload.single('listing[image]'),
   validateListing,
   wrapAsync(listingController.add));

//HOME ROUTE
router.get("/",wrapAsync(listingController.index));

//SHOW ROUTE
router.get("/:id",wrapAsync(listingController.show));
//EDIT ROUTE

router.get("/:id/edit",
    isLogedin
    ,listingController.edit2
);

router.patch("/:id",
    isLogedin,
    isOwner,
    upload.single('listing[image]'),
    validateListing,wrapAsync(listingController.edit));
//DELETE ROUTE


router.delete("/:id",isLogedin,wrapAsync(listingController.delete));

module.exports=router;