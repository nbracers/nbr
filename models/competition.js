var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Space schema
var CompetitionSchema = new Schema({
    competition_date:   { type: Date },
    description:        { type: String },
    racers:             { type: Array, default: [] },
    racetype:           { type: Schema.Types.ObjectId, ref: 'Racetype', default: null },
    season:             { type: Schema.Types.ObjectId, ref: 'Season', default: null }
});

// Export Models
module.exports = mongoose.model('Competition', CompetitionSchema);