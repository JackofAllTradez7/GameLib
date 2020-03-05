var express = require("express")
var mongoose = require("mongoose")
var bcrypt = require("bcryptjs")
var passport = require("passport") // w6
var router = express.Router();

require("../models/User");
var User = mongoose.model("users")

// dont try to post here 

router.get("/login", function(req, res)
{
    res.render("users/login")
});

router.get("/register", function(req, res)
{
    res.render("users/register")
});


// post

router.post("/login", function(req, res, next)
{
    passport.authenticate("local", 
    {
        successRedirect:"/game/games",
        failureRedirect:"users/login",
        failureFlash: true
    })(req,res,next)
})

router.post("/register", function(req,res)
{
    var errors = []

    if(req.body.password != req.body.password2)
    {
        errors.push({text:"Passwords dont match"})
    }
    if(req.body.password.length < 4)
    {
        errors.push({text:"Password cannot be less than 4 characters"})
    }
    if(errors.length > 0)
    {
        res.render("users/register", 
        {
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        })
    }
    else
    {
        var newUser = new User(
        {
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })

        bcrypt.genSalt(10, function(err, salt)
        {
            bcrypt.hash(newUser.password, salt, function(err, hash)
            {
                if(err)throw err;
                newUser.password = hash;
                newUser.save().then(function(user)
                {
                    res.redirect("/users/login")
                }).catch(function(err)
                {
                    console.log(err);
                    errors.push({err:err})
                    res.render("users/register",
                    {
                        errors:errors
                    })
                    return;
                })

            })
        })

        
    }
});

router.get("/logout", function(req, res)
{
    req.logout()
    req.flash("success_msg", "Logged Out")
    res.redirect("/users/login")
})

module.exports = router;