var express = require("express");
var app = express();
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var passport = require("passport");
var mongoose = require("mongoose");
var db = require("./helper/database")


var games = require("./routes/games")
var users = require("./routes/users")

var methodOverride = require("method-override");

//w6
require('./config/passport')(passport)

// w5
var session = require("express-session");
var flash = require("connect-flash");
// w5 end

mongoose.connect(db.mongoURI,
{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(function(){
    console.log("MongoDB connected")
}).catch(function(err)
{
    console.log(err);
});

app.use(methodOverride("_method"))

//end of week 4 stuff

// sets up express handlebars
app.engine("handlebars", exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

// creates json parser app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//w5 again
app.use(session(
    {
        secret:"secret",
        resave:true,
        saveUninitialized:true
    }))

app.use(flash());

//w6
app.use(passport.initialize())
app.use(passport.session())


app.use(function(req,res,next)
{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next();
});
//w5 end

// express handlebar routes
app.get("/", function(req, res)
{
    var title = "Welcome to the Gamer Library"
    res.render("index", 
    {
        title:title
    });
});

app.get("/about", function(req, res)
{
    res.render("about");
});


app.use("/game", games)
app.use("/users", users)
//end of week 5

var port = process.env.PORT || 5000

app.listen(port, function()
{
    console.log("Server running on port 5000");
})