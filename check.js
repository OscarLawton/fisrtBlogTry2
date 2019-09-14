if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config();
}

var express = require("express");
var mongoose = require("mongoose");
var path = require('path');
var bodyParser = require("body-parser");
var methodOveride = require("method-override");

var app = express();


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOveride("_method"));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", function(err){
    console.log(err);
})
db.once("open", function(){
    console.log("connected to mongoose");
});
const Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: String,
    imgurl: String,
    body: String
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
    Blog.find(function(err, blogs){
        if(err){
            console.log("something went wrong");
            console.log(err);
        } else {
            console.log("check out these blogs");
            console.log(blogs);
            res.render("home", {blogs: blogs});
        }
    });
    
});

app.get("/new", function(req, res){
    res.render("new");
});

app.post("/new", function(req, res){
   
    var title = req.body.title;
    var imgurl = req.body.imgurl;
    var body = req.body.body;
    var newBlog = {title: title, imgurl: imgurl, body: body}
    Blog.create(newBlog, function(err, newBlog){
        if(err){
            console.log("something went wrong");
            console.log(err);
        } else {
            console.log("created blog");
            console.log(newBlog)
        }
    });
    res.redirect("/");
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("something went wrong in the show route");
            console.log(err);
        } else {
            console.log("success in the show route");
            res.render("show", {blog: foundBlog});
        }
    })
    
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log("something went wrong to the edit route");
            console.log(err);
        } else {
            console.log("success in the show route");
            res.render("edit", {blog: foundBlog});
        }
    })
});

app.put("/blogs/:id", function(req, res){
    var title = req.body.title;
    var imgurl = req.body.imgurl;
    var body = req.body.body;
    var updateObject = {title: title, imgurl: imgurl, body: body};
    Blog.findByIdAndUpdate(req.params.id, updateObject, {new: true},function(err, updatedBlog){
        if(err){
            console.log("something went wrong updating");
            console.log(err);
            res.redirect("/blogs");
        } else {
            console.log("this ran in the update route");
            res.redirect("/blogs/"+ req.params.id);
        }
    })
});

app.put("/edit/:id", function(req, res){

});

app.delete("/blogs/:id", function(req ,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            console.log("blog deleted");
            res.redirect("/");
        }
    });
});

app.listen(process.env.PORT || 3000, function(){
    console.log("It's aliivee!!!!!");
});