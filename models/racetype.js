var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Space schema
var RacetypeSchema = new Schema({
    label:           { type: String, unique: true },
    header_no: 		 { type: String, default: ""}
});

// Export Models
module.exports = mongoose.model('Racetype', RacetypeSchema);