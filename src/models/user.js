const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const saltOrRound = 8;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age should not be negative');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password should not contain 'password'")
            }
        }
    }
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, saltOrRound);
    }
    next();
})

userSchema.statics.findByCredientials = async (email, password) => {

    const user = await User.findOne({ email });
    if (!user) {
        console.log('User not found.');
        throw new Error('User not found.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log('Password didnot match.');
        throw new Error('Password didn\'t match.');
    }
    return user;


}
const User = mongoose.model('User', userSchema);

module.exports = User;