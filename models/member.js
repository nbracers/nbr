var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Space schema
var MemberSchema = new Schema({
    email:          { type: String, unique: true },
    firstname:      { type: String },
    lastname:       { type: String },
    dob:            { type: Date },
    racer:          [{ type: Schema.Types.ObjectId, ref: 'Racer', default: [] }]
});

// Export Models
module.exports = mongoose.model('Member', MemberSchema);