import express from 'express'
let router = express.Router()

import { sign, verify } from 'jsonwebtoken'

/**
 * This function returns a signed JWT token based on the given username and Password
 * @name Login
 * @param {object} req body contains username and password
 * @param {object} res contains the output json with token
 * @param {function} next
 * @return {json} signed JWT token, {token: JWT_TOKEN}
 */

router.post('/login', (req, res, next) => {
  if (typeof req.body.username !== 'undefined' && typeof req.body.password !== 'undefined') {
    let token = sign({ 'username': req.body.username, 'password': req.body.password }, 'anil')
    res.status(200)
    res.json({token: token})
  } else {
    res.status(400)
    res.json({message: 'missing username or password'})
  }
})

/**
 * Token Verification
 * @name verify Token
 * @param {object} req contains headers
 * @param {object} res contains the decoded username and password
 * @param {function} next
 */
//
router.post('/authorize', (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    let token = req.headers.authorization
    verify(token, 'anil', function (err, decoded) {
      if (err) {
        res.status(400)
        res.json({'message': 'Invalid signature'})
      } else {
        res.status(200)
        res.json({'username': decoded.username, 'password': decoded.password})
      }
    })
  } else {
    res.status(400)
    res.json({'message': 'Headers not found'})
  }
   // console.log(req.headers);
   // console.log(req.headers.authorization);
})

module.exports = router
