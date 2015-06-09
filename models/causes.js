var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var CauseSchema = new Schema({

        id: String,
        cause: String

});

// the schema is useless so far
// we need to create a model using it
var causes = mongoose.model('causes', CauseSchema);

// make this available to our users in our Node applications
module.exports = causes;