const User = require("../Models/user.js");

// SIGNUP

module.exports.renderSignUp= (req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.userSignup= async(req,res)=>{
    try{
        let{username,email,password}= req.body;
        const newUser = new User({email,username});
        const registerUser= await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust!");
            res.redirect("/listings");
        });
    } catch(error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }  
};

// LOGIN

module.exports.renderLogIn = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.userLogIn = async(req, res)=>{
        req.flash("success","Welcome to wanderlust!");
        let redirectUrl =res.locals.redirectUrl || "/listings"; 
        res.redirect(redirectUrl);
};

// LOGOUT
module.exports.userLogOut = (req,res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are looged out!");
        res.redirect("/listings");       
    });
};