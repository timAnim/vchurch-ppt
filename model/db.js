var mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost:27017/bible'

mongoose.Promise = global.Promise;
let options = {
  poolSize: 5,
  useNewUrlParser: true,
}

mongoose.connect(DB_URL, options);

mongoose.connection.on('connect', function () {    
    console.log('Mongoose connection open to ' + DB_URL);  
});    

mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err);
});    
 
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected');  
});

module.exports = mongoose;