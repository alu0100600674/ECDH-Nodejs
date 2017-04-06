var express = require('express');
var router = express.Router();

var security = require('../controllers/security.js');

var mongoose = require('mongoose');
var Key = require('../models/keys');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET test communication */
router.get('/test', function(req, res, next) {
    res.send("SERVER PUBLIC KEY");
});

/* POST test communication */
router.post('/test', function(req, res, next) {
    // console.log("CLIENT PUBLIC KEY POINTS: " + req.body.publickey);
    // // res.send("SERVER-PUBLIC-KEY");
    // res.send({"serverkey" : "MDYwEAYHKoZIzj0CAQYFK4EEABwDIgAEruGXPxl2BAaTLAVVL+TjKMIU+VJX1BJgkPONygFh6xQ="});

    keyPair = security.ecdh.generateKeyPair();
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;
    clientKey = security.ecdh.pointToPublicKey(req.body.publickey);

    console.log(req.body.publickey);

    //ecdh
    agreedKey = security.ecdh.generateAgreedKey(privateKey, clientKey);
    // console.log(agreedKey);

    console.log(req.body.appid);
    Key.findOne({appid: req.body.appid}, function(err, k){
        if(k != null)
            k.remove();
    });
    var newkey = new Key({
        appid: req.body.appid,
        key: agreedKey
    });
    newkey.save();

    // PRUEBAS
    // security.aes.setClave(agreedKey.toString('base64'));
    var cif = security.aes.encrypt("hola", agreedKey.toString('base64'));
    console.log(cif);

    // FIN PRUEBAS

    // res.send("ok")
    res.send({"serverkey" : publicKey.buffer.toString('hex')});
});

router.post('/msg', function(req, res, next) {
    Key.findOne({appid: req.body.appid}, function(err, k){
        console.log(k.key);
        // security.aes.setClave(k.key.toString('base64'));

        // DESCIFRADO
        var descifrado = security.aes.decrypt(req.body.msg, k.key.toString('base64'));
        console.log(descifrado);
    });

    res.send(200);
});

router.get('/ver', function(req, res, next) {
    Key.find(function(err, keys){
        if(!err){
            console.log(keys);
        }else{
            console.log(err);
        }
    });
    res.send(200);
});

router.get('/add', function(req, res, next) {
    Key.findOne({appid: "1234"}, function(err, k){
        if(k != null)
            k.remove();
    });
    // var newkey = new Key({
    //     appid: "1234",
    //     key: "agreedKey"
    // });
    // // newKey.save();
    // newkey.save();

    res.send(200);
});


module.exports = router;
