var mongoose = require('./db.js'),
  Schema = mongoose.Schema;

var VolumeSchema = new Schema({
  "sn": {
    type: Number
  },
  "type": {
    type: Number,
  },
  "chapterNumber": {
    type: Number,
  },
  "newOrOld": {
    type: Number
  },
  "shortName": {
    type: String,
  },
  "fullName": {
    type: String
  }
});

module.exports = mongoose.model('volume', VolumeSchema, 'volume');
