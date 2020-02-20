var express = require("express")
var mongoose = require("mongoose")
var router = express.Router();
var {ensureAuthenticated} = require("../helper/auth")

require("../models/Game");
var Game = mongoose.model("games")

// week 5 changed routes to have extra game as seen below

router.get("/games", ensureAuthenticated, function(req, res)
{
    Game.find({user:req.user.id}).then(function(games)
    {
        res.render("gameentry/index",
        {
            games:games
        });
        
    })
});

// more week 4 shenanigans
router.get("/gameentry/gameentryadd", ensureAuthenticated, function(req, res)
{
    res.render("gameentry/gameentryadd");
});

router.get("/gameentry/gameentryedit/:id", ensureAuthenticated, function(req, res)
{
   Game.findOne(
       {
        _id:req.params.id
       }).then(function(game)
        {

            if(game.user != req.user.id)
            {
                req.flash("error_msg", "not authorized");
                res.redirect("/game/games");
            }
            else
            {
                res.render("gameentry/gameentryedit",
                {
                game:game
                });
            }

            
        })
});

// end of week 4

// post request
router.post("/gameentry", ensureAuthenticated, function(req,res)
{
    console.log(req.body);
    // week 4
    var errors = [];

    if(!req.body.title)
    {
        errors.push({text:"Add a title"});
    }

    if(!req.body.price)
    {
        errors.push({text:"Add a price"});
    }

    if(!req.body.description)
    {
        errors.push({text:"Add a description"});
    }

    if(errors.length > 0)
    {
        res.render("gameentry/gameentryadd", 
        {
            errors:errors,
            title:req.body.title,
            price:req.body.price,
            description:req.body.description
        });
    }
    else
    {
        var newUser = 
        {
        title:req.body.title,
        price:req.body.price,
        description:req.body.description,
        user:req.user.id
        }

        Game(newUser).save().then(function()
        {
            req.flash("success_msg", "Game Added")
            res.redirect("games")
        });
    }
    
});

router.put("/gameedit/:id", ensureAuthenticated, function(req, res)
{
    Game.findOne(
        {
            _id:req.params.id
        }).then(function(game)
        {
            game.title = req.body.title
            game.price = req.body.price
            game.description = req.body.description

            game.save().then(function(game)
            {
                req.flash("success_msg", "Game Updated")
                res.redirect("/game/games")
            })
        })
})

//end of week 4

// week 5
router.delete('/gamedelete/:id', ensureAuthenticated, function(req, res)
{
    Game.remove(
        {
            _id:req.params.id
        }).then(function()
        {
            req.flash("success_msg", "Game Deleted")
            res.redirect("/game/games")
        })
})

module.exports = router;