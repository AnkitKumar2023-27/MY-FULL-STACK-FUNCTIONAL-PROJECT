    const Joi=require("joi");
    
 module.exports.listingSchema=Joi.object({
       listing:Joi.object({
            title:Joi.string().required(),
            description:Joi.string().required(),
            price:Joi.number().required(),            
          location:Joi.string().required(),
          country:Joi.string().required(),
           image:Joi.string(),
       }).required()
    })
// module.exports=listingSchema;


module.exports.reviewSchema=Joi.object({
    review:Joi.object({
       
       rating:Joi.number().required(),
       comment:Joi.string().required(),
       
   })
});
 