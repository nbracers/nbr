var mongoose = require('mongoose');
//Define the database, either using MongoLab (Heroku) or local
var mongodbURL = process.env.MONGOLAB_URI;
var mongodbOptions = {};

mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) { 
        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    } else {
        console.log('Connection successful to: ' + mongodbURL);
    }
});