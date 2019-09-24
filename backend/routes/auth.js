const Router = require('express').Router;

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../src/.env')});

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../utils/db');

const router = Router();

const createToken = () => {
  return jwt.sign({}, `${process.env.JWT_PRIVATEKEY}`, { expiresIn: '3h' });
};

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;

  db.getDb()
    .db()
    .collection('users')
    .findOne({email:email})
    .then(userDoc => {
      return bcrypt.compare(pw, userDoc.password);
    })
    .then((result) => {
      console.log(result);
      if (!result) throw Error();
      const token = createToken();
      res
        .status(200)
        .json({
          token: token,
          message: 'Authentication succeeded.'});
    })
    .catch(err => {
      res
        .status(401)
        .json({ message: 'Authentication failed, invalid username or password.' });
    });

});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;

  bcrypt.genSalt(8, function(err, salt)  {
    bcrypt.hash(pw, salt, function(err, hashedPW) {
      // Store hash in your password DB.
      db.getDb()
        .db()
        .collection('users')
        .insertOne({
          email: email,
          password: hashedPW
        })
        .then(result => {
        // console.log(result);
        const token = createToken();
        res
          .status(201)
          .json({token: token, user: {email: email}});
      })
        .catch(err => {
          console.log(err);
          res.status(500).json({message: err.errmsg});
        });
    });
  })
});

module.exports = router;
