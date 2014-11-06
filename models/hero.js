var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Space schema
var HeroSchema = new Schema({
    season:             { type: Schema.Types.ObjectId, ref: 'Season', default: null },
    competition:        [{ type: Schema.Types.ObjectId, ref: 'Competition', default: [] }]
});

// Export Models
module.exports = mongoose.model('Hero', HeroSchema);