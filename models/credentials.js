
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Credentails = module.exports = mongoose.model('credentials',{
        username: String,
        password: String,
        email: String,
        gender: String,
        address: String
});

// make this available to our users in our Node applications
module.exports = Credentails;