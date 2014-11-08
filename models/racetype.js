var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Space schema
var RacetypeSchema = new Schema({
    label:           { type: String, unique: true }
});

// Export Models
module.exports = mongoose.model('Racetype', RacetypeSchema);