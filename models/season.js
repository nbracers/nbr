var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Space schema
var SeasonSchema = new Schema({
    start_year:         { type: Number },
    label:              { type: String }
});

// Export Models
module.exports = mongoose.model('Season', SeasonSchema);