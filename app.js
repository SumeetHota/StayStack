if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app= express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/wrapError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");   //connect-flash is used to send short-lived messages (success, error, warning) between requests.
const passport  = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");

// paths from routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

// ------------------------------------- //

const dbUrl = process.env.ATLASDB_URL;  

main()
    .then(()=>{
    console.log("connect to DB.")
})
    .catch((err)=>{
    console.log(err);
});
async function main() {
  await mongoose.connect(dbUrl);
}
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname,"Views"));  
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));  
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store= MongoStore.create({
  mongoUrl: dbUrl,
  crypt:{
    secret:process.env.SECRET,
  },
  touchAfter: 24* 3600,
});
store.on("error",(err) => {
  console.log("Error in mongo  seesion store", err);
});
 
const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now()+7 *24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  },
};
// --------------------------------------------------------------- // 
// app.get("/", (req,res)=>{
//     res.send("app is working.");
// });
// Flash



app.use(session(sessionOptions));
app.use(flash());

// Passport-Local Mongoose
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Demo Rouute  
// app.get("/demouser", async(req,res)=>{
//   let fakeUser = new User({
//     email:"xyz@hmail.com",
//     username:"My-project"
//   });
//   let registerUser = await User.register(fakeUser, "fakePass@123");
//   res.send(User.registerUser);
// });

// Route Express
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

// Error Handling
app.use((req,res,next)=>{
  next(new ExpressError(404, "Page not found!!"));
});
app.use((err,req,res,next)=>{
  let{ statusCode=500, message="Somthing went wrong!"}= err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message); 
});

 
app.listen(3000,()=>{
    console.log("Server is listing to your port 3000");
});



// mongodb+srv://Wanderlust:Myfirstproject#123@cluster0.utvoe8t.mongodb.net/?appName=Cluster0