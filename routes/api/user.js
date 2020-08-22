const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../Models/User"); //The user model


//@route GET api/user
//@desc Test route
//@access Public
router.get('/test', (req,res) => res.send('user route test'));

//@route POST api/user
//@desc Register user
//@access Public
router.post(
  "/",
  //middleware that validate fields in request body
  [
     //check the value of the field,
    //rule must be included
    check("username", "Username must be at least 3 characters").isLength({
        min: 3
      }),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //indicating erros does exist
      return res.status(400).json({ errors: errors.array() });
      //If errors occur it will send back a message;
    }
    //Deconstruct body
    const { name, username, password } = req.body;

    try {
      /// Check if user already registered
      let user = await User.findOne({ username }); //find the user by username
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already register" }] });
        //just to make sure our format of error is consistent
      }
      //Get user avatar, by pass the username
      const avatar = gravatar.url(username, {
        protocol: 'https',
        s: "200",
        r: "pg",
        d: "denticon" //default img
      });
    
      user = new User({
        username,
        avatar,
        password
      }); // create a new user instance

      //Encrpty password
      //1. Generate a salt
      const salt = await bcrypt.genSalt(10);
      //2. Take the password and hash it
      user.password = await bcrypt.hash(password, salt);
      //Save user to the database
      await user.save();

      //Return jsonwebtoken
      //create payload
      const payload = {
        user: {
          id: user.id
        }
      };
      //sign jwt with the payload the secret
      jwt.sign(
        payload,
        config.get("token"),
        {
          expiresIn: 36000
        }, //expiration time
        (err, token) => {
          if (err) {
            throw err;
          } else res.json({ token });
        } // a callback that we either get an error or token
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Something wrong with the server");
    }
  }
);

module.exports = router;