var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/get', function(req, res) {
    var db = req.db;
    db.collection('locations').find().toArray(function (err, items) {
        res.json(items);
    });
});
/*
 * POST to adduser.
 */
router.post('/add', function(req, res) {
    var db = req.db;
    db.collection('locations').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});
/*
 * DELETE to deleteuser.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('locations').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});
module.exports = router;

