var mongoose = require('mongoose');

var vandalyticSchema = new mongoose.Schema({
    page: { type: String, required:true},
    timestamps: [{ type: Date, default:Date.now }],
    count:{ type: Number, default: 0}
});

vandalyticSchema.pre('save', function(next){
  now = new Date();
  this.created_at = now;
  next();
});

module.exports = mongoose.model('Vandalytic', vandalyticSchema);