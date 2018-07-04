var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
    question: { type: String, required:true},
    answer: {type: String, required: true},
	created_at: { type: Date, default:Date.now },
    interactiveStory : { type:String },
    poster: { type: String},
    details: { type: String}
});

questionSchema.pre('save', function(next){
  now = new Date();
  this.created_at = now;
  next();
});

//questionSchema.index({ "title": 'text', "body": 'text', "author.name": 'text', "recap": 'text', "categories.tag": 'text' });

module.exports = mongoose.model('Question', questionSchema);