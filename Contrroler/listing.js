const listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_token=process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken:map_token });


module.exports.index= async(req,res)=>{
const all_listings=await listing.find();
    // console.log(all_listings)
    res.render("./listings/index.ejs",{all_listings});
}




module.exports.show=async(req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner")
    if(!listings){
       req.flash("error","Your Request does not exits");
       res.redirect("/listings")
    }
   //  console.log(f_listing)
   res.render("./listings/show.ejs",{listings});
   };


   module.exports.edit=async(req,res)=>{
    let {id}=req.params;   
    let u_listing=req.body.listing;
    let up_listing=new listing(u_listing);
    let this_listing=await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!==undefined){
        let url=req.file.path;
        let filename=req.file.filname;
        this_listing.image={url,filename};
        await this_listing.save();
    }
    req.flash("success","Your Listing has Edited")
    console.log(up_listing)
    res.redirect("/listings");
   

    //for 
};
module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    let t_listing=await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}

module.exports.edit2=async(req,res)=>{
    let {id}=req.params;
    let this_listing=await listing.findById(id);
   //  console.log(f_listing)
   let originalimage=this_listing.image.url;
 let originalimageurl=originalimage.replace("/upload","/upload/h_300,w_300");
   res.render("./listings/edit.ejs",{this_listing,originalimageurl});
   
}

module.exports.add=
async(req,res,next)=>{
    //forward geocoding
    let responce=await geocodingClient
    .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
     })
     .send();
     
     console.log(responce.body.features[0].geometry)
    //  res.send("done")
   
    let url=req.file.path;
    let filname=req.file.filname;
    // console.log(url,"..",filname)
    let newlisting=req.body.listing;
    newlisting.owner=req.user._id;
    newlisting.image={url,filname};
    newlisting.geometry=responce.body.features[0].geometry
    let new_listing=new listing(newlisting);
    await new_listing.save();
    //use of flash
    req.flash("success","A new Listing Created")
    console.log(new_listing);
    res.redirect("/listings")
} 