const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

  
  //@route POST api/auth
  //@desc  authenticate user and get token
  //@access Public
  router.post(
    "/",
    [
      check("username", "A valid username is required").exists(),
      check("password", "Password is required").exists() //check password exist
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //indicating erros does exist
        return res.status(400).json({ errors: errors.array() });
        //If errors occur it will send back a message;
      }
      //Deconstruct body
      const { username, password } = req.body;
  
      try {
        //make request to the database, find the user by username
        let user = await User.findOne({ username });
        
        //if cannot find user
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid username or password" }] });
          //check if user does not exist, return the error message
        }
  
        //Use compare method of bcrypt, which compares plain text password
        //and encrypted password
        const isMatch = await bcrypt.compare(password, user.password);
        //password is the plain text password entered by the user
  
        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid username or password" }] });
          //check if password matchs, return the error message
        }
        //Note: for security, do not indicate if the user exist in the error message
  

        const payload = {
          user: {
            id: user.id
          }
        };
        jwt.sign(
          payload,
          config.get("jwtSecret"),
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
        console.error(err.messgae);
        res.status(500).send("Something wrong with the server");
      }
    }
  );
  
module.exports=router