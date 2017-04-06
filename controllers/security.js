var crypto = require('crypto');

/*
 * Advanced Encryption Standard 256 bit
 * Cipher Block Chaining mode
 */
exports.aes = (function(clave) {
  var cipher_descifrar, cipher_cifrar, descifrar, setClave, cifrar, iv, key;
  key = crypto.createHash("sha256").update("somepassword").digest();
  iv = '4e5Wa71fYoT7MFEX';
  cipher_descifrar = function(mode, data) {
    var encipher, encoded;
    encipher = crypto[mode]("aes-256-cbc", key, iv);
    encoded = encipher.update(data,'base64','utf8');
    encoded += encipher.final('utf8');
    return encoded;
  };
  cipher_cifrar = function(mode, data) {
    var encipher, encoded;
    encipher = crypto[mode]("aes-256-cbc", key, iv);
    encoded = encipher.update(data,'utf8','base64');
    encoded += encipher.final('base64');
    return encoded;
  };
  cifrar = function(data) {
    return cipher_cifrar("createCipheriv", data);
    console.log("cifrado");
  };
  descifrar = function(data) {
    return cipher_descifrar("createDecipheriv", data);
  };
  setClave = function(clave){
      key = crypto.createHash("sha256").update(clave).digest();
  };
  getClave = function(){
      return key;
  };
  return {
    cifrar: cifrar,
    descifrar: descifrar,
    setClave : setClave,
    getClave : getClave
  };
})();

/*
 * Elliptic Curve Diffie-Hellman
 * Hash algorithm: SHA256
 * Curve: secp128r1
 */
exports.ecdh = (function(){
    var ecdh = require('ecdh');
    var curve = ecdh.getCurve('secp128r1');
    generateKeyPair = function(){
        return ecdh.generateKeys(curve);
    };
    pointToPublicKey = function(hexPoint){
        var buffer = new Buffer(hexPoint, 'hex');
        var publicKey = ecdh.PublicKey.fromBuffer(curve, buffer);
        return publicKey;
    };
    pointToPrivateKey = function(hexPoint){
        var buffer = new Buffer(hexPoint, 'hex');
        var privateKey = ecdh.PrivateKey.fromBuffer(curve, buffer);
        return privateKey;
    };
    generateAgreedKey = function(privateKey, publicKey){
        var agreedKey = privateKey.deriveSharedSecret(publicKey);
        return agreedKey.toString('base64');
    };
    return{
        generateKeyPair : generateKeyPair,
        pointToPublicKey : pointToPublicKey,
        pointToPrivateKey : pointToPrivateKey,
        generateAgreedKey : generateAgreedKey
    }
})();

/*
 * Elliptic Curve Digital Signature Algorithm
 * Hash algorithm: SHA256
 * Curve: secp256k1
 */
exports.ecdsa = (function(){
    var ecdh = require('ecdh');
    var curve = ecdh.getCurve('secp256k1');
    var algorithm = 'sha256';
    generateKeyPair = function(){
        return ecdh.generateKeys(curve);
    };
    messageToHash = function(message){
        var msg = new Buffer(message, 'utf8');
        var hash_msg = crypto.createHash(algorithm).update(msg).digest();
        return hash_msg;
    };
    base64ToSignature = function(base64){
        return new Buffer(base64, 'base64');
    };
    hexToSignature = function(base64){
        return new Buffer(base64, 'hex');
    };
    pointToPublicKey = function(hexPoint){
        var buffer = new Buffer(hexPoint, 'hex');
        var publicKey = ecdh.PublicKey.fromBuffer(curve, buffer);
        return publicKey;
    };
    sign = function(message, privateKey){
        var signature = privateKey.sign(messageToHash(message), algorithm);
        return signature.toString('base64');
    };
    verify = function(message, publicKey, signature){
        return publicKey.verifySignature(messageToHash(message), base64ToSignature(signature));
    };
    return{
        generateKeyPair : generateKeyPair,
        pointToPublicKey : pointToPublicKey,
        sign : sign,
        verify, verify
    }
})();
