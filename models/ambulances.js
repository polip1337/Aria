var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var AmbulanceSchema = new Schema({

        id: String,
        plates: String,
        created_at: Date,
        updated_at: Date

});

// the schema is useless so far
// we need to create a model using it
var Ambulances = mongoose.model('ambulances', AmbulanceSchema);

// make this available to our users in our Node applications
module.exports = Ambulances;