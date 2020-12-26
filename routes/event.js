
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var ObjectId = require('mongodb').ObjectID;
var db = mongojs('mongodb://dridy:fkawk1@ds121906.mlab.com:21906/danang',['event']);

const exec = require('child_process').exec;


router.get('/event', function(req, res, next){

    console.log(req.params);
    // var yourscript = exec('node stock 015760',
    //        (error, stdout, stderr) => {
    //            console.log(`${stdout}`);
    //            console.log(`${stderr}`);
    //            if (error !== null) {
    //                console.log(`exec error: ${error}`);
    //                res.json({'result': 40041})
    //            }
    //            else{
    //                 res.json({page : 1, value : 2})
    //            }
    //        });

    

})

router.get('/event/:id', function(req, res, next){

    console.log('req.params', req.params);

})


router.delete('/event/:id', function(req, res, next){
    db.star.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, boards){
        if(err){
            res.send(err);
        }
        res.json(boards);
    });
})


module.exports = router;


