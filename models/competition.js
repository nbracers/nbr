var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Space schema
var CompetitionSchema = new Schema({
    competition_date:   { type: Date },
    description:        { type: String },
    racetype:           { type: String }
});

// Export Models
module.exports = mongoose.model('Competition', CompetitionSchema);