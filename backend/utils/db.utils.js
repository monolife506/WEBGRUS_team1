module.exports.init = () => {
    const mongoose = require('mongoose');
    const db = mongoose.connection;

    db.on('error', console.error);
    db.once('open', () => { console.log("Connected to mongodb server") });

    mongoose.connect(
        'mongodb://root:webgrus01@mongodb.aymnas.tk/webgrus?authSource=admin',
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err) => {
            if (err) {
                console.error(`error on connecting mongoose: ${err}`)
                throw err;
            }
        }
    );
}