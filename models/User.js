const mongoose = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const UserSchema = new mongoose.Schema({
  //use username instead of email to protect user privacy
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  state:{
    type:String,
    required:true
  },
  crop:{
    type:String,
    required:true
  },

});

module.exports = User = mongoose.model("users", UserSchema);
