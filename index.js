var database = null;
//set up
var express = require('express')
var app = express();
var bodyParser = require('body-parser')

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list
var posts = [];

//let a client GET the list
var sendPostsList = function (request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);

app.get('/post', function (req, res) {
  var post = posts.find(x => x.id == searchId);
  res.send(post);
});



//let a client POST something new
var saveNewPost = function (request, response) {
  console.log(request.body.message); //write it on the command prompt so we can see
  var post= {};
  post.id = Math.round(Math.random() * 10000);
  post.author = request.body.author;
  post.message = request.body.message;
  post.time = new Date();
  post.image = request.body.image;
  if (post.image == "") {
   post.image = "http://d39kbiy71leyho.cloudfront.net/wp-content/uploads/2016/01/19125215/what-age-do-cats-eye-color-change-03-600x600.jpg";
}
  posts.push(post);
  var dbPosts = database.collection('posts');
  dbPosts.insert(post);
 //save it in our list

  response.send("thanks for your message. Press back to add another");
}
app.post('/posts', saveNewPost);

//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");

var mongodb = require('mongodb');
var uri = 'mongodb://gretagotlieb:Passw0rd@ds125016.mlab.com:25016/gretagotlieb';
mongodb.MongoClient.connect(uri, function(err, newdb) {
  if(err) throw err;
  console.log("yay we connected to the database");
  database = newdb;
  var dbPosts = database.collection('posts');
  dbPosts.find(function (err, cursor) {
    cursor.each(function (err, item) {
      if (item != null) {
        posts.push(item);
      }
    });
  });
});
