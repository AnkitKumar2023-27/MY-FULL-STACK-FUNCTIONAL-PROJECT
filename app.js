if(process.env.ENV_NODE!="prduction"){
    require('dotenv').config()
}


 


const express=require("express");
const path=require("path");
const  ejsMate = require('ejs-mate');

const ExpressError=require("./utils/expressError.js")
const app=express();
const reviews=require("./Router/reviews.js");
const listings=require("./Router/listings.js");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session=require("express-session");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const UserRouter=require("./Router/user.js");
const MongoStore = require('connect-mongo');



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));




// for storing the session on  Atlas DB

const Store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
 
Store.on("errror",()=>{
    console.log("error in mongo session store",err)

 })

const sessionOption={
    Store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    Cookie:{
        secure:true,
        expire:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
    }
}
//  ##################### passport related work##########

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
//try of password
app.get("/demoUser",async(req,res)=>{
    let fakeUser=new User({
        email:"ankit@gmail.com",
        username:"Ankit Kumar"
    });
    const RegiteredUser=await User.register(fakeUser,"Ankit");
 res.send(RegiteredUser);
})




// const listing = require("./models/listing");

app.use("/listings",listings);
app.use("/",reviews);
app.use("/",UserRouter);

app.use(express.static(path.join(__dirname,"public")))

app.listen("8080",()=>{

    console.log("its going good")
})

main()
.then(()=>{
console.log("connection is working")})
.catch(err => console.log(err));

async function main() {
   await mongoose.connect(dbUrl );

};

// /error handler
const chektoken=(req,res,next)=>{
    let{token}=req.query;
    if(token===giveAccess){
        next();
    }
    {
        throw  new ExpressError(402,"there is error")
    }
};
app.get("*",(req,res,next)=>{
     next(new ExpressError(404,"there is big error"))
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong "}=err;
res.render("./listings/error.ejs",{message});
})

app.get("/",(req,res)=>{
    res.send("server is connnecte")
});