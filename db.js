const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb://localhost:27017/profileDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    fullName: String
});

userSchema.plugin(passportLocalMongoose, {
    selectFields : 'email password fullName'
});

const User = mongoose.model('User', userSchema);

module.exports = User;