var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Space schema
var MessageSchema = new Schema({
    publish_date:       { type: Date },
    author:             { type: String },
    content:            { type: String }
});

// Export Models
module.exports = mongoose.model('Message', MessageSchema);