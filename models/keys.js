var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var keySchema = new Schema({
    appid: String,
    key: String,
    skey: String
});

module.exports = mongoose.model('Key', keySchema);
