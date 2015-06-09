var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var locationSchema = new Schema({
    cause:{
        id: String,
        cause: String
    },
    ambulance: {
        id: String,
        plates: String,
        created_at: Date,
        updated_at: Date
    },
    client:{
        id: String,
        emaillocations: String,
        created_at: Date,
        updated_at: Date
    },

    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    created_at: Date,
    updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var clients = mongoose.model('locations', locationSchema);

// make this available to our users in our Node applications
module.exports = clients;