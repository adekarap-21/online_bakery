const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const signupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    }
});

signupSchema.statics.findAndValidate = async function(username,password){
    const foundUser = await this.findOne({username});
    const isValid = await bcrypt.compare(password,foundUser.password);
    return isValid?foundUser:false;
}

signupSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password,12);
    next();
})
const Signup = mongoose.model('Signup', signupSchema);

module.exports = Signup;