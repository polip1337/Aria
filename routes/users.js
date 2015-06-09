var express = require('express');
var locations = require('../models/locations');

var router = express.Router();

var util = require('util');
/* GET users listing. */

router.get('/locationlist', function(req, res) {

  locations.find({}, function(err, users) {
    if (err) throw err;

    // object of all the users

    console.log("locationlist retrieved");
    /*
    console.log(users);
    */
    res.json(users);
  });

});
/*
 * POST to adduser.
 */
router.post('/addlocation', function(req, res) {
  var newAmbulance = {
    id:req.body.ambulanceId

  };
  var newCause = {
    id:req.body.cause

  };
  var newLocation = locations({
    cause: newCause,
    ambulance: newAmbulance,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });
  newLocation.save(function(err) {
    if (err) throw err;
    console.log('Location saved successfully');
    /*
    console.log(req.body.ambulanceId);
    console.log(newLocation.latitude);

    */
    res.send(
        (err === null) ? { msg: '' } : { msg: err }
    );
  });

});
/*
 * DELETE to deleteuser.
 */
router.delete('/deletelocation/:id', function(req, res) {
  locations.findByIdAndRemove({_id:req.params.id}, function(err) {
    if (err) throw err;

    // we have deleted the user
    console.log('User deleted!');
    var result = 1;
    res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
  });

});
module.exports = router;

