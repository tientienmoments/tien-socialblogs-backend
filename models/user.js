const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String },
  friendCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
})

userSchema.plugin(require("./plugins/isDeletedFalse"));



//doc middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("avatar")) {
    this.avatar = "https://booksinthemedia.thebookseller.com/sites/all/themes/custom/bitm/images/avatar.png";
  }

  const salt = await bcrypt.genSalt(10);
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})
//query middleware


userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, { expiresIn: "1d" });
  return accessToken

}


module.exports = mongoose.model("User", userSchema);