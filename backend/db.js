// DB connection
const mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { console.log("Connected to mongodb server") });

mongoose.connect(
    'mongodb://root:webgrus01@14.35.13.88:27017/?authSource=admin', // placeholder password
    { useNewUrlParser: true, useUnifiedTopology: true, },
    function (err) {
        if (err) {
            console.error(`error on connecting mongoose: ${err}`)
            throw err;
        }
    }
);