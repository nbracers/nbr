var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResultSchema = new Schema({
    time:           { type: Number, default: 0 },
    rank:           { type: Number, default: 0 },
    point:          { type: Number, default: 0 },
    competition:    { type: Schema.Types.ObjectId, ref: 'Competition', default: null }
});

ResultSchema.methods.totalRanked = function totalRanked(callback){
	return this.model('Result').count({ competition: this.competition }, callback);
};

// Export Models
module.exports = mongoose.model('Result', ResultSchema);