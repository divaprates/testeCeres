const mongoose = require('mongoose');

const URI = "mongodb+srv://diva:12345@teste0.gdhzo.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.Promise = global.Promise;

module.exports = mongoose;