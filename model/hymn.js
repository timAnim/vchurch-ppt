var mongoose = require('./db.js'),
  Schema = mongoose.Schema;

var HymnSchema = new Schema({
  "sn": {
    type: Number,
  },
  "name": {
    type: String,
  },
  "content": {
    type: String
  }
});

module.exports = mongoose.model('hymn', HymnSchema, 'hymn');