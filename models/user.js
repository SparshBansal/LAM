var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

var userSchema = mongoose.Schema({
	userName:{ type:String, required:true, unique:true},
	password:{	type: String,	required:true },
	createdAt:{	type:Date,		default:Date.now},
	displayName: 	String,
	bio: 	String
})

userSchema.methods.name = function(){
	return this.displayName || this.userName
}

var saltFactor = 10
var noop = function(){}

userSchema.pre("save", function(done){
	var user = this

	if (!user.isModified(password)) {
		return done()
	}

	bcrypt.genSalt(saltFactor, function(err, salt){

		if(err){
			return done(err)
		}
		bcrypt.hash(user.password, salt, noop, function(err, hashedPassword){
			if (err) {
				return done(err)
			}
			user.password = hashedPassword
			done()
		})
	})
})

userSchema.methods.checkPassword = function(){
	bcrypt.compare(guess, this.password, function(err, isMatch){
		done(err, isMatch)
	})
}

var User = mongoose.model("User", userSchema)
module.exports = User