const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: String,
    hashedPassword: { type: String },
    token: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

userSchema.virtual( 'password' );

userSchema.pre( 'validate', async () => {
    if ( this.password === undefined ) return;

    try {
        const hash = await bcrypt.hash( this.password, 10 );
        console.log(hash, this.password);
        this.hashedPassword = hash;
    } catch (error) {
        console.log(error);
        throw error;
    }
} );

module.exports = mongoose.model( 'User', userSchema );