var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

//The user schema atrributes/fields/characterisics
var UserSchema = new Schema({

	email:{type:String, unique: true, lowercase: true},
	password: String,

	profile:{
		name:{type: String, default: ''},
		picture:{type: String, default:''}
	},

	address:String,
	history:[{
		date: Date,
		paid:{type: Number, default:0}
	}]
});

//Hash the password before saving it to the database

UserSchema.pre('save', function(next) {     //pre is predefined method
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(10, function(err, salt) {
		if(err) return next(err);
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

//compare the password in database and the one user type in
UserSchema.methods.comparePasswords = function(password) {      //methods is use to create custom methods. Here password in function is not a password save in database 

	return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('User',UserSchema);