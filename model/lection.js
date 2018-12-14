var mongoose = require('./db.js'),
  Schema = mongoose.Schema;

var LectionSchema = new Schema({
  "volumeSN": {
    type: Number,
  },
  "chapterSN": {
    type: Number,
  },
  "verseSN": {
    type: Number
  },
  "lection": {
    type: String,
  }
});

module.exports = mongoose.model('lection', LectionSchema, 'lection');
